dom-router
==========

Dynamically execute client-side scripts based on DOM attributes. This is **not**
intended as a router for SPA applications, rather it's a way to add structure to
your client scripts even in a "traditional" web application.

This is largely inspired by
[Paul Irish's technique](http://www.paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/).

This particular implementation breaks from the original in that it doesn't rely
on a structure based directly on MVC. In addition, you aren't required to write
large object literals to house all your code. (instead, you can leverage the
CommonJS architecture of Component for cleaner code!)

## Concepts

Scripts are broken up into 2 main categories:

**Page Scripts** are executed only for a single page of an application. Thus,
only a single page script will ever run on a given page. Each page must be
uniquely addressable, and a typical pattern in an MVC setup is to generate page
IDs by combining the controller/action names. (e.g.: `user-profile` for the
current user's profile page, which may exist at URL: `/users/:id/profile`)

**Behavior Scripts** are different in that multiple behaviors can be applied to
any given page. An example would be a widget that you reuse across multiple
pages. Rather than needing to hook that initialization logic into each relevant
page script, defining a behavior script allows you to keep code DRY.

By definition, this pattern leverages the DOM directly in order to communicate
what needs to be executed. This makes debugging as simple as using your
browser's debugging tools. In addition, this removes the need to expose data
directly via ugly inline script tags.

## Usage

By default, the current page's `<body>` tag is inspected, as well as it's `id`
and `class` attributes. (all these details are configurable)

So, given:

```html
<body id="home" class="login cart">
```

Semantically, this means we are going to execute the `home` page script, and
both the `login` and `cart` behavior scripts.

```javascript
var router = require("dom-router");

// NOTE: this executes immediately, you are responsible for calling this at
//       some other point (DOMContentLoaded, onload, etc)
router({
    pages: {
        home: function () {
            // initialize any dynamic activity on the home page
        },
        // ...
    },
    behaviors: {
        login: function () {
            // initialize a login dropdown
        },
        cart: function () {
            // initialize a shopping cart dropdown
        }
    }
});
```

*In a component-based setup, you'll likely use `require` to set up your
available `pages` and `behaviors` objects.*


## Available Configuration

### `pages`

A flat object where each key is a page ID and each corresponding property
is a `Function`.

### `behaviors`

A flat object where each key is a behavior ID and each corresponding property
is a `Function`.

### `element`

Determines what DOM element to inspect. (default is `document.body`)

### `pageAttr`

Determines what attribute of the `element` to extract the page ID. (default
is `"id"`)

### `behaviorAttr`

Determines what attribute of the `element` to extract the list of behaviors.
(default is `"class"`)

### `context`

Determines what context to execute any scripts with. (default is `window`)

### `args`

Used to determine what additional arguments to pass to any exectued scripts.
The default is an empty array (i.e. no arguments)

If a `Function` is used here, it will run with 2 arguments:

 * `type` (will be  either `"page"` or `"behavior"`)
 * `id` (which is the page/behavior script id respectively)

This function should return an array that will be used as the argument list.
(i.e. passed on into `.apply()`)


## Developers

Depends on `component` and `component-test` available globally:

    sudo npm -g install component component-test2

Build/tests are handled via GNU Make.

```shell
# install + build
make

# run tests
make test
```
