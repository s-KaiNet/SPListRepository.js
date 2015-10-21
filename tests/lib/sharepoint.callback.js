module.exports = function(page, options, next){
	var siteUrl = options.siteUrl;
	var isOnPrem = siteUrl.indexOf(".sharepoint.com") === -1;
	if(isOnPrem){
		page.customHeaders = {
			"Authorization": "Basic " + btoa(options.username + ":" + options.password)
		};
		page.open(siteUrl);
	} else{
		page.evaluate(function(creds) {
			document.getElementById("cred_userid_inputtext").value = creds.username;
			document.getElementById("cred_password_inputtext").value = creds.password;
			document.getElementById("credentials").submit();
			return;
		}, {username: options.username, password: options.password});
	}
	
	next();
}