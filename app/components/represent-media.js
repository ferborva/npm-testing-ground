import Ember from 'ember';
import WebRTC from 'npm:webrtc-int';

export default Ember.Component.extend({

  init(){
    this._super(...arguments);

    WebRTC.getMedia({video:true, audio:true}).then(
      res => {
        const tracks = res.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        return WebRTC.listInputDevicesP().then(
        devices => {
          console.log('All is good');
          this.set('devices', devices);
        }, err => {
          console.error(err);
        });
      }, 
      err => console.warn(err)
    );
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
    console.log(stream);
    elem.srcObject = stream;
    viewZone.appendChild(elem);
  },

  clearViewZone() {
    const viewZone = Ember.$('#view')[0];
    while (viewZone.children.length > 1) {
      viewZone.removeChild(viewZone.lastChild);
    }
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
    }
  }

});