import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ActionSheetController, MenuController } from "@ionic/angular";
import { Push, PushObject, PushOptions } from "@ionic-native/push/ngx";
import { Badge } from "@ionic-native/badge/ngx";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";

import {
  FacebookService,
  InitParams,
  UIParams,
  UIResponse,
} from "ngx-facebook";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { ChatsService } from "./chats.service";
import { HttpService } from "./http.service";
import { UtilityService } from "./utility.service";
import { GooglePlus } from "@ionic-native/google-plus/ngx";

declare var cordova: any;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  public user: any;
  public image: any;

  public menu = [
    {
      title: "Home",
      url: "/home",
      icon: "home-outline",
      show_submenu: false,
    },
    {
      title: "Book Appointment",
      url: "",
      icon: "calendar",
      show_submenu: false,
      sub_menu_icon: "chevron-forward-outline",
      submenu: [
        {
          title: "Book OPD Consultation",
          url: "",
          icon: "calendar",
        },
        {
          title: "Book Video Consultation",
          url: "",
          icon: "phone-portrait-outline",
        },
        {
          title: "Chat with Doctor",
          url: "",
          icon: "chatbox-ellipses-outline",
        },
      ],
    },
    {
      title: "Profile",
      url: "",
      icon: "person",
      sub_menu_icon: "chevron-forward-outline",
      show_submenu: false,
      submenu: [
        {
          title: "My Profile",
          url: "/profile",
          icon: "person-outline",
        },

        {
          title: "My Appointments",
          url: "/my-appointments",
          icon: "calendar-outline",
        },
        {
          title: "My Reports",
          url: "/my-reports",
          icon: "receipt-outline",
        },
      ],
    },
    // {
    //   show_submenu: false,
    //   title: "Book OPD Consultation",
    //   url: "",
    //   icon: "calendar",
    // },
    // {
    //   show_submenu: false,
    //   title: "Book Video Consultation",
    //   url: "",
    //   icon: "phone-portrait-outline",
    // },
    // {
    //   show_submenu: false,
    //   title: "Chat with Doctor",
    //   url: "",
    //   icon: "chatbox-ellipses-outline",
    // },
    {
      show_submenu: false,
      title: "Ask a Query",
      url: "/query",
      icon: "help",
    },
    {
      show_submenu: false,
      title: "Videos",
      url: "/videos",
      icon: "logo-youtube",
    },
    {
      show_submenu: false,
      title: "Blogs",
      url: "/blogs",
      icon: "newspaper-outline",
    },
    // {
    //   show_submenu: false,
    //   title: "My Reports",
    //   url: "/my-reports",
    //   icon: "receipt-outline",
    // },
    // {
    //   show_submenu: false,
    //   title: "My Appointments",
    //   url: "/my-appointments",
    //   icon: "calendar-outline",
    // },
    // {
    //   show_submenu: false,
    //   title: "My Profile",
    //   url: "/profile",
    //   icon: "person-outline",
    // },
    {
      show_submenu: false,
      title: "Change Password",
      url: "/change-password",
      icon: "lock-closed-outline",
    },
    {
      show_submenu: false,
      title: "About Us",
      url: "/about",
      icon: "help",
    },
    {
      show_submenu: false,
      title: "Contact Us",
      url: "/contact-us",
      icon: "call",
    },
    {
      show_submenu: false,
      title: "Share via",
      url: "",
      icon: "share-social-outline",
    },
    {
      show_submenu: false,
      title: "Logout",
      url: "/login",
      icon: "log-in-outline",
    },
  ];
  constructor(
    private googlePlus: GooglePlus,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private push: Push,
    private badge: Badge,
    private emailComposer: EmailComposer,
    private androidPermissions: AndroidPermissions,
    private backgroundMode: BackgroundMode,
    private fb: FacebookService,
    private socialSharing: SocialSharing,
    public localNotifications: LocalNotifications,
    private http: HttpService,
    private chats: ChatsService,
    public utility: UtilityService,
    public menuController: MenuController
  ) {
    const initParams: InitParams = {
      appId: "770655650783900",
      xfbml: true,
      version: "v2.8",
    };

    this.fb.init(initParams);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#FF0000");
      this.splashScreen.hide();
      if (this.platform.is("android")) {
        this.utility.device_type = "android";
      }
      if (this.platform.is("ios")) {
        this.utility.device_type = "ios";
      }

      // this.backgroundMode.enable();
      this.pushNotification();
      this.androidPermissions
        .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        .then(
          (result) => {
            // tslint:disable-next-line: triple-equals
            if (result.hasPermission == false) {
              this.androidPermissions.requestPermissions([
                this.androidPermissions.PERMISSION.CAMERA,
                this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
                this.androidPermissions.PERMISSION.RECORD_AUDIO,
              ]);
            }
          },
          (err) => {
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.CAMERA
            );
          }
        );
      // tslint:disable-next-line: triple-equals
      if (JSON.parse(localStorage.getItem("token")) != undefined) {
        // this.getChats();
        this.user = JSON.parse(localStorage.getItem("user_details"));
        this.getBanners();
        this.utility.user = JSON.parse(localStorage.getItem("user_details"));

        // tslint:disable-next-line: triple-equals
        if (
          this.utility.user.profile_photo != null ||
          this.utility.user.profile_photo != undefined
        ) {
          this.utility.image = this.utility.user.profile_photo;
        } else {
          this.utility.image = "assets/imgs/no-profile.png";
        }
        this.router.navigate(["home"]);
      } else {
        this.router.navigate(["login"]);
      }
    });
  }

  getBanners() {
    this.http.getAllBanners("getBanners").subscribe((res: any) => {
      this.utility.banners = res.data;
    });
  }

  share() {
    const params: UIParams = {
      href: "https://github.com/zyra/ngx-facebook",
      method: "share",
    };

    this.fb
      .ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));
  }

  shareViaEmail() {
    const email = {
      to: "",
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      // attachments: [
      //   'file://img/logo.png',
      //   'res://icon.png',
      //   'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
      //   'file://README.pdf'
      // ],
      subject: "Amandeep Hospital App",
      body: "Hello Dear,<br>  I am inviting you to join this Amandeep hospital home care for doctor appointment.",
      isHtml: true,
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }

  chooseOption(page) {
    // tslint:disable-next-line: triple-equals
    if (page == "Logout") {
      this.utility.showLoading();
      setTimeout(() => {
        this.googlePlus
          .logout()
          .then((res) => console.log("Googleplus logout res", res))
          .catch((e) => console.log("Error logout from Googleplus", e));
        this.fb
          .logout()
          .then((res) => console.log("Facebook logout res", res))
          .catch((e) => console.log("Error logout from Facebook", e));
        this.menuController.toggle();
        localStorage.removeItem("token");
        localStorage.removeItem("user_details");
        localStorage.clear();
        this.utility.hideLoading();
        this.router.navigate(["login"], { replaceUrl: true });
      }, 3000);
    }
    // tslint:disable-next-line: triple-equals
    else if (page == "Home") {
      this.menuController.toggle();
      this.router.navigate(["/home"]);
    }
    // tslint:disable-next-line: triple-equals
    else if (page === "Ask a Query") {
      this.menuController.toggle();
      this.router.navigate(["/query"]);
    } else if (page === "Videos") {
      this.menuController.toggle();
      this.router.navigate(["/videos"]);
    } else if (page === "Blogs") {
      this.menuController.toggle();
      this.router.navigate(["/blogs"]);
    } else if (page === "Change Password") {
      this.menuController.toggle();
      this.router.navigate(["/change-password"]);
    } else if (page === "About Us") {
      this.menuController.toggle();
      this.router.navigate(["/about"]);
    } else if (page === "Contact Us") {
      this.menuController.toggle();
      this.router.navigate(["/contact-us"]);
    }
    if (page === "Book OPD Consultation") {
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
    if (page === "Book Video Consultation") {
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
    if (page === "Chat with Doctor") {
      const a = localStorage.getItem("payment_status");
      if (a !== "false") {
        this.router.navigateByUrl("/chat-lists");
      } else {
        this.router.navigateByUrl("/chat-with-doctor");
      }
      // this.utility.showMessageAlert("Work in progress","Discussion reuqired")
    }
    // tslint:disable-next-line: triple-equals
    if (page === "Share via") {
      this.ShareThisApp();
      // this.menuController.toggle();
      // this.socialSharingApp();
    }
  }

  async socialSharingApp() {
    const options = {
      message:
        "Hello Dear,\n\n I am inviting you to join this Amandeep hospital home care for doctor appointment.\n",
      subject: "Amandeep Hospital App", // fi. for email

      url: "https://play.google.com/store/apps/details?id=amandeephospital.patientapp\n",
      chooserTitle: "Pick an app", // Android only, you can override the default share sheet title
      appPackageName: "amandeephospital.patientapp.com", // Android only, you can provide id of the App you want to share with
    };

    // this.socialSharing.shareWithOptions(options);

    const actionSheet = await this.actionSheetController.create({
      header: "Share our app on your social handels",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Share via facebook",
          icon: "logo-facebook",
          handler: () => {
            this.socialSharing
              .shareViaFacebook(options.message, "", options.url)
              .then(() => {})
              .catch((err) => {});
            // this.share();
          },
        },
        {
          text: "Share via whatsapp ",
          icon: "logo-whatsapp",
          handler: () => {
            // this.socialSharing
            //   .shareViaWhatsApp(options.message, "", options.url)
            //   .then(() => {})
            //   .catch((err) => {});
            this.socialSharing
              .share(options.message, "", options.url)
              .then(() => {})
              .catch((err) => {});
            // this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Share via email ",
          icon: "mail-outline",
          handler: () => {
            // this.socialSharing.shareViaEmail(options.message, "", options.url).then(() => {

            // }).catch((err) => {

            // });
            this.shareViaEmail();
          },
        },
        {
          text: "Cancel",
          role: "destructive",
          icon: "close",
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }
  async ShareThisApp() {
    const options = {
      message:
        "Hello Dear,\n\n I am inviting you to join this Amandeep hospital home care for doctor appointment.\n https://play.google.com/store/apps/details?id=amandeephospital.patientapp",
      subject: "Amandeep Hospital App", // fi. for email
      url: "",
      chooserTitle: "Pick an app", // Android only, you can override the default share sheet title
      appPackageName: "amandeephospital.patientapp.com", // Android only, you can provide id of the App you want to share with
    };
    this.socialSharing
      .share(options.message, "", options.url)
      .then(() => {})
      .catch((err) => {});
  }
  pushNotification() {
    const options: PushOptions = {
      android: {
        // badge:true,
        sound: true,
        vibrate: true,
      },
      ios: {
        alert: "true",
        badge: true,
        sound: "true",
      },
      windows: {},
      browser: {
        pushServiceURL: "http://push.api.phonegap.com/v1/push",
      },
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on("notification").subscribe((notification: any) => {
      this.badge.set(1);

      if (notification.additionalData.notification_type === "start_call") {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message,
        });

        const navigationExtras: NavigationExtras = {
          state: {
            streamId: notification.additionalData["unique ID"],
            channel_name: notification.additionalData.channel,
          },
        };
        this.router.navigateByUrl("/video-call-appointment", navigationExtras);
      } else if (notification.additionalData.notification_type === "end_call") {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message,
        });

        this.utility.showMessageAlert(notification.title, notification.message);
        this.utility.publishEvent({
          "call:ended": notification.title,
        });
      } else if (notification.additionalData.notification_type === "chat") {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message,
        });
      } else {
        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message,
        });
        this.utility.publishEvent({
          "message:recieved": notification,
        });
      }
    });

    pushObject.on("registration").subscribe((registration: any) => {
      this.utility.device_token = registration.registrationId;
    });

    pushObject
      .on("error")
      .subscribe((error) => console.error("Error with Push plugin", error));
  }
  showSubmenu(menuHeaderIndex) {
    if (this.menu[menuHeaderIndex].sub_menu_icon) {
      if (this.menu[menuHeaderIndex].sub_menu_icon === "chevron-down-outline") {
        this.menu[menuHeaderIndex].sub_menu_icon = "chevron-forward-outline";
        this.menu[menuHeaderIndex].show_submenu = false;
      } else {
        this.menu[menuHeaderIndex].sub_menu_icon = "chevron-down-outline";
        this.menu[menuHeaderIndex].show_submenu = true;
      }
    }
  }
}
