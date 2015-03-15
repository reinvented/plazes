# Introduction #

MachineTags can be used to add meta-data to individual Plazes.  This pages describes a proposed method for tagging Plazes with telephone number information.

# Details #

The [hCard specification](http://microformats.org/wiki/hcard#adr_tel_email_types) outlines a set of telephone number types.  It's proposed that we use these types to using the following machine tag format:

```
tel:type=value
```

Where:

**type** is one of home, msg, work, pref, fax, cell, video, pager, bbs, modem, car isdn, pcs
**value** is the telephone number, in [E.123](http://en.wikipedia.org/wiki/E.123) format.

For example:

```
tel:work="+1 902 892 2556"
```

or

```
tel:work=+19028922556
```

This would be equivalent to the hCard construct:

```
<div class="tel">
   <span class="type">Work</span> +1 902 892 2556
</div>
```