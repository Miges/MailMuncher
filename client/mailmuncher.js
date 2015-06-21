/**
 * Created by michael on 21/06/15.
 */
Template.mailmuncher.helpers({
	'messages': function () {
		return MailMessages.find({});
	}
});