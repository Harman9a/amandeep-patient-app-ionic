import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import codes from "country-calling-code";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase";

// import { AngularFireAuth } from "@angular/fire/auth";
import { HttpService } from "../http.service";
import { UtilityService } from "../utility.service";
import { AlertController, Platform, ToastController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage {
  counter = 0;
  public codes: any;
  public dial_code;
  public mobile_no = "";
  public password;
  public showPassword = false;
  constructor(
    private statusBar: StatusBar,
    private googlePlus: GooglePlus,
    public platform: Platform,
    public toastController: ToastController,
    // private _location: Location,
    public alertController: AlertController,

    private fb: Facebook,

    private afAuth: AngularFireAuth,
    private router: Router,
    private http: HttpService,
    private utility: UtilityService
  ) {
    this.statusBar.backgroundColorByHexString("#ffffff");
    // this.codes = codes;
    this.mobile_no = "";
    this.platform.ready().then(() => {
      document.addEventListener("backbutton", async () => {
        (navigator as any).app.exitApp();
        // if (this.counter === 0) {
        //   this.counter++;
        //   this.alertToast();
        //   setTimeout(() => {
        //     this.counter = 0;
        //   }, 2000);
        // } else {
        //   (navigator as any).app.exitApp();
        // }
      });
    });
    // this.initializeApp();
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.mobile_no = "";
    this.password = "";
  }

  login() {
    if (this.mobile_no == undefined) {
      this.utility.showMessageAlert(
        "Mobile number required!",
        "Please enter your mobile number."
      );
    } else if (this.mobile_no.toString().length != 10) {
      this.utility.showMessageAlert(
        "Invalid mobile number!",
        "The mobile number you have entered is not valid."
      );
    } else if (this.password == undefined) {
      this.utility.showMessageAlert(
        "Password required!",
        "Please enter the password."
      );
    } else {
      this.utility.showLoading();
      const params = {
        mobile_no: this.mobile_no.toString(),
        password: this.password,
        device_token:
          this.utility.device_token == undefined
            ? "devicetoken"
            : this.utility.device_token,
        device_type:
          this.utility.device_type == undefined
            ? "devicetype"
            : this.utility.device_type,
      };
      this.http.post("login", params).subscribe(
        (res: any) => {
          this.mobile_no = "";
          this.password = "";
          this.utility.hideLoading();
          if (res.success == true) {
            this.utility.showMessageAlert(
              "Welcome " + res.data["user"].user_name + "!",
              "We are hoping to provide you the best."
            );
            this.utility.user = res.data["user"];
            if (this.utility.user.profile_photo != null) {
              this.utility.image = this.utility.user.profile_photo;
            } else {
              this.utility.image = "assets/imgs/no-profile.png";
            }
            res.data.user.profile_update = "1";
            localStorage.setItem(
              "user_details",
              JSON.stringify(res.data["user"])
            );
            localStorage.setItem("token", JSON.stringify(res.data["token"]));
            localStorage.setItem("payment_status", res["payment_status"]);
            this.router.navigateByUrl("/home");
          } else {
            this.utility.showMessageAlert("Error", res.message);
          }
        },
        (err) => {
          this.utility.hideLoading();
        }
      );
    }
  }

  facebookLogin() {
    this.fb
      .login(["public_profile", "email"])
      .then((res: FacebookLoginResponse) => {
        console.log("this :::", this.fb.getCurrentProfile);

        this.utility.showLoading();
        //      const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);

        if (res.status == "connected") {
          const params = {
            social_id: res.authResponse.userID,
            type: 2,
            user_name: "User",
            email: "",
            profile_photo: "",
            device_token:
              this.utility.device_token == undefined
                ? "devicetoken"
                : this.utility.device_token,
            device_type:
              this.utility.device_type == undefined
                ? "devicetype"
                : this.utility.device_type,
          };

          this.http.socialLogin("socialLogin", params).subscribe(
            (res: any) => {
              this.utility.hideLoading();

              if (res.success == true) {
                this.utility.showMessageAlert(
                  "Welcome " + res.data["user"].user_name + "!",
                  "We are hoping to provide you the best."
                );
                this.utility.user = res.data["user"];
                if (this.utility.user.profile_photo != null) {
                  this.utility.image = this.utility.user.profile_photo;
                } else {
                  this.utility.image = "assets/imgs/no-profile.png";
                }
                if (
                  res.data.user.phone_number == "" ||
                  res.data.user.phone_number == null
                ) {
                  res.data.user.profile_update = "0";
                } else {
                  res.data.user.profile_update = "1";
                }
                localStorage.setItem(
                  "user_details",
                  JSON.stringify(res.data["user"])
                );
                localStorage.setItem(
                  "token",
                  JSON.stringify(res.data["token"])
                );
                localStorage.setItem("payment_status", res["payment_status"]);
                this.router.navigateByUrl("/home");
              } else {
                this.utility.showMessageAlert("Error", res.message);
              }
            },
            (err) => {
              this.utility.hideLoading();
            }
          );
        }

        // this.afAuth.auth.signInWithCredential(credential)
        //     .then((response) => {

        //        let user = JSON.stringify(response);

        // });
      })
      .catch((e) => {
        // alert(JSON.stringify(e));
        // this.utility.showMessageAlert("Facebook login error", "");
        // this.fb.logout().then(() => { }).catch(() => { });
      });
  }

  googlePlusLogin() {
    this.googlePlus
      .login({})
      .then((res) => {
        this.utility.showLoading();

        const params = {
          social_id: res.userId,
          type: 3,
          user_name: res.displayName,
          email: res.email,
          profile_photo: res.imageUrl,
          device_token:
            this.utility.device_token == undefined
              ? "devicetoken"
              : this.utility.device_token,
          device_type:
            this.utility.device_type == undefined
              ? "devicetype"
              : this.utility.device_type,
        };

        this.http.socialLogin("socialLogin", params).subscribe(
          (res: any) => {
            this.utility.hideLoading();
            if (res.success == true) {
              res.data.user.profile_update = "0";
              this.utility.showMessageAlert(
                "Welcome " + res.data["user"].user_name + "!",
                "We are hoping to provide you the best."
              );
              this.utility.user = res.data["user"];
              if (this.utility.user.profile_photo != null) {
                this.utility.image = this.utility.user.profile_photo;
              } else {
                this.utility.image = "assets/imgs/no-profile.png";
              }
              if (
                res.data.user.phone_number == "" ||
                res.data.user.phone_number == null
              ) {
                res.data.user.profile_update = "0";
              } else {
                res.data.user.profile_update = "1";
              }
              localStorage.setItem(
                "user_details",
                JSON.stringify(res.data["user"])
              );
              localStorage.setItem("token", JSON.stringify(res.data["token"]));
              localStorage.setItem("payment_status", res["payment_status"]);
              this.router.navigateByUrl("/home");
            } else {
              this.utility.showMessageAlert("Error", res.message);
            }
          },
          (err) => {
            this.utility.hideLoading();
          }
        );
      })
      .catch((err) => {
        // console.error("2", err);
        this.utility.showMessageAlert("Google login error", err);
      });
  }

  signup() {
    this.router.navigate(["/sign-up"]);
  }

  goForgotpassword() {
    this.router.navigate(["/forgot-password"]);
  }

  async alertToast() {
    const toast = await this.toastController.create({
      message: "Press again to exit",
      duration: 300,
      position: "middle",
    });
    toast.present();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}

// 9C:D9:29:DF:4D:CB:04:F1:EE:C9:2B:10:FD:B1:0E:90:0D:BB:66:E0
