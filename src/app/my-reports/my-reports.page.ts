import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import {
  Downloader,
  DownloadRequest,
  NotificationVisibility,
} from "@ionic-native/downloader/ngx";
import { HttpService } from "../http.service";
import { UtilityService } from "../utility.service";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-my-reports",
  templateUrl: "./my-reports.page.html",
  styleUrls: ["./my-reports.page.scss"],
})
export class MyReportsPage implements OnInit {
  public reports: any = [];
  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    private platform: Platform,
    private router: Router,
    private downloader: Downloader,
    private location: Location,
    private http: HttpService,
    private utility: UtilityService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.getMyReports();
    });
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
      this.goBack();
    });
  }

  ngOnInit() {}

  goBack() {
    this.router.navigateByUrl("/home");
  }

  addreport() {
    this.router.navigateByUrl("/add-reports");
  }

  getMyReports() {
    this.utility.showLoading();
    let user = JSON.parse(localStorage.getItem("user_details"));
    this.http.getMyReports("allReports/" + "user/" + user.id).subscribe(
      (res: any) => {
        if (res.success) {
          this.reports = res.data;
          this.reports.map((x) => {
            x.type = x.report.split(".").pop();
          });

          this.utility.hideLoading();
        } else {
          this.utility.hideLoading();
          this.utility.showMessageAlert(
            "No Reports Added!",
            "You have not added any reports."
          );
        }
      },
      (err) => {
        this.utility.hideLoading();
        this.utility.showMessageAlert("Error", "Something went wrong");
      }
    );
  }

  downloadReport(uri) {
    var request: DownloadRequest = {
      uri: uri,
      title: this.utility.user.user_name + new Date().getTime(),
      description: "",
      mimeType: "",
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: "Downloads",
        subPath: uri.split("/")[1],
      },
    };

    this.downloader
      .download(request)
      .catch((error: any) => console.error(error));
  }

  async deleteReport(id) {
    let parms = {
      report_id: id,
    };
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Are You Sure",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Delete",
          handler: () => {
            this.http.deleteReport("deleteReport", parms).subscribe(
              (res: any) => {
                console.log(res);
                this.getMyReports();
              },
              (err) => {
                console.log(err);
              }
            );
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }
}
