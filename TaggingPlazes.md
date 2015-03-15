## Introduction ##

MachineTags can be used to add meta-data to web objects (Flickr photos, Upcoming events, etc.).  This page describes a proposed method for tagging objects with Plaze IDs to relate them to specific Plazes.

## Details ##

Every Plaze has a unique ID.

Using the _plazes_ namespace, we can thus create a machine tag for that Plaze in the form:

```
plazes:id=plaze_id
```

For example:

```
plazes:id=87873
```

would relate the given object to [this Plaze](http://plazes.com/plazes/87873).