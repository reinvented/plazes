/**
 * Search for a Plaze, either using the MAC address of default gateway (Mac and Linux only)
 * or using the search keyword entered in the UI (any OS).
*/
function SearchForPlaze() {

	// The Plaze keyword entered in the UI.
	var searchforplaze = document.getElementById("plazekeyword").value;

	// If we didn't enter a keyword, we'll look for the MAC address and use that to query for appropriate Plazes.
	if (searchforplaze == '') {

		// Detect the OS (we only support lookup by MAC address for Mac OS X and Linux right now)
		var os = DetectOS();

		// If this isn't Mac OS X or Linux, then display an error dialog and exit.
		if ((os != 'MacOS') && (os != 'Linux')) {
			alert("MAC address detection only supported for Mac OS X and Linux.  Windows users must enter a search string.");
			return;
		}
		else {

			var installdir = GetExtensionPath();
			var shellscript = installdir + "/chrome/content/" + "getmac.sh";
			
			// create an nsILocalFile for the executable, which is the getmac.sh shell script
			var file = Components.classes["@mozilla.org/file/local;1"]
			                     .createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(shellscript);

			// create an nsIProcess
			var process = Components.classes["@mozilla.org/process/util;1"]
			                      .createInstance(Components.interfaces.nsIProcess);
			process.init(file);

			// Get the name of a temporary file to dump the MAC address into.
			var tmpfile = GetTemporaryFile();

			// We pass the operating system we detected so the shell script can act accordingly.
			// We pass the name of the temporary file where we'll dump the MAC address.
			var args = [os, tmpfile];

			// Run the process, which should dump the MAC address in tmpfile
			process.run(true, args, args.length);

			var macfile = Components.classes["@mozilla.org/file/local;1"]
					.createInstance(Components.interfaces.nsILocalFile);
			macfile.initWithPath( tmpfile );

			// If the MAC address didn't end up in tmpfile, we display an error dialog and exit.
			if ( macfile.exists() == false ) {
				alert("Could not obtain MAC address.  It should have ended up in " + tmpfile + ". Sorry.");
				return;
			}

			// Read the MAC address from tmpfile.
			var is = Components.classes["@mozilla.org/network/file-input-stream;1"]
					.createInstance( Components.interfaces.nsIFileInputStream );
			is.init( macfile,0x01, 00004, null);
			var sis = Components.classes["@mozilla.org/scriptableinputstream;1"]
					.createInstance( Components.interfaces.nsIScriptableInputStream );
			sis.init( is );
			var macaddress = sis.read( sis.available() );
		
			// Use the MAC address we got as the query string.
			query = "networks[][mac_address]=" + macaddress;
		}
	}
	else {
		// Use the keyword we entered as a query string
		query = "q=" + searchforplaze;
	}

	// Look up our Plazes.net username and password from the Login Manager.
	// This means that you must already have logged in to Plazes.net and saved your username and password.
	AuthInfo = GetPlazesPassword();

	// Make an AJAX call to Plazes.net to query for appropriate Plazes.
	$.ajax({
		type: "GET",
		url: "http://" + AuthInfo['username'] + ':' + AuthInfo['password'] + "@plazes.net/plazes.json",
		data: query,
		dataType: "json",
		success: function(result){
			
			// The drop-down menu that will display the Plazes we found
			var menu = document.getElementById("plaze-menu-list");

			// Remove all of the pre-existing Plazes from earlier queries, if any.
			menu.removeAllItems();

			if (result.length > 0) {
				// Append an item for each Plaze found.
				for (i = 0 ; i < result.length ; i++) {
					plaze = result[i];
					menu.appendItem(plaze.name, plaze.id);
				}

				// Select the first Plaze found.
				menu.selectedIndex = 0;

				// Enable the "Plaze Me" button.
				var plazebutton = document.getElementById("plazeme-button");
				plazebutton.setAttribute('disabled',false);
				plazebutton.setAttribute('label','Plaze Me');
			
				// Focus on the status message field, in case we want to update status at the same Plaze later.
				document.getElementById("status").focus();
			}
			else {
				alert("No Plazes found associated with this MAC address or Plaze keyword.");
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			// Display an error message if we couldn't communicate with Plazes.net properly.
			alert("Unable to communicate with Plazes.net API to query for Plazes.");
		}
	});
}

/**
 * Create a new Plazes.net presence.
*/
function PlazeMe() {

	// The ID of the Plaze.
	var menu = document.getElementById("plaze-menu-list");
	var selectedItem = menu.selectedItem;
	var plazeid = selectedItem.getAttribute("value");

	// The status message.
	var status = document.getElementById("status").value;

	// The date to create the presence at.
	var presencedate = document.getElementById("presencedate");
	var yyyy = presencedate.year;
	var mm = presencedate.month + 1;
	var dd = presencedate.date;
	
	// The time to create the presence at.
	var presencetime = document.getElementById("presencetime");
	var HH = presencetime.hour;
	var MM = presencetime.minute;
	var SS = presencetime.second;

	// The datestamp to use for presence creation, in the form YYYY-MM-DDTHH:MM:SS
	var presencedatestamp = yyyy + '-' + mm + '-' + dd + 'T' + HH + ':' + MM + ':' + SS;

	// Look up our Plazes.net username and password from the Login Manager.
	// This means that you must already have logged in to Plazes.net and saved your username and password.
	AuthInfo = GetPlazesPassword();

	// Prepare the query string of POST variables to send to Plazes.net.
	postvars = "presence[plaze_id]=" + plazeid + "&presence[status]=" + status + "&presence[scheduled_at_is_plaze_local]=1&presence[scheduled_at]=" + presencedatestamp;

	$.ajax({
	   type: "POST",
	   url: "http://" + AuthInfo['username'] + ':' + AuthInfo['password'] + "@plazes.net/presences.json",
	   data: postvars,
	   dataType: "text",
	   success: function(result){
			// Clear the status message value that we entered.
			var statusfield = document.getElementById("status");
			statusfield.value = '';
			statusfield.focus();
			
			// Disable the "Plaze Me" button, and use it to display a confirmation message.
			// (we need a better way of displaying confirmation in the UI, I think).
			var plazebutton = document.getElementById("plazeme-button");
			plazebutton.setAttribute('disabled',true);
			plazebutton.setAttribute('label','You have been Plazed!');
	   }
	 });
}

/**
 * Get the Plazes.net username and password from the Login Manager.
 * See http://developer.mozilla.org/en/docs/index.php?title=Using_nsILoginManager for details.
 * This hasn't been extensively tested yet, and needs some error handling.
*/
function GetPlazesPassword() {
	var hostname = 'http://plazes.net';
	var formSubmitURL = 'http://plazes.net';  // not http://www.example.com/foo/auth.cgi
	var httprealm = null;
	var username = 'user';
	var password;

	var AuthInfo = Array;

   var myLoginManager = Components.classes["@mozilla.org/login-manager;1"]
                         .getService(Components.interfaces.nsILoginManager);

   // Find users for the given parameters
   var logins = myLoginManager.findLogins({}, hostname, formSubmitURL, httprealm);

   // Find user from returned array of nsILoginInfo objects

	if (logins.length == 0) {
		alert("No Plazes.net username/password found in Login Manager.");
	}
	else if (logins.length > 1) {
		alert("Multiple usernames/passwords found in Login Manager for Plazes.net.  Using " + logins[0].username);
	}

	if (logins.length >= 1) {
		AuthInfo['username'] = logins[0].username;
		AuthInfo['password'] = logins[0].password;
	}
	
	return(AuthInfo);
}

/**
 * Detect the operating system of the browser.
*/
function DetectOS() {
	// From http://www.javascripter.net/faq/operatin.htm
	//
	// This script sets OSName variable as follows:
	// "Windows"    for all versions of Windows
	// "MacOS"      for all versions of Macintosh OS
	// "Linux"      for all versions of Linux
	// "UNIX"       for all other UNIX flavors 
	// "Unknown OS" indicates failure to detect the OS

	var OSName="Unknown OS";
	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
	if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
	if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
	
	return OSName;
}

/**
 * Get the location of the extension's installed directory, so that
 * we can get the path to the getmac.sh shell script.
*/
function GetExtensionPath() {
	// the extension's id from install.rdf
	var MY_ID = "app@fireplazer.com";
	var em = Components.classes["@mozilla.org/extensions/manager;1"].
	         getService(Components.interfaces.nsIExtensionManager);
	// the path may use forward slash ("/") as the delimiter
	var file = em.getInstallLocation(MY_ID).getItemFile(MY_ID, "");
	// returns nsIFile for the extension's install.rdf
	return(file.path);
}

/**
 * Get a temporary file to store the MAC address in.
*/
function GetTemporaryFile() {
	var file = Components.classes["@mozilla.org/file/directory_service;1"]
	                     .getService(Components.interfaces.nsIProperties)
	                     .get("TmpD", Components.interfaces.nsIFile);
	file.append("FirePlazerMAC.tmp");
	file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0666);
	// do whatever you need to the created file
	return(file.path);
}