import Ember from 'ember';
import RSVP from 'rsvp';
import WebRTC from 'npm:webrtc-int';

export default Ember.Route.extend({
	model() {
    return RSVP.Promise.all([
      WebRTC.listSupportedConstraints()
    ]);
	}
});
