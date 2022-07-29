import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  loading: any;
  locations: any = [];
  // tslint:disable-next-line: variable-name
  all_doctors: any = [];
  // tslint:disable-next-line: variable-name
  chat_payment_status: any;
  user: any;
  // tslint:disable-next-line: variable-name
  user_profile: any;
  banners: any = [];
  image: any;
  // tslint:disable-next-line: variable-name
  device_token: string;
  // tslint:disable-next-line: variable-name
  device_type: string;

  private events = new Subject<any>();

  constructor(private route: ActivatedRoute, private router: Router, private loadingController: LoadingController,
              private alertController: AlertController,
              private toastController: ToastController) {

  }

  publishEvent(data: any) {
    this.events.next(data);
  }

  getevent(): Subject<any> {
    return this.events;
  }


  async showLoading(message?: string) {
    this.loading = await this.loadingController.create({
      cssClass: 'custom-class spinner-class',
    });
    await this.loading.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  async showAlert(header: string, message: string, state) {
    const alert = await this.alertController.create({
      cssClass: 'alert-container',
      header,
      message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Yes',
          handler: () => {

            // let navigationExtras: NavigationExtras = {
            // state: {
            // patient:state.patient,
            // location_name: state.location_name,
            // data: state.data,
            // date: state.date,
            // time: state.time,
            // schedule_id: state.schedule_id
            // },
            // };
            // this.router.navigateByUrl("/confirm-appointment",navigationExtras);
          }
        }
      ]
    });

    await alert.present();
  }

  async showMessageAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: 'alert-container',
      header,
      message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {

          }
        }
        // {
        //   text: 'Yes',
        //   handler: () => {
        //     let navigationExtras: NavigationExtras = {
        //       state: {
        //         patient:state.patient,
        //         location_name: state.location_name,
        //         data: state.data,
        //         date: state.date,
        //         time: state.time,
        //         schedule_id: state.schedule_id
        //       },
        //     };
        //     this.router.navigateByUrl("/confirm-appointment",navigationExtras);
        //   }
        // }
      ]
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
    });
    toast.present();
  }
}
