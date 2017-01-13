import Ember from 'ember';
import RSVP from 'rsvp';
import WebRTC from 'npm:web-streams';

export default Ember.Route.extend({
	model() {
    return RSVP.Promise.all([
      WebRTC.listSupportedConstraints()
    ]);
	}
});
