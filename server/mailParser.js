ParseMail = function (message) {

	var MailParser = Meteor.npmRequire('mailparser').MailParser;
		mailparser = new MailParser();

	var email = message;
	// setup an event listener when the parsing finishes
	mailparser.on("end", safeCallback(onParseEnd));
	// send the email source to the parser
	mailparser.write(email);
	mailparser.end();
}

var onParseEnd = function(mail_object){
	console.log("Mail", mail_object);
	MailMessages.insert(mail_object);
};