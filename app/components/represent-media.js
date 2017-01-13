import Ember from 'ember';
import WebRTC from 'npm:web-streams';

export default Ember.Component.extend({

  init(){
    this._super(...arguments);

    WebRTC.listDevices.fork(
      err => {
        console.error(err);
      }, devices => {
        this.set('devices', devices);
      });

    // console.log('Check Extension Availability');
    // WebRTC.checkExtension.fork(
    //   console.error,
    //   r => {
    //     console.log(r);
        
    //     console.log('Get Screen Constraints');
    //     WebRTC.getScreenP().then(this.setSharedScreen, console.error)
    //   }
    // );

    // WebRTC.getScreen.fork(console.warn, this.setSharedScreen);
  },

  didReceiveAttrs(){
    this._super(...arguments);

    const data = this.get('data');
    const constraints = data[0];
    this.set('constraints', Object.keys(constraints));
  },

  setMediaSrc(stream, kind) {
    const viewZone = Ember.$('#view')[0];
    let elem = null;
    if (kind === 'audioinput') {
      elem = document.createElement('audio');
    } else {
      elem = document.createElement('video');
    }
    elem.autoplay = true;
    elem.controls = true;
    elem.volume = 0.3;
    elem.srcObject = stream;
    viewZone.appendChild(elem);
  },

  setSharedScreen(stream) {
    const viewZone = Ember.$('#view')[0];
    const elem = document.createElement('video');
    elem.autoplay = true;
    elem.controls = true;
    elem.id = 'myScreenShare';
    elem.srcObject = stream;
    viewZone.appendChild(elem);
    return stream;
  },

  clearViewZone() {
    const viewZone = Ember.$('#view')[0];
    while (viewZone.children.length > 1) {
      viewZone.removeChild(viewZone.lastChild);
    }
  },

  handleScreenEnd(track) {
    const elem = Ember.$('#myScreenShare')[0];
    elem.parentElement.removeChild(elem);
    console.log('Track Ended:', track);
  },

  actions: {
    getMedia() {
      const selected = Ember.$('#available-devices').val();
      const kind = this.get('devices').filter((device) => device.deviceId === selected)[0].kind;
      let constraints = {};
      if (kind === 'audioinput') {
        constraints = {
          audio: {
            deviceId: selected
          }
        };
      } else {
        constraints = {
          video: {
            deviceId: selected
          }
        };
      }
      WebRTC.getMedia(constraints).then(media => this.setMediaSrc(media, kind), err => console.warn(err));
    },

    stopMedia() {
      this.clearViewZone();
      WebRTC.stopAllTracks();
    },

    testMode() {
      WebRTC.getMedia({testMode: true}).then(media => this.setMediaSrc(media, 'videoinput'), err => console.warn(err));
    },

    getScreen() {
      WebRTC.getScreen
            .map(this.setSharedScreen)
            .map(WebRTC.getTracks)
            .map(arr => arr.map((track) => {
              track.onended = this.handleScreenEnd;
              return track;
            }))
            .fork(console.warn, console.log);
    }
  }

});
