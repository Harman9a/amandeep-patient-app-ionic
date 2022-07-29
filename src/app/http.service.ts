import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { UtilityService } from "./utility.service";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private testingUrl = "http://testing.isocare.in/public/api/";

  private url: string = this.testingUrl;

  constructor(
    private http: HttpClient,
    private utility: UtilityService,
    private router: Router
  ) {
    // this.getLocations('allLocations');
  }

  getWithoutBaseUrl(endpoint: string) {
    return this.http.get(endpoint);
  }

  get(endpoint: string, params?: any) {
    return this.http.get(this.url + endpoint);
  }

  post(endpoint: string, body: any) {
    return this.http.post(this.url + endpoint, body);
  }

  put(endpoint: string, body: any) {
    return this.http.put(this.url + endpoint, body);
  }

  delete(endpoint: string, body: any) {
    return this.http.post(this.url + endpoint, body);
  }
  deleteReport(endpoint: string, body: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  patch(endpoint: string, body: any) {
    return this.http.put(this.url + endpoint, body);
  }

  getLocations(endpoint: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };

    return this.http.get(this.url + endpoint, httpOptions);
  }

  getSpeciality(endpoint: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getDoctorsLocationwise(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getDoctorTimeslot(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  addPatient(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  checkAvailibitityTimeslots(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  getAlreadyRegisteredPatients(endpoint: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };

    return this.http.get(this.url + endpoint, httpOptions);
  }

  confirmAppointment(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  editProfile(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  getMyAppointments(endpoint: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getYoutubeVideos(endpoint: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getMyReports(endpoint: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  addQuery(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  videoCallPatient(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  getAllDoctors(endpoint) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getChatSubscriptionStatus(endpoint) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  buyChatSubscription(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  sendPushNotification(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  contactUs(endpoint: string, body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.post(this.url + endpoint, body, httpOptions);
  }

  socialLogin(endpoint: string, body: any) {
    return this.http.post(this.url + endpoint, body);
  }

  getAllChatMessages(endpoint: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }

  getAllBanners(endpoint) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")),
      }),
    };
    return this.http.get(this.url + endpoint, httpOptions);
  }
}
