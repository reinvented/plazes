## Introduction ##

MachineTags can be used to add meta-data to web objects (Flickr photos, Upcoming events, etc.).  This page describes a proposed method for tagging objects with Plaze user IDs to relate them to specific Plazes users.

## Details ##

Every Plazes user has a unique ID.

Using the _plazes_ namespace, we can thus create a machine tag for that user in the form:

```
plazes:user_id=user_id
```

For example:

```
plazes:user_id=1185
```

would relate the given object to [this Plazes user](http://plazes.com/users/1185).