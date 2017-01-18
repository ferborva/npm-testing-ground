import Ember from 'ember';
import WebStreams from 'npm:web-streams';

export default Ember.Component.extend({

  init(){
    this._super(...arguments);

    WebStreams.listDevices.fork(
      err => {
        console.error(err);
      }, devices => {
        this.set('devices', devices);
      });

    // console.log('Check Extension Availability');
    // WebStreams.checkExtension.fork(
    //   console.error,
    //   r => {
    //     console.log(r);
        
    //     console.log('Get Screen Constraints');
    //     WebStreams.getScreenP().then(this.setSharedScreen, console.error)
    //   }
    // );

    // WebStreams.getScreen.fork(console.warn, this.setSharedScreen);
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
      WebStreams.getMedia(constraints).then(media => this.setMediaSrc(media, kind), err => console.warn(err));
    },

    stopMedia() {
      this.clearViewZone();
      WebStreams.stopAllTracks();
    },

    testMode() {
      WebStreams.getMedia({testMode: true}).then(media => this.setMediaSrc(media, 'videoinput'), err => console.warn(err));
    },

    getScreen() {
      WebStreams.getScreen
            .map(this.setSharedScreen)
            .map(media => media.getTracks())
            .map(arr => arr.map((track) => {
              track.onended = this.handleScreenEnd;
              return track;
            }))
            .fork(console.warn, console.log);
    }
  }

});
