// dependencies
var debug = require("debug")("dom-router");
var each = require("each");

// single export
module.exports = function (options) {
    options = options || {};

    debug("configured options:", options);

    var el = options.element || document.body;
    var page = el.getAttribute(options.pageAttr || "id");
    debug("page script id parsed as:", page);
    var behaviors = el.getAttribute(options.behaviorAttr || "class");
    debug("behavior script ids parsed as:", behaviors);

    processBehaviors(behaviors, options);
    processPage(page, options);
};

function processBehaviors(behaviors, options) {
    var ctx = options.context || null;
    var args = options.args || [];
    var registry = options.behaviors;
    var ids = !!behaviors ? behaviors.split(/\s+/) : [];
    ids.unshift("common");

    if (!registry) {
        debug("no behavior registry");
    } else {
        each(ids, function (id) {
            if (id in registry) {
                if (typeof args === "function") {
                    var fnArgs = args("behavior", id);
                }

                debug("executing behavior script:", id);
                options.behaviors[id].apply(ctx, fnArgs || args);
            } else {
                debug("behavior script not available in registry:", id);
            }
        });
    }
}

function processPage(page, options) {
    var ctx = options.context || null;
    var args = options.args || [];
    var registry = options.pages;

    if (!registry) {
        debug("no page registry");
    } else if (!page) {
        debug("no page script configured to run on this page");
    } else if (page in registry) {
        if (typeof args === "function") args = args("page", page);
        debug("executing page script:", page);
        registry[page].apply(ctx, args);
    } else {
        debug("page script not available in registry:", page);
    }
}
