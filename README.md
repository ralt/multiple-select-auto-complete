multiple-select-auto-complete
===

Purpose
---

Transforms a multiple select into an input auto complete. Doesn't alter the form
behavior at all.

Multiple select elements are especially hard when there are a lot of items in it,
this plugin is there to enhance the user experience.

This is a jQuery plugin.

Usage
---

Like all the jQuery plugins:

```javascript
$(selector).msac(opts);
```

`selector` being the selector for the `<select>` elements you want to transform.

And `opts` is an object with one or more of the following options:

- `maxItems`: Defaults to 20. If there are more than `maxItems` items matching the auto completion, show a little message saying so. This is to avoid performance problems.
- `maxItemsMessage`: Defaults to `'There are more than %d suggestions.'`. Flash message displayed when there are too many suggestions possible.
- `flashDelay`: Defaults to `2000`. Delay before which the flash message disappears.

Contributors
---

- [Florian Margaine](http://margaine.com)

License
---

MIT License.
