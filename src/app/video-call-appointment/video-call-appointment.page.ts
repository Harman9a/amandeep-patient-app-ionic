import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc';
import { checkSystemRequirements, getDevices, createClient, createStream, Logger } from 'agora-rtc-sdk';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';
import { HttpService } from '../http.service';
import { UtilityService } from '../utility.service';


@Component({
  selector: 'app-video-call-appointment',
  templateUrl: './video-call-appointment.page.html',
  styleUrls: ['./video-call-appointment.page.scss'],
})
export class VideoCallAppointmentPage implements OnInit {
  localStream: Stream;
  stream: any;
  remoteCalls: any = [];
  activeCall: boolean = false;
  audioEnabled: boolean = true;
  videoEnabled: boolean = true;

  token: string;
  udid: string;
  channel_name: string;

  remote_screen: boolean = false;
  local_screen: boolean = true;


  audioDevices: any;
  videoDevices: any;

  user_id: any;
  doctor_id: any;
  appointment_id: any;

  stream_id: any;
  call_started: any;
  audio: any;
  speakerEnabled: boolean = false;

  constructor(private agoraService: AngularAgoraRtcService, private platform: Platform, private nativeAudio: NativeAudio, public audioman: AudioManagement, private route: ActivatedRoute, private router: Router, private http: HttpService, private utility: UtilityService) {
    this.agoraService.createClient();
    this.route.queryParams.subscribe((params) => {
      this.user_id = this.router.getCurrentNavigation().extras.state.user_id;
      this.doctor_id = this.router.getCurrentNavigation().extras.state.doctor_id;
      this.appointment_id = this.router.getCurrentNavigation().extras.state.appointment_id;
      this.stream_id = this.router.getCurrentNavigation().extras.state.streamId;
      this.channel_name = this.router.getCurrentNavigation().extras.state.channel_name;
    });

    this.utility.getevent().subscribe((message) => {

      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      //this.utility.showMessageAlert("Call ended!",message['call:ended']);
      this.router.navigate(["home"])
    });
  }

  ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
    })
  }


  ngOnInit() {
    this.setAudioMode();
    // this.startCall();
    this.audio = new Audio();
    this.audio.src = '../../assets/tone/iphone_6-30.mp3';
    this.audio.load();
    this.playAudio();
  }


  startCall() {
    this.getDevices();
  }

  playAudio() {
    this.audio.play();
    this.audio.loop = true;
  }


  setAudioMode() {
    this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL)
      .then(() => {

      })
      .catch((reason) => {

      });
  }

  getDevices() {
    getDevices((devices) => {
      /** @type {?} */

      let audioDevices = devices.filter(device => {
        return device.kind === 'audioinput' && device.deviceId !== 'default';
      });
      /** @type {?} */
      let videoDevices = devices.filter(device => {
        return device.kind === 'videoinput' && device.deviceId !== 'default';
      });
      this.audioDevices = audioDevices;
      this.videoDevices = videoDevices;

      this.agoraService.client.join(null, this.channel_name, null, (streamID) => { // stream id created

        this.stream_id = streamID;//new add
        let audio = true;
        let video = true;
        let screen = false;
        let cameraId = this.videoDevices[0].deviceId;
        let microphoneId = this.audioDevices[0].deviceId;
        let incoming_id = this.stream_id
        // this.localStream = this.agoraService.createStream(uid, true, cameraId, microphoneId, true, false); // join stream
        this.localStream = createStream({ incoming_id, audio, cameraId, microphoneId, video, screen })

        var stream = this.localStream
        window.navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          let videoTrack = stream.getVideoTracks()[0];


          document.querySelector("video").srcObject = stream;
          this.localStream.play('agora_local');
        }).catch(err => console.log(err.name))
        this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
      });

    });
  }

  acceptCall() {
    this.startCall();
    this.activeCall = true;
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
      this.call_started = new Date();
    }
  }

  private subscribeToStreams() {
    this.localStream.on("accessAllowed", () => {

    });
    // The user has denied access to the camera and mic.
    this.localStream.on("accessDenied", () => {

    });
    this.localStream.init(() => {

      this.localStream.play('agora_local');
      this.agoraService.client.publish(this.localStream, function (err) {

      });
      this.agoraService.client.on('stream-published', function (evt) {
        this.call_started = new Date();

      });
    }, function (err) {

    });

    this.agoraService.client.on('error', (err) => {

      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey("", () => {

        }, (err) => {

        });
      }
    });
    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {

      });
    });
    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      this.stream = stream;

      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
      // this.remote_screen = true;
      // this.local_screen = false;
      if (`agora_remote${stream.getId()}` != undefined) {
        if (this.audio) {
          this.audio.pause();
          this.audio = null;

        }
      } else {
        if (this.audio) {
          this.audio.pause();
          this.audio = null;
          // this.call_started = new Date();
        }
      }
    });
    this.agoraService.client.on('stream-removed', (evt) => {
      this.localStream.stop();
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      this.utility.showMessageAlert("Call ended!", "Call has ended due to poor network connection");
      this.router.navigate(["home"])
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);

    });
    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);

        this.localStream.stop();
        if (this.audio) {
          this.audio.pause();
          this.audio = null;
        }
        this.utility.showMessageAlert("Call ended!", "");
        this.router.navigate(["home"])
      }
    });

  }

  leave() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.agoraService.client.leave(() => {
      this.activeCall = false;
      if (this.localStream) {
        this.localStream.stop();
      }
      this.utility.showMessageAlert("Call ended!", "");
      this.router.navigate(["home"]);

    }, (err) => {

    });
  }
  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    if (this.audioEnabled) this.localStream.enableAudio();
    else this.localStream.disableAudio();
  }
  toggleVideo() {
    this.videoEnabled = !this.videoEnabled;
    if (this.videoEnabled) this.localStream.enableVideo();
    else this.localStream.disableVideo();
  }


  callEnded() {

    let user = JSON.parse(localStorage.getItem('user_details'));

    let params = {
      "user_id": this.user_id,
      "doctor_id": this.doctor_id,
      "uid": this.stream_id,
      "call_started": this.call_started,
      "call_ended": new Date(),
      "ended_by": "Patient"
    }


    this.http.videoCallPatient('callDuration', params).subscribe(
      (res: any) => {

        if (res.success) {
          this.utility.showMessageAlert("Call ended!", "");
          this.router.navigate(["my-appointments"])

        }
      }, err => {

        this.utility.hideLoading();
        this.utility.showMessageAlert("Network error!", "Please check your network connection.")
      })
  }


  toggleSpeaker() {
    this.speakerEnabled = !this.speakerEnabled;
    if (this.speakerEnabled) this.stream.adjustPlaybackSignalVolume(200);
    else this.stream.adjustPlaybackSignalVolume(50);
  }
  hideLocal() {
    this.remote_screen = true;
    this.local_screen = false;
  }

  hideRemote() {
    this.remote_screen = false;
    this.local_screen = true;
  }

}