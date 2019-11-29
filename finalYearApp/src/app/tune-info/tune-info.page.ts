import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TheSessionService } from '../service/the-session.service';
import { Tune } from '../model/Tune';
import { TuneDetail } from '../model/TuneDetail';

@Component({
  selector: 'app-tune-info',
  templateUrl: './tune-info.page.html',
  styleUrls: ['./tune-info.page.scss'],
})

export class TuneInfoPage implements OnInit {

  title = 'dummyApp-YTIFrameAPI';

  /* 1. Some required variables which will be used by YT API*/
  public YT: any;
  public video: any;
  public player: any;
  public reframed: Boolean = false;

  isRestricted = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  tuneInformation: any;
  videoId: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private service: TheSessionService) { 

  }

 init() {
    // Return if Player is already created
    if (window['YT']) {
      this.startVideo();
      return;
    }

    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    /* 3. startVideo() will create an <iframe> (and YouTube player) after the API code downloads. */
    window['onYouTubeIframeAPIReady'] = () => this.startVideo();
  }
  getTune(id) {
    this.service.GetIssue(id).subscribe(tune => {
      this.tuneInformation = tune;
      console.log(this.tuneInformation)
    })
  }

  getVideo(name) {
    this.service.getVideoID(name).subscribe(videoId => {
      let settings = videoId["items"];
      settings.forEach(tune => {
        this.videoId.push(tune);
      });
      console.log("VIDEO ID", this.videoId[0].id.videoId)
    })
  }


  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getTune(id);

    setTimeout(() => {
      let name = this.tuneInformation.name.replace(/[^a-zA-Z ]/g, "")
      this.getVideo(name + "irish trad music")
      console.log("HELLO tunes", this.tuneInformation)
    }, 2000)

    setTimeout(() => {
      this.video = this.videoId[0].id.videoId
      this.init()
    }, 3000)
  }

  startVideo() {
    this.reframed = false;
    this.player = new window['YT'].Player('player', {
      videoId: this.video,
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        controls: 1,
        disablekb: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        playsinline: 1

      },
      events: {
        'onStateChange': this.onPlayerStateChange.bind(this),
        'onError': this.onPlayerError.bind(this),
        'onReady': this.onPlayerReady.bind(this),
      }
    });
  }

  /* 4. It will be called when the Video Player is ready */
  onPlayerReady(event) {
    if (this.isRestricted) {
      event.target.mute();
      event.target.playVideo();
    } else {
      event.target.playVideo();
    }
  }

  /* 5. API will call this function when Player State changes like PLAYING, PAUSED, ENDED */
  onPlayerStateChange(event) {
    console.log(event)
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() == 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime())
        };
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        };
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    };
  };

  cleanTime() {
    return Math.round(this.player.getCurrentTime())
  };

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.video)
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    };
  };

}






//5a8a48d7a6a910d48fcdf56b12c2701c
//api key

//secret key
// ad84229f9b71d8feb13883e2099d75a9