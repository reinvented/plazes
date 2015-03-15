## Introduction ##

MachineTags can be used to add meta-data to individual Plazes.  This page describes a proposed method for tagging Plazes with Flickr photo IDs, to allow a Plaze to be connected to photos of itself.

## Details ##

Every Flickr photo has a unique **photo\_id**.

Passing this ID to the Flickr API method [flickr.photos.getInfo](http://www.flickr.com/services/api/flickr.photos.getInfo.html) retrieves information about the photo, including enough information to construct URLs that lead to the photo.  As such, all we need to tag is the photo\_id.

For example:

```
flickr:photo_id=136020890
```

would relate the given Plaze to [this Flickr photo](http://flickr.com/photos/reinvented/136020890/).