# Introduction #

One of the easiest ways of identifying the "current Plaze" is to use the MAC address of the network gateway, passing it to the API as a [network identifier](NetworkIdentifiers.md).

The MAC address of the network is available in a variety of ways, which tend to vary according to operating system, and even within OS flavours.  This page is an attempt to document these methods.

## Mac OS X ##

```
#!/bin/bash

ARP="/usr/sbin/arp"
NETSTAT="/usr/sbin/netstat"
GREP="/usr/bin/grep"
SED="/usr/bin/sed"
CUT="/usr/bin/cut"

# Get the default gateway's IP address.
GATEWAY=`$NETSTAT -rn | $GREP default | $CUT -c20-35`

# Get the MAC address of the default gateway.
MACADDRESS=`$ARP -n $GATEWAY | $CUT -f4 -d' '`

# Pad the single-hex parts of the MAC address with leading zero
# i.e. 0:4:5a:fd:83:f9 becomes 00:04:5a:fd:83:f9
MACADDRESS=`echo $MACADDRESS | \
$SED "s/^\(.\):/0\1:/" | \
$SED "s/:\(.\):/:0\1:/g" | \
$SED "s/:\(.\):/:0\1:/g" | \
$SED "s/:\(.\)$/:0\1/"`

echo "MAC Address is : $MACADDRESS"
```

## Redhat Enterprise Linux ##

```
#!/bin/bash

ARP="/sbin/arp"
NETSTAT="/bin/netstat"
GREP="/bin/grep"
SED="/bin/sed"
CUT="/bin/cut"
TAIL="/usr/bin/tail"

# Get the default gateway's IP address.
GATEWAY=`$NETSTAT -rn | $GREP "^0.0.0.0" | $CUT -c17-31`

# Get the MAC address of the default gateway.
MACADDRESS=`$ARP -n $GATEWAY | $TAIL -n1 | $CUT -c34-50`

# Convert letters in the MAC address to lower case.
MACADDRESS=`echo $MACADDRESS | \
$SED 'y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/'`

echo "MAC Address is : $MACADDRESS"
```

## Windows ##

The following VBScript is perhaps a somewhat inelegant way of getting the MAC address of the default gateway under Windows.  I'm not enough of a Windows user to know whether this is the best way, nor to know which versions of Windows it supports (I've tested with Windows XP.  I welcome suggestions for alternatives.

```
Set WMI=GetObject("winmgmts:\\.\root\cimv2")
Set WshShell= WScript.CreateObject("WScript.Shell")

set objNetworkAdapters = WMI.ExecQuery ("SELECT * FROM Win32_NetworkAdapterConfiguration WHERE IPEnabled=TRUE")
for Each objAdapter in objNetworkAdapters
  if not isnull(objAdapter.DefaultIPGateway ) Then
    strGateway = join(objAdapter.DefaultIPGateway, ",")
  end if
Next

Set WshArp = WshShell.Exec("arp -a " & strGateway)
strArpResult = WshArp.StdOut.ReadAll

Set RegEx = New RegExp
RegEx.IgnoreCase = True
RegEx.Global = True
RegEx.Pattern = "[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}"

If Regex.Test(strArpResult) = True then
  Set Matches = RegEx.Execute(strArpResult)
  For each Match in Matches
    if not Match = "00-00-00-00-00-00" Then
      Wscript.StdOut.Write Match
    End If
  Next
End if
```

To use this script, save as a text file called, for example, **mac.vbs** and then execute from the Windows command line with:

```
cscript //Nologo mac.vbs
```