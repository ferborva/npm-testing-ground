import Ember from 'ember';
import WebStreams from 'npm:web-streams';
import WebRTC from 'npm:webrtc-conn';

export default Ember.Component.extend({

  init() {
    this._super(...arguments);
    WebRTC.eventTrap.on('newIceCandidate', (id, candidate) => {
      console.log('------------New Candidate-----------');
      console.log('Connection:', id);
      console.log('Candidate Generated:', candidate);

      if (id === '123') {
        WebRTC.addIceCandidate('234', candidate).fork(console.warn, console.log);
      } else {
        WebRTC.addIceCandidate('123', candidate).fork(console.warn, console.log);
      }
    });
    WebRTC.eventTrap.on('iceStateChange', id => {
      console.log('ICE state changed. Id: ', id);
    });
    WebRTC.eventTrap.on('iceGatheringChange', id => {
      console.log('ICE Gathering state changed. Id: ', id);
    });
    WebRTC.eventTrap.on('signalingStateChange', id => {
      console.log('Siganiling state changed. Id: ', id);
    });

    WebRTC.eventTrap.on('newStream', (id, stream) => {
      console.log('New stream received by ', id);
      console.log(stream);
    });

    WebRTC.eventTrap.on('newTrack', (id, track) => {
      console.log('New track received by ', id);
      console.log(track);
    });
  },

  pc1: '123',
  pc2: '234',

  actions: {
    createNewConnection() {
      WebRTC.newConnection(this.pc1).fork(console.warn, () => {
        console.log('PC1 created with ID:', this.pc1);
        WebRTC.newConnection(this.pc2).fork(console.warn, () => {
          console.log('PC2 created with ID:', this.pc2);
          WebStreams.getMedia({testMode: true}).then(media => {
            WebRTC.addStream(this.pc1, media).fork(console.warn, console.log);
            WebRTC.addStream(this.pc2, media).fork(console.warn, console.log);
            console.log(media);
            console.log('Media Stream added to PC1');
            WebRTC.createOffer(this.pc1).fork(console.warn, offer => {
              console.log('Offer created for PC1:', offer);
              console.log('Setting as remote description on PC2');
              WebRTC.setRemoteDescription(this.pc2, offer).fork(console.warn, () => {
                WebRTC.createAnswer(this.pc2).fork(console.warn, answer => {
                  console.log('Answer created for PC2:', answer);
                  console.log('Setting as remote descrition on PC1');
                  WebRTC.setRemoteDescription(this.pc1, answer).fork(console.warn, () => {
                    console.log('Yay!');
                  });
                });
              });
            });
          }, console.warn);
        });
      });

    },

    getById(id) {
      if (!id) {
        id = '123';
        const conn = WebRTC.findConnectionById(id).getOrElse('No Value found');
        console.log(conn);
      } else {
        const conn = WebRTC.findConnectionById(id).getOrElse('No Value found');
        console.log(conn);
        console.log('Local Streams');
        console.log(conn.connection.getLocalStreams());
        console.log('Remote Streams');
        console.log(conn.connection.getRemoteStreams());
        console.log('Connection State');
        console.log(conn.connection.connectionState);
      }
    },

    close() {
      WebRTC.closeConnection('123').fork(console.warn, console.log);
    }
  }
});
