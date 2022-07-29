import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';
import { Zoom } from '@ionic-native/zoom/ngx';
@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.page.html',
  styleUrls: ['./my-appointments.page.scss'],
})
export class MyAppointmentsPage implements OnInit {
  appointments: any = [];
  constructor(private zoomService: Zoom, private statusBar: StatusBar, private route: ActivatedRoute, private location: Location, private launchNavigator: LaunchNavigator, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.statusBar.backgroundColorByHexString('#ffffff');
  }

  ngOnInit() {
    this.getMyAppointments();

    this.zoomService.initialize("3wraHyGLqD8692oDJLseyGfhphRUcW0JNvq2", "cEpIaeOTtDvGKcuNzXZYSQVDbJKDTRLuWkjl")
      .then((success: any) => {




      })
      .catch((error: any) => console.log(error));

  }


  getUpdatedMeeting(data) {
    this.utility.showLoading();
    let user = JSON.parse(localStorage.getItem('user_details'))
    this.http.getMyAppointments('getUpdatedMeeting/meetingid/' + data.id).subscribe(
      (res: any) => {

        this.utility.hideLoading();
        if (res.success) {
          this.videocall(res.data, data.patient_details.name);
        } else {
          this.utility.showMessageAlert("No Appointments!", "You have no appointments booked yet.")
        }
      }, err => {
        this.utility.hideLoading();
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      })
  }


  videocall(data, patientName) {

    // this.router.navigateByUrl("/video-call-appointment");
    let options = {
      "no_driving_mode": true,
      "no_invite": true,
      "no_meeting_end_message": true,
      "no_titlebar": false,
      "no_bottom_toolbar": false,
      "no_dial_in_via_phone": true,
      "no_dial_out_to_phone": true,
      "no_disconnect_audio": true,
      "no_share": true,
      "no_audio": false,
      "no_video": false,
      "no_meeting_error_message": true
    };
    this.zoomService.joinMeeting(data.videoMeetingId, data.videoMeetingPassCode, patientName, options)
      .then((success: any) => console.log(success))
      .catch((error: any) => {


        this.utility.showMessageAlert("Error!", "Meeting is not started yet.");

      });
    return;


    this.zoomService.isLoggedIn()
      .then((success: boolean) => {

        if (success) {
          this.startMeeting();
        }
        else {
          this.zoomService.login("earlybirds1947@gmail.com", "Roushan123##")
            .then((success: any) => {
              console.log(success)
              this.startMeeting();


            })
            .catch((error: any) => console.log(error));
        }
      })
      .catch((error: any) => console.log(error));

  }

  startMeeting() {

    let options = {
      "no_driving_mode": true,
      "no_invite": true,
      "no_meeting_end_message": true,
      "no_titlebar": false,
      "no_bottom_toolbar": false,
      "no_dial_in_via_phone": true,
      "no_dial_out_to_phone": true,
      "no_disconnect_audio": true,
      "no_share": true,
      "no_audio": true,
      "no_video": true,
      "no_meeting_error_message": true
    };

    this.zoomService.startInstantMeeting(options)
      .then((success: any) => console.log(success))
      .catch((error: any) => console.log(error));
  }



  getMyAppointments() {
    this.utility.showLoading();
    let user = JSON.parse(localStorage.getItem('user_details'))
    this.http.getMyAppointments('allAppointments/user/' + user.id).subscribe(
      (res: any) => {

        this.utility.hideLoading();
        if (res.success) {
          // this.appointments = res.data;
          res.data['OPD'].map(x => {
            x.type = 'OPD'
            this.appointments.push(x);
          });
          res.data['Video'].map(x => {
            x.type = 'Video'
            this.appointments.push(x);
          });


          if (this.appointments.length == 0) {
            this.utility.showMessageAlert("No Appointments!", "You have no appointments booked yet.")
          }
        } else {
          this.utility.showMessageAlert("No Appointments!", "You have no appointments booked yet.")
        }
      }, err => {
        this.utility.hideLoading();
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      })
  }

  goBack() {
    this.location.back();
  }


  showMap(address, location) {
    let location_name = address + location;
    this.launchNavigator.navigate(location_name)
      .then(
      );
  }

}
