#!/usr/bin/env ruby
#
# A very simple experimental command line plazer with mac_address and
# text query support. Needs the ruby gem activeresource installed and
# the programs 'route' and 'arp' to be in your path. Improvements
# welcome. til@plazes.com
#
# License: GPLv2

require 'rubygems'
require 'activeresource'

USER=''
PASS=''
if USER.blank? || PASS.blank?
  puts "Please edit plazer.rb and enter your plazes.net username and password first"
  exit
end


module Plazer
  class Network
    def self.router_mac_address
      if `route -n` =~ /^0\.0\.0\.0\s+(\d+\.\d+\.\d+\.\d+)/
        gateway = $1
        if arp_line = `arp -an`.grep(Regexp.new(gateway.gsub('.', '\.'))).first
          if arp_line =~ /([0-9a-f]{2}(:[0-9a-f]{2}){5})/i
            return $1
          end
        end
      end
      return nil
    end
  end
end

module PlazesNet
  class Base < ActiveResource::Base
    self.site = "https://#{USER}:#{PASS}@plazes.net"
    #self.logger = Logger.new($stderr) # output all http requests and responses
  end
end
class Presence < PlazesNet::Base; end
class Plaze    < PlazesNet::Base; end

if ARGV[0] == '-h'
  puts <<-USAGE
Usage:
./plazer.rb [-h] [q]

q  : optional text query for plaze search
-h : view help
USAGE
  exit
end

q = ARGV[0].blank? ? nil : ARGV[0]
mac = Plazer::Network.router_mac_address
status = "" # TODO

puts "Checking in with mac: '#{mac}' q: '#{q}'"

presence = Presence.new

if mac && q
  presence = Presence.create(
    :plaze => { :q => q },
    :networks => [{:mac_address => mac}]
  )

  # When failed, search for plaze by text query only, and then check
  # in again with plaze_id and network
  if !presence.valid?
    if plaze = Plaze.find(:first, :params => { :q => q })
      presence = Presence.create(
        :plaze_id => plaze.id,
        :networks => [{:mac_address => mac}],
        :status => status
      )
    end
  end
elsif mac
  presence = Presence.create(
    :networks => [{:mac_address => mac}],
    :status => status
  )
elsif q
  presence = Presence.create(
    :plaze => { :q => q },
    :status => status
  )
else
  puts "No router mac_address found. Try to plaze yourself with a text query: ./plazer.rb 'query'"
  exit
end

if presence.new?
  puts "Could not check you in"
else
  puts "Created presence #{presence.id} at: #{[presence.plaze.name, presence.plaze.city, presence.plaze.country].join(', ')}"
end
