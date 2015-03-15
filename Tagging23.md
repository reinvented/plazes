## Introduction ##

MachineTags can be used to add meta-data to individual Plazes.  This page describes a proposed method for tagging Plazes with [23](http://www.23hq.com/) photo IDs, to allow a Plaze to be connected to photos of itself.

This mechanism is identical to that proposed for TaggingFlickr.

## Details ##

Every 23 photo has a unique **photo\_id**.

Passing this ID to the 23 API method [flickr.photos.getInfo](http://www.flickr.com/services/api/flickr.photos.getInfo.html) retrieves information about the photo, including enough information to construct URLs that lead to the photo.  As such, all we need to tag is the photo\_id.

Because the Flickr machine tag specification doesn't allow namespaces to start with characters other than a-z, it's proposed that the namespace _photo23_ be used rather than _23_.

For example:

```
photo23:photo_id=2973409
```

would relate the given Plaze to [this 23 photo](http://www.23hq.com/reinvented/photo/2973409).