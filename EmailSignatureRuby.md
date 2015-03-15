# Email Signature in Ruby #

A ruby script that outputs an email signature with your current presence from
plazes.net, for example like this:

```
Sent from florianihof, Vienna
http://plazes.net/users/til/presence
```


---


Full code included below for your copy and paste delight.

```
#!/usr/bin/env ruby
#
# Outputs an email signature with your current presence from
# plazes.net
#
# License: MIT (http://www.opensource.org/licenses/mit-license.php)

# Fill in your plazes.net username and password here
USER = ""
PASS = ""

require 'rubygems'
require 'activeresource'

module Plazes
  class Base < ActiveResource::Base
    self.site = "https://#{USER}:#{PASS}@plazes.net"
  end
  
  class Plaze < Base;    end
  class Presence < Base; end
end

presence = Plazes::Presence.find(:one, :from => "/me/presence.xml")

# Don't assume we are still or already there when it is longer than 6
# hours ago or longer than 6 hours from now
if (presence.scheduled_at.utc - Time.now.utc).abs < 6.hours
  puts "Sent from #{presence.plaze.name}, #{presence.plaze.city.capitalize}"
end

puts "http://plazes.net/users/#{USER}/presence"
```


---


For mutt users to include this sig by default when composing a new mail, put the script as executable somewhere in your path and add this to .muttrc:

`set signature="signature|"`


---


(One of many ThirdPartyApps)