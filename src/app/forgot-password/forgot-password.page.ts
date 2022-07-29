import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

    show_mobile_field: boolean = true;
    show_otp_field: boolean = false;
    show_new_password: boolean = false;
    mobile_no = "";
    newPassword = "";
    confirmPassword = "";
    showPassword: string = "password";
    iconName: string = "eye-outline"

    otp: ""

    config = {
        allowNumbersOnly: true,
        length: 4,

        disableAutoFocus: true,
        placeholder: '',
        inputStyles: {
            'width': '20px',
            'height': '30px'
        }
    };


    public user_id;
    public value1;
    public value2;
    public value3;
    public value4;
    constructor(private statusBar: StatusBar, private location: Location, private router: Router, private route: ActivatedRoute, private http: HttpService, private utility: UtilityService) {
        this.statusBar.backgroundColorByHexString('#ffffff');

    }

    ngOnInit() { }

    goBack() {
        this.location.back();
    }
    sendOtp() {
        if (this.mobile_no.length == 10) {



            this.utility.showLoading();
            let params = {
                mobile: this.mobile_no,

            }
            this.http.get("sendOtp/forgotPassword/" + this.mobile_no, params).subscribe(
                (res: any) => {
                    this.utility.hideLoading();

                    if (res.message == "Otp Sent Successfully") {
                        this.utility.showMessageAlert("Success!", "OTP sent successfully. Please enter otp ..");

                        this.show_mobile_field = false;
                        this.show_otp_field = true;
                        this.show_new_password = false;

                    }
                    else {
                        this.utility.hideLoading();
                        this.utility.showMessageAlert("Network error!", "User not exist. Please check your number")
                    }

                }, err => {
                    this.utility.hideLoading();
                    this.utility.showMessageAlert("Network error!", "Please check your network connection.")
                })

        }
        else {
            this.utility.showMessageAlert("Error!", "Please enter valid mobile number")
        }

    }
    onKeyPressNum(event) {
        if ((event.keyCode >= 48 && event.keyCode <= 57)) {
            return true
        }
        else {
            return false
        }
    }
    visibilitycheck() {

        if (this.showPassword == 'password') {
            this.showPassword = "text";
            this.iconName = "eye-off-outline"

        }
        else {
            this.showPassword = "password";
            this.iconName = "eye-outline"

        }

    }
    update_db_password() {

        if (this.newPassword.length < 8) {
            this.utility.showMessageAlert("Error!", "Password should be atlest 8 characters")
            return;

        }
        else if (this.confirmPassword != this.newPassword) {
            this.utility.showMessageAlert("Error!", "Passwords not match. Please check confirm and new password")
            return;
        }

        else if (this.confirmPassword == this.newPassword) {
            this.utility.showLoading();
            let params = {
                np: this.newPassword,

            }
            this.http.get("forgotPassword/mobile/" + this.mobile_no + "/otp/" + this.otp + "/newpassword/" + this.newPassword).subscribe(
                (res: any) => {
                    this.utility.hideLoading();

                    if (res.success) {
                        this.utility.showMessageAlert("Congratulation", "Your new password is successfully updated. Please login ...");

                        this.router.navigate(['/login'])

                    }

                }, err => {
                    this.utility.hideLoading();
                    this.utility.showMessageAlert("Network error!", "Please check your network connection.")
                })
        }

    }

    verifyOtp() {
        this.utility.showMessageAlert("", "Please enter the OTP sent to your mobile number.");
    }

    automaticallyVerifyOTP($event) {
        if ($event.length == 4) {


            this.otp = $event;

            this.utility.showLoading();

            this.http.get("verify/forgotPassword/" + this.mobile_no + "/otp/" + $event).subscribe(
                (res: any) => {
                    this.utility.hideLoading();

                    if (res.success) {

                        this.utility.showMessageAlert("OTP verified!", "Your mobile number has been verified.");
                        this.show_mobile_field = false;
                        this.show_otp_field = false;
                        this.show_new_password = true;


                    } else {
                        this.utility.showMessageAlert("Wrong OTP!", "You have entered wrong OTP");
                    }

                }, err => {
                    this.utility.hideLoading();
                    this.utility.showMessageAlert("Network error!", "Please check your network connection.")
                })
        }

    }

    resendOTP() {
        this.utility.showLoading();
        let params = {
            user_id: this.user_id
        }
        this.http.post("resendOTP", params).subscribe(
            (res: any) => {
                if (res.success) {
                    this.utility.showToast(res.message);
                    this.utility.showMessageAlert("OTP sent!", res.message)

                }
                this.utility.hideLoading();

            }, err => {

                this.utility.hideLoading();
                this.utility.showMessageAlert("Network error!", "Please check your network connection.")

            })
    }

}