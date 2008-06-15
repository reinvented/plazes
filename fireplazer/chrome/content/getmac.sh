#!/bin/bash

# Plazes getmac.sh - get the MAC address of the current network connection
#
# Version:		0.2, June 15, 2008
# Author: 		Peter Rukavina (mailto:peter@rukavina.net)
# Copyright:	Copyright (c) 2008 by Reinvented Inc.
# License: 		http://www.fsf.org/licensing/licenses/gpl.txt GNU Public Licens
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or (at
# your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
# USA
#
# System Requirements
#
# Otherwise, the script assumes the presence of:
#   netstat - used to get the default gateway.
#	arp - used to get the MAC address of the default gateway.
#   grep - used to rip out the heart of various strings.
#   cut - used to cut out the heart of various strings.
#   sed - used for string manipulation.

# Set user-configurable options

DEBUG=0

# Command line arguments - the operating system and the temporary file to store MAC.

OS="$1"
TMP="$2"

# Where are various things found on this machine.  If the defaults don't work, try 'whereis [command]' -- 
# for example 'whereis openssl' and paste in the results here.

if [ $OS == "MacOS" ]; then
	ARP="/usr/sbin/arp"
	NETSTAT="/usr/sbin/netstat"
	GREP="/usr/bin/grep"
	SED="/usr/bin/sed"
	CUT="/usr/bin/cut"
elif [ $OS == "Linux" ]; then
	ARP="/sbin/arp"
	NETSTAT="/bin/netstat"
	GREP="/bin/grep"
	SED="/bin/sed"
	CUT="/bin/cut"
	TAIL="/usr/bin/tail"
fi

GetMACAddress() {

	if [ $OS == "MacOS" ]; then
		# Get the default gateway using netstat.
		
		GATEWAY=`$NETSTAT -rn | $GREP default | $CUT -c20-35`
		
		if [ $DEBUG == 1 ]; then
			echo "Default Gateway   : $GATEWAY"
		fi
		
		# Get the MAC address of the default gateway.
		
		MACADDRESS=`$ARP -n $GATEWAY | cut -f4 -d' '`
		
		if [ $DEBUG == 1 ]; then
			echo "MAC Address       : $MACADDRESS"
		fi
	elif [ $OS == "Linux" ]; then
		# Get the default gateway using netstat.
		
		GATEWAY=`$NETSTAT -rn | $GREP "^0.0.0.0" | $CUT -c17-31`
		
		if [ $DEBUG == 1 ]; then
			echo "Default Gateway   : $GATEWAY"
		fi
		
		# Get the MAC address of the default gateway (and convert to lower case, as required by the Plazes.com API)
		
		MACADDRESS=`$ARP -n $GATEWAY | $TAIL -n1 | cut -c34-50`
		MACADDRESS=`echo $MACADDRESS | $SED 'y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/'`
		
		if [ $DEBUG == 1 ]; then
			echo "MAC Address       : $MACADDRESS"
		fi
	fi

	# Pad the single-hex parts of the MAC address with leading zero -- i.e. 0:4:5a:fd:83:f9 becomes 00:04:5a:fd:83:f9
	# This works using various bits of sed regular expression magic.
	
	MACADDRESS_CONVERTED=`echo $MACADDRESS | $SED "s/^\(.\):/0\1:/" | $SED "s/:\(.\):/:0\1:/g" | $SED "s/:\(.\):/:0\1:/g" | $SED "s/:\(.\)$/:0\1/"`
	
	if [ $DEBUG == 1 ]; then
		echo "MAC Address Conv  : $MACADDRESS_CONVERTED"
	fi
}

#--------------------------
# AND HERE WE GO...
#--------------------------

GetMACAddress		# Get the current MAC address

echo $MACADDRESS_CONVERTED > "$TMP"

#--------------------------
# THE END.
#--------------------------
