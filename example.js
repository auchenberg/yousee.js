
var yousee = require('./yousee');

var client = new yousee();

var req = client.livetv.allowed_channels.get().then(function(data) {
	console.log('allowed_channels', data.body);

	return client.livetv.streamurl.get({
		channel_id: '1',
		client: 'http',
	}).then(function(data) {
		console.log('streamurl', data.body);
	});

});

req.catch(function(err) {
	console.error(err);
});
