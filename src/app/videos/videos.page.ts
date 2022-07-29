import { Component, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { EmbedVideoService } from "ngx-embed-video";
import { ModalController } from "@ionic/angular";
import { Location } from "@angular/common";
import { HttpService } from "../http.service";
import { UtilityService } from "../utility.service";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player/ngx";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { PlayVideoPage } from "src/app/play-video/play-video.page";

@Component({
  selector: "app-videos",
  templateUrl: "./videos.page.html",
  styleUrls: ["./videos.page.scss"],
})
export class VideosPage implements OnInit {
  iframe_html: any;
  youtubeUrl = "https://www.youtube.com/watch?v=iHhcHTlGtRs";
  videos: any = [];

  constructor(
    private _sanitizer: DomSanitizer,
    private platform: Platform,
    private youtube: YoutubeVideoPlayer,
    private modalCtrl: ModalController,
    private embedService: EmbedVideoService,
    private location: Location,
    private http: HttpService,
    private utility: UtilityService
  ) {
    this.iframe_html = this.embedService.embed(this.youtubeUrl);
  }

  ngOnInit() {
    this.getYoutubeVideos();
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
      this.goBack();
    });
  }

  goBack() {
    this.location.back();
  }

  getYoutubeVideos() {
    this.utility.showLoading();
    this.http.getYoutubeVideos("allVideos").subscribe(
      (res: any) => {
        this.utility.hideLoading();
        if (res.success) {
          this.videos = res.data;
        } else {
          this.utility.showMessageAlert(
            "No video added",
            "Currently app has not video.You can check our youtube channel."
          );
        }
      },
      (err) => {
        this.utility.hideLoading();
        this.utility.showMessageAlert("Error", "Something went wrong");
      }
    );
  }

  getIframeVideo(link) {
    link = link.replace(
      "https://youtu.be/",
      "https://www.youtube.com/watch?v="
    );
    // tslint:disable-next-line: variable-name
    let video_id = link.split("v=")[1];
    // console.log("video_id ::", video_id);

    // tslint:disable-next-line: prefer-const
    let ampersandPosition = video_id.indexOf("&");
    // console.log("ampersandPosition ::", ampersandPosition);
    if (ampersandPosition != -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    const thumbnail =
      "https://img.youtube.com/vi/" + video_id + "/hqdefault.jpg";
    return this._sanitizer.bypassSecurityTrustResourceUrl(thumbnail);
  }

  getDescription(desc) {
    return desc.substring(0, 20);
  }

  async playVideo(link) {
    link = link.replace(
      "https://youtu.be/",
      "https://www.youtube.com/watch?v="
    );
    let video_id = link.split("v=")[1];
    const ampersandPosition = video_id.indexOf("&");
    // console.log("ampersandPosition playVideo::", ampersandPosition);

    if (ampersandPosition != -1) {
      video_id = video_id.substring(0, ampersandPosition);
      // console.log("video_id ifff-->", video_id);
    }
    // console.log("video_id-->", video_id);
    this.youtube.openVideo(video_id);
  }
}
