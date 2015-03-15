## Introduction ##

FirePlazer is my attempt to build a Plazer into a Firefox extension.  It's rough around the edges, doesn't yet exist as a public easy-to-install XPI binary, and has only been tested under Mac OS X, but it _does_ work, and, what's more, it can [grab the MAC address of your default gateway](FindingMACAddress.md) to "auto-Plaze" you.

## Contributors Welcome ##

This is my first stab at extension development.  I'd like some help in taking FirePlazer ahead.  If you're interested in contributing, please [send me an email](mailto:reinvented+fireplazer@gmail.com).

## System Requirements ##

  * Firefox 3.0 or later
  * Mac OS X supports auto-Plazing via MAC address (tested).
  * Linux supports auto-Plazing via MAC address (_not_ tested).
  * No Windows support for auto-Plazing, but does support keyword search of Plazes.

FirePlazer is targeted at [Plazes.net](http://plazes.net) and it assumes that you _already_ have a Plazes.net username and password stored in the [Login Manager](http://developer.mozilla.org/en/docs/Using_nsILoginManager) of your Firefox.

## Download ##

No easy-to-install XPI file is yet available for FirePlazer, so you must manually install the extension.

  1. Grab the [source code via SVN](http://code.google.com/p/plazes/source/browse/trunk/fireplazer/) and place it in a local directory.
  1. As [outlined more fully here](http://developer.mozilla.org/en/docs/Building_an_Extension#Test), create a file in your Firefox profile's extensions directory:
    1. Locate your [Profile Folder](http://kb.mozillazine.org/Profile_folder).
    1. Open the **extensions** folder found therein.
    1. Create a new text file called **app@fireplazer.com** and inside the file put the path to the FirePlazer source you downloaded (this is the directory that contains the install.rdf file).  For example, if you downloaded to **/Users/fred/fireplazer** you should put **/Users/fred/fireplazer/** (trailing slash required) in this file.
    1. Save the file.
    1. Restart Firefox.

You should now find FirePlazer has been installed (you can look under **Tools | Add-ons | Extensions** to confirm).

## Usage Notes ##

### Authentication ###

Make sure you've already got your Plazes.net username and password stored in the Firefox [Login Manager](http://developer.mozilla.org/en/docs/Using_nsILoginManager) before attempting to use FirePlazer, as that's where it looks for them (just login to Plazes.net and let Firefox save the login details when prompted).

### Creating a Presence ###

Once installed, you can open the FirePlazer sidebar with:

  * **View | Sidebar | FirePlazer** from the Firefox menu.
  * (Command | Alt) + Shift + F keyboard shortcut.

You'll see a "Plaze" search at the top of the sidebar.

  * Leave this field **empty** and click "Search" and FirePlazer will look up the MAC address of your network's default gateway and find any Plazes associated with it (presently this only works for Mac OS X and Linux, and has only been ''tested'' on a Mac).
  * Enter a **keyword** in this field and click "Search" and FirePlazes will return a list of matching Plazes.

Once you've search for the appropriate Plaze, select the one you want to use from the pop-up menu (there's no facility built in for "create a new Plaze" yet).

Then, in the "What and When?" section, enter a status message (optional) and adjust the date and time (optional; defaults to the current time, so you only need to adjust if you want to Plaze yourself in the past or in the future).

Finally, click "Plaze Me" to create your presence.

### Contacts' Presences ###

Because Plazes.net doesn't yet have a "social layer," there's no facility through the Plazes.net API to obtain "your contacts' presences," so, for the time being, FirePlazer displays your _Plazes.com_ contacts instead (the assumption is that your Plazes.net and Plazes.com username and password are the same).

These presences are displayed using a programatically-elegant [XUL XML template](http://code.google.com/p/plazes/source/browse/trunk/fireplazer/chrome/content/fireplazer.xul#62) that is, at present, otherwise rather ugly in terms of functionality and design.

## Known Issues ##

### Auto-plazing ###

  * The "auto-plazing" process works by running a BASH shell script using [nsIProcess](http://developer.mozilla.org/en/docs/nsIProcess).  It's only been tested under Mac OS X Leopard, and although I've attempted to make allowances for operation under Linux, I haven't tested this.
  * Auto-plazing _doesn't_ work  under Windows, although I've got the beginnings of some [MAC address lookup code](FindingMACAddress.md) for Windows that uses VBScript that might be integrated.

### Error Handling ###

  * There's less error handling than there should be, particularly if no Plaze can be found based on your MAC or keyword search.

### UI ###

  * The "you've been plazed" confirmation message, which appears in the "Plaze Me" button, needs some thought -- there's a better way to do this.

## To Do ##

  * Test under different operating systems (Linux flavours, different OS X versions).
  * Add "create a new Plaze" functionality if no appropriate Plaze found.
  * Accommodate the (not yet developed) Plazes.net social layer when available.
  * UI improvments, especially to "Contacts' Presences".

## Screen Shots ##

![http://plazes.googlecode.com/files/screenshot-FirePlazer-1.png](http://plazes.googlecode.com/files/screenshot-FirePlazer-1.png)