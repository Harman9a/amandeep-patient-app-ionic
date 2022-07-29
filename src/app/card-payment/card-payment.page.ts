import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ModalController, AlertController, Platform } from "@ionic/angular";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

import { Location } from "@angular/common";

import { Stripe } from "@ionic-native/stripe/ngx";
import { HttpService } from "../http.service";
import { UtilityService } from "../utility.service";
import * as moment from "moment";

@Component({
  selector: "app-card-payment",
  templateUrl: "./card-payment.page.html",
  styleUrls: ["./card-payment.page.scss"],
})
export class CardPaymentPage implements OnInit {
  private data: any;
  public name: string;
  public number = "";
  public cvv = "";
  public expiry_date;
  public srcOf = "http://testing.isocare.in/amandeepAdminPanel/public/";
  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private location: Location,
    private route: ActivatedRoute,
    private stripe: Stripe,
    private router: Router,
    private iab: InAppBrowser,

    private http: HttpService,
    private utility: UtilityService
  ) {
    this.data = JSON.parse(localStorage.getItem("confirm-appointment"));

    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
      this.dismiss();

      //   this.utility.showMessageAlert("Payment Cancelled", "Your payment has been cancelled");
      this.router.navigateByUrl("/home");
    });
  }

  ngOnInit() {}
  onKeyPressNum(event) {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      return true;
    } else {
      return false;
    }
  }

  onKeyPress(event) {
    if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122) ||
      event.keyCode == 32 ||
      event.keyCode == 46
    ) {
      return true;
    } else {
      return false;
    }
  }
  selectCurrentDate() {
    const d = new Date();
    return new Date(
      new Date().setFullYear(new Date().getFullYear())
    ).toISOString();
  }

  payNow() {
    const browser = this.iab.create(
      "http://testing.isocare.in/paymentTest",
      "_blank"
    );
    browser.on("loadstop").subscribe((event) => {
      browser.insertCSS({ code: "body{color: red;" });
    });
  }

  payNow2() {
    if (
      this.name == undefined ||
      this.number == undefined ||
      this.cvv == undefined ||
      this.expiry_date == undefined
    ) {
      this.utility.showMessageAlert(
        "Missing Fields!",
        "Some of the fields are missing"
      );
    } else if (this.cvv.toString().length != 3) {
      this.utility.showMessageAlert(
        "Invalid Cvv details!",
        "Please enter correct CVV."
      );
      // tslint:disable-next-line: triple-equals
    } else if (this.number.toString().length != 16) {
      this.utility.showMessageAlert(
        "Invalid card number!",
        "Card number you have entered is not valid.It must be of 16 digits."
      );
    } else {
      this.utility.showLoading();
      // const card = {
      //   number: '4242424242424242',
      //   expMonth: 12,
      //   // expYear: 2021,
      //   expYear: 2022,
      //   cvc: '220'
      // };
      const month = moment(this.expiry_date).format("M");
      const year = moment(this.expiry_date).format("YYYY");

      console.log("today is: ", month + " and time: ", year);
      const card = {
        name: this.name,
        number: this.number,
        // tslint:disable-next-line: radix
        expMonth: parseInt(month),
        // tslint:disable-next-line: radix
        expYear: parseInt(year),
        cvc: this.cvv,
      };
      console.log("card::", card);

      // Amandeep Live Key
      // this.stripe.setPublishableKey(
      //   "pk_live_51HY4PWGxS7HD5LRgMNdSIcm74wxT8l0xFXmtpvMDqPoq2vdCo53MbqFGb68vUaksqIGtE0oprXYfoTzK5DkwcYCr00CBq5cr27"
      // );

      // my Test Key
      this.stripe.setPublishableKey(
        "pk_test_51L8H0fSAdZbP750sa3M7qrbxtuGoboJkjc2L7OJMkhTcSoEzog671evLVJv1dfjEsd3tJLs8nRckLVxMMCJMMIxn003VoiAKzj"
      );

      this.stripe
        .createCardToken(card)
        .then((token) => {
          console.log("stripe token::", token);
          // tslint:disable-next-line: triple-equals
          if (this.data.type == "OPD") {
            const params = {
              speciality_id: this.data.speciality_id,
              doctor_id: this.data.doctor_id,
              date: this.data.date,
              location_id: this.data.location_id,
              fee: this.data.fee,
              schedule_id: this.data.speciality_id,
              book_for: this.data.book_for,
              created_by: this.data.created_by,
              amount: this.data.amount,
              stripe_token: token.id,
              name: this.data.name,
              age: this.data.age,
              mobile_no: this.data.mobile_no,
              doctor_name: this.data.doctor_name,
            };
            this.http
              .confirmAppointment("confirmAppointment", params)
              .subscribe(
                (res: any) => {
                  this.utility.hideLoading();
                  if (
                    res.success ||
                    res.message == "Appointment booked successfully"
                  ) {
                    this.utility.showMessageAlert(
                      "Appointment booked!",
                      "Appointment booked successfully."
                    );
                    this.dismiss();
                    this.router.navigateByUrl("/home");
                    // tslint:disable-next-line: triple-equals
                  } else if (res.success == false) {
                    this.utility.showMessageAlert(
                      "Appointment not booked!",
                      res.message
                    );
                    this.dismiss();
                  } else {
                    this.utility.showMessageAlert(
                      "Appointment not booked!",
                      "Please try again."
                    );
                    this.dismiss();
                  }
                },
                (err) => {
                  this.utility.hideLoading();
                  this.utility.showMessageAlert(
                    "Network error!",
                    "Please check your network connection."
                  );
                }
              );
          } else if (this.data.type == "Video") {
            const params = {
              speciality_id: this.data.speciality_id,
              doctor_id: this.data.doctor_id,
              date: this.data.date,
              location_id: this.data.location_id,
              fee: this.data.fee,
              schedule_id: this.data.speciality_id,
              book_for: this.data.book_for,
              created_by: this.data.created_by,
              amount: this.data.amount,
              stripe_token: token.id,
              name: this.data.name,
              age: this.data.age,
              mobile_no: this.data.mobile_no,
              doctor_name: this.data.doctor_name,
            };

            this.http
              .confirmAppointment("confirmVideoAppointment", params)
              .subscribe(
                (res: any) => {
                  this.utility.hideLoading();
                  if (
                    res.success ||
                    res.message == "Appointment booked successfully"
                  ) {
                    this.utility.showMessageAlert(
                      "Appointment booked successfully!",
                      "You will also get notified before call."
                    );
                    this.dismiss();
                    this.router.navigateByUrl("/home");
                  } else if (res.success == false) {
                    this.utility.showMessageAlert(
                      "Appointment not booked!",
                      JSON.stringify(res)
                    );
                    // this.dismiss();
                  } else {
                    this.utility.showMessageAlert(
                      "Appointment not booked!",
                      "Plese try again."
                    );
                  }
                },
                (err) => {
                  this.utility.hideLoading();
                  this.utility.showMessageAlert(
                    "Network error!",
                    JSON.stringify(err)
                  );
                }
              );
          } else if (this.data.type == "Chat") {
            const params = {
              doctor_id: this.data.doctor_id,
              book_for: this.data.book_for,
              subscribed_by: this.data.subscribed_by,
              health_query: this.data.health_query,
              amount: 200,
              stripe_token: token.id,
              name: this.data.name,
              age: this.data.age,
              mobile_no: this.data.mobile_no,
            };

            this.http.buyChatSubscription("chatSubscription", params).subscribe(
              (res: any) => {
                this.utility.hideLoading();
                if (res.success) {
                  localStorage.setItem("payment_status", "true");
                  this.utility.showMessageAlert(
                    "Chat subscribed!",
                    "You can now chat with doctor directly."
                  );
                  this.dismiss();
                  this.router.navigateByUrl("/chat-lists");
                }
              },
              (err) => {
                this.utility.hideLoading();
                this.utility.showMessageAlert(
                  "Network error!",
                  "Please check your network connection."
                );
              }
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
