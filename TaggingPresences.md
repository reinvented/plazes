## Introduction ##

MachineTags can be used to add meta-data to web objects (Flickr photos, Upcoming events, etc.).  This page describes a proposed method for tagging objects with Plaze geopresence IDs to relate them to specific Plazes presences.

## Details ##

Every Plazes presence has a unique ID.

Using the _plazes_ namespace, we can thus create a machine tag for that presence in the form:

```
plazes:presence_id=presence_id
```

For example:

```
plazes:presence_id=6129470
```

would relate the given object to [this Plazes presence](http://plazes.com/activities/6129470).