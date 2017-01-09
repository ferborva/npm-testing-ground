import Ember from 'ember';
import WebRTC from 'npm:webrtc-int';

export default Ember.Route.extend({
	model() {
    const res = WebRTC.supportsEnumerate();
    console.log('Supports Enumerate:', res);
    const res2 = WebRTC.listDevices();
    console.log('Devices Found:');
    console.log(res2);
		return true;
	}
});
