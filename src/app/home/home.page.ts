import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { Badge } from "@ionic-native/badge/ngx";
import { MenuController } from "@ionic/angular";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HttpService } from "../http.service";
import { UtilityService } from "../utility.service";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  // tslint:disable-next-line: max-line-length
  constructor(
    private statusBar: StatusBar,
    private menu: MenuController,
    private badge: Badge,
    private utility: UtilityService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private iab: InAppBrowser
  ) {
    this.statusBar.backgroundColorByHexString("#ffffff");
    this.route.queryParams.subscribe((params) => {
      const user = JSON.parse(localStorage.getItem("user_details"));
      if (user.profile_update === "0") {
        const navigationExtras: NavigationExtras = {
          state: {
            user: JSON.parse(localStorage.getItem("user_details")),
          },
        };
        this.router.navigate(["/edit-profile"], navigationExtras);
      }

      this.badge.clear();
      this.getAllDoctors();
    });
  }

  paynow() {
    // const browser = this.iab.create(
    //   "http://testing.isocare.in/paymentTest",
    //   "_system"
    // );
    // browser.on("loadstop").subscribe((event) => {
    //   browser.insertCSS({ code: "body{color: red;" });
    // });
  }

  bookOPD() {
    if (localStorage.getItem("location_id") === undefined) {
      this.http.getLocations("allLocations");
      const navigationExtras: NavigationExtras = {
        state: {
          book_type: "OPD",
        },
      };
      this.router.navigate(["/select-location"], navigationExtras);
    } else {
      this.http.getLocations("allLocations");
      const navigationExtras: NavigationExtras = {
        state: {
          location_id: localStorage.getItem("location_id"),
          location_name: localStorage.getItem("location_name"),
          helpline_number: localStorage.getItem("helpline_number"),
          book_type: "OPD",
        },
      };
      this.router.navigate(["/select-specility"], navigationExtras);
    }
  }

  ionViewWillEnter() {}
  myReports() {
    this.router.navigateByUrl("/my-reports");
  }

  bookVideoCall() {
    if (localStorage.getItem("location_id") === undefined) {
      this.http.getLocations("allLocations");
      const navigationExtras: NavigationExtras = {
        state: {
          book_type: "videocall",
        },
      };
      this.router.navigate(["/select-location"], navigationExtras);
    } else {
      this.http.getLocations("allLocations");
      const navigationExtras: NavigationExtras = {
        state: {
          location_id: localStorage.getItem("location_id"),
          location_name: localStorage.getItem("location_name"),
          helpline_number: localStorage.getItem("helpline_number"),
          book_type: "videocall",
        },
      };
      this.router.navigate(["/select-specility"], navigationExtras);
    }
  }

  aboutUs() {
    this.router.navigateByUrl("/about");
  }

  blogs() {
    this.router.navigateByUrl("/blogs");
  }

  chatWithDoctor() {
    const a = localStorage.getItem("payment_status");

    if (a !== "false" && a != null) {
      this.router.navigateByUrl("/chat-lists");
    } else {
      this.router.navigateByUrl("/chat-with-doctor");
    }
  }

  myAppointments() {
    this.router.navigate(["/my-appointments"]);
  }
  account() {
    this.router.navigate(["/profile"]);
  }
  openMenu() {
    this.menu.enable(true, "first");
  }

  getAllDoctors() {
    this.http.getAllDoctors("allDoctors").subscribe(
      (res: any) => {
        if (res.success) {
          this.utility.all_doctors = res.data;
        } else {
        }
      },
      (err) => {}
    );
  }
}
