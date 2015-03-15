# Introduction #

MachineTags can be used to add meta-data to individual Plazes.  This pages describes a proposed method for tagging Plazes with information about the availability of Internet access.

# Details #

The Plazes data model contains one boolean field, _has\_free\_wifi_, that records network access.  I propose we expand this with machine tagging to include general Internet network access, wifi, using the machine tag pattern:

```
internet:medium=access
```

Where:

**medium** is one of wifi, ethernet, kiosk and ...?

**access** is one of free, charge, freewithpurchase, freeforguests and ...?

For example:

```
internet:wifi=free
internet:ethernet=charge
internet:kiosk=freeforguests
```