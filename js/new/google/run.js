function run() {
	"use strict";

	var G = new Cgoogle(
			{
				clientId : "YOUR_GOOGLE_CLIEND_ID",
				authUrl : "https://accounts.google.com/o/oauth2/auth",
				scopes : [ "https://www.googleapis.com/auth/drive" ]
			});

	G.login(function(token) {
		console.log('WE ARE LOGGED :)', this, token);
		console.log('Expire', this.expiresIn());
		G.drive.insert({
			headers: {
				title: 'test.ijs',
				label: 'GraphIt/Image'	
			},
			body: JSON.stringify({
				title: 'test.ijs',
				label: 'GraphIt/image',
				layers: [
				         'ezkfmezfLAYER00epozfkpoezkf',
				         'lefzlezkfzefa01opdzapvxoppk'
				],
			}),
		});
		G.drive.list({
			success : function(directory) {
				var diag = $('<div id="files-container" />');
				diag.attr('title', 'Directory');
				var ul = $('<ul />');
				directory.list(function(file) {
					console.log(file.to_s(), file);
					var li = $('<li />');
					if (file instanceof Cgoogle_drive_directory) {
						li.css('background-color', 'blue');
						li.css('color', 'white');
					} else {

					}
					li.append(file.dom_get('#files-container'));
					ul.append(li);
				});
				diag.append(ul);
				diag.dialog({
					autoOpen : true,
					width : 400,
					height : 400
				});
			},
			error : function(error) {
				console.error('Cannot list files', error);
			}
		});
	});

}
