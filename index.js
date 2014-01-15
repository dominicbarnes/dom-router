// dependencies
var each = require("each");

// single export
module.exports = function (element, options) {
    options = options || {};
    var el = element || document.body;
    
    var page = el[options.pageAttr || "id"];
    var behaviors = el[options.behaviorAttr || "className"];
    
    var ctx = options.context || null;
    var args = options.args || [];
    
    each(behaviors.split(" "), function (id) {
        if (id in options.behaviors) {
            options.behaviors[id].apply(ctx, args);
        } else {
            console.error("behavior script", id, "not found");
        }
    });
    
    if (page && page in options.pages) {
        options.pages[page].apply(ctx, args);
    }
};
