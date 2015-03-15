
---


## The Plazes.net website and API service are ceasing operation as of August 15, 2008 ##

**With the [acquisition of Plazes by Nokia now complete](http://blog.plazes.com/?p=253) the Plazes development team is concentrating its resources building something new within Nokia, and it's very likely that the structure of the Plazes API will change significantly.**

### As such, the Plazes.net website and the Plazes.net API will cease operation on August 15, 2008. ###

**The Plazes.com site, and [the Plazes.com API](http://plazes.com/api/docs), will remain in operation for the time-being.**


---


From its earliest incarnation, Plazes has included the ability to tie a Ethernet network MAC address to a Plaze. This is how the Plazer works: it looks up the MAC of the local network, and sends this to Plazes.com to retrieve the Plaze, if any, associated with that MAC.

The [Plazes.net API](http://plazes.net/doc) extends this functionality to include the ability to use additional network identifiers.

## Plazes.net API Support ##

### Creating a Presence ###

When you **create a new presence** with [POST /presences](http://plazes.net/doc/presences_collection#POST) you can include networks information.  For example, to include the MAC address, you pass **mac\_address**, like this:

```
<presence>
    <networks type="array">
      <network>
        <mac_address>00:00:00:00:00:aa</mac_address>
      </network>
    </networks>
</presence>        
```

### Querying Plazes ###

When you **query plazes** with [GET /plazes](http://plazes.net/doc/plazes_collection#GET) you can include networks information to supplement your query.  For example, if you have a MAC address and want to identify its Plazes, you can do this:

```
GET /plazes.xml
Content-type: application/x-www-form-urlencoded
networks[][mac_address]=00:00:00:00:00:aa
```

## Beyond the MAC Address ##

The **networks** parameter has now been generalized to allow network identifiers _in addition_ to Ethernet MAC addresses to be used.  The parameter is now a set of key/value pairs, and the key can be an arbitrary value of your choosing.

Although you can use **any** value as a key:

```
networks[][mountaintop]=everest
```

...it makes sense that we agree on some standards for commonly-used networks.  Currently proposed are:

### Bluetooth ###

Like Ethernet devices, Bluetooth devices are assigned globally unique Bluetooth Device Addresses, also known as the BD\_ADDR.  This is a 48-bit address that's commonly expressed just like a MAC address: the address of my laptop, for example, is **00:16:cb:36:cc:d0**.

The [Bluetooth website](http://bluetooth.com/Bluetooth/Technology/Works/Architecture__Baseband.htm) has more details about Bluetooth Device Addressing.

It's proposed that the **networks** parameter key for Bluetooth devices addresses is '''bd\_addr'''.

In practice this means that if I arrived at the office and programatically detected the presence of my laptop via Bluetooth for the first time, I could create a presence:

```
POST /presences.xml
Content-type: application/x-www-form-urlencoded
presence[networks][][bd_addr]=00:16:cb:36:cc:d0&presence[status]=at+the+office&presence[plaze_id]=17631
```

Following after that, I could pass that address back to query Plazes:

```
http://plazes.net/plazes?networks[][bd_addr]=00:16:cb:36:cc:d0
```

### GSM Cell Identifiers ###

Every GSM cell is uniquely identified by a Cell Global Identity (CGI) identifier, which consists of four parts:

  * Mobile Country Code (MCC) - A 3-digit code that uniquely identifies the country.  For example, the MCC for Canada is **302**.
  * Mobile Network Code (MNC) - A 2 or 3-digit code that identifies the home GSM network operator ("the phone company").  For example, the MNC for Rogers Wireless in Canada is **720**.
  * Location Area Code (LAC) - A 16-bit number identifying a location area within a GSM network.
  * Cell Identity (CI) - A 16-bit number that identifies a cell within a location area.

It's proposed that the **networks** parameter key for GSM cells is '''gsm\_cgi''', in the format:

```
MCC:MNC:LAC:CI
```

Each component would be expressed as a decimal number.  For example:

```
302:720:1300:7171
```

For example:

```
POST /presences.xml
Content-type: application/x-www-form-urlencoded
presence[networks][][gsm_cgi]=0302:720:1300:7171&presence[status]=at+the+office&presence[plaze_id]=17631
```

Following after that, I could pass that address back to query Plazes:

```
http://plazes.net/plazes?networks[][gsm_cgi]=302:720:1300:7171
```