Meteor.startup(function () {
	imapConnect();
});


var imap = new Imap({
	user: IMAP_USER,
	password: IMAP_PASSWORD,
	host: 'imap.gmail.com',
	port: 993,
	tls: true
});

var imapConnect = function () {

	//mailgun.messages().send(data, Meteor.bindEnvironment(function(error, body) {
	//
	//	if (error)
	//		return future.error(error);
	//
	//	EmailLogs.insert({time: new Date(), userId: Meteor.userId()});
	//
	//	future.return(null);
	//}));


	imap.once('ready',safeCallback(imapReady));

	imap.once('error', function(err) {
		console.log(err);
	});

	imap.once('end', function() {
		console.log('Connection ended');
	});

	imap.connect();


};


function openInbox(cb) {
	imap.openBox('INBOX', true, safeCallback(cb));
}

var imapReady = function () {
	openInbox(safeCallback(imapOpenInbox));
};

var imapOpenInbox = function (err, box) {
	if (err) throw err;
	var f = imap.seq.fetch('1:10', {
		bodies: '',
		struct: true
	});
	f.on('message', safeCallback(imapMessage));
	f.once('error', function (err) {
		//console.log('Fetch error: ' + err);
	});
	f.once('end', function () {
		//console.log('Done fetching all messages!');
		imap.end();
	});
};

var imapMessage = function (msg, seqno) {
	//console.log('Message #%d', seqno);/
	var prefix = '(#' + seqno + ') ';
	msg.on('body', safeCallback(imapBody));
	msg.once('attributes', function (attrs) {
		//console.log(prefix + 'Attributes: %s');
		//console.dir(attrs);
	});
	msg.once('end', function () {
		//console.log(prefix + 'Finished');
	});
};

var imapBody = function (stream, info) {
	stream.on('data', safeCallback(onStreaming));
	stream.once('end', safeCallback(onStreamEnd));
};


var buffer = '';

var onStreaming = function (chunk) {
	buffer += chunk.toString('utf8');
}

var onStreamEnd = function () {
	console.log("sending to parser");
	ParseMail(buffer);
}

