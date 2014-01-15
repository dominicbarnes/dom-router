var expect = require("expect.js");
var router = require("dom-router");

describe("DomRouter()", function () {
    before(function () {
        document.body.id = "test-body";
    });

    after(function () {
        document.body.id = null;
    });

    it("should use the body element by default", function (done) {
        router({
            pages: {
                "test-body": done
            }
        });
    });

    it("should allow the target element to be changed", function (done) {
        var el = document.createElement("div");
        el.id = "hello-world";

        router({
            element: el,
            pages: {
                "hello-world": done
            }
        });
    });

    it("should allow the page ID attribute to be changed", function (done) {
        var el = document.createElement("div");
        el.setAttribute("data-page", "abc");

        router({
            element: el,
            pageAttr: "data-page",
            pages: {
                "abc": done
            }
        });
    });

    it("should execute all behaviors (white-space separated)", function (done) {
        var calls = 0;
        var el = document.createElement("div");
        el.className = "a b   c";

        function call() {
            if (++calls === 3) done();
        }

        router({
            element: el,
            behaviors: {
                a: call,
                b: call,
                c: call,
                d: function () {
                    done(new Error("this should not run"));
                }
            }
        });
    });

    it("should allow the behavior ID attribute to be changed", function (done) {
        var el = document.createElement("div");
        el.setAttribute("data-behaviors", "a");

        router({
            element: el,
            behaviorAttr: "data-behaviors",
            behaviors: {
                a: done
            }
        });
    });

    it("should allow the context to be changed", function (done) {
        var el = document.createElement("div");
        el.id = "foo";

        router({
            element: el,
            context: document.body,
            pages: {
                foo: function () {
                    expect(this).to.equal(document.body);
                    done();
                }
            }
        });
    });

    it("should allow for adding custom callback arguments", function (done) {
        var el = document.createElement("div");
        el.id = "abc";
        el.className = "a b";

        var calls = 0;
        function call(a, b) {
            expect(a).to.equal(1);
            expect(b).to.equal(2);

            if (++calls === 3) done();
        }

        router({
            element: el,
            args: [ 1, 2 ],
            pages: {
                abc: call
            },
            behaviors: {
                a: call,
                b: call
            }
        });
    });

    it("should allow for callback functions to custom arguments", function (done) {
        var el = document.createElement("div");
        el.id = "abc";
        el.className = "a b";

        var calls = 0;
        function call() {
            if (++calls === 3) done();
        }

        router({
            element: el,
            args: function (type, id) {
                return [ type, id, "foo" ];
            },
            pages: {
                abc: function (type, id, test) {
                    expect(type).to.equal("page");
                    expect(id).to.equal("abc");
                    expect(test).to.equal("foo");
                    call();
                }
            },
            behaviors: {
                a: function (type, id, test) {
                    expect(type).to.equal("behavior");
                    expect(id).to.equal("a");
                    expect(test).to.equal("foo");
                    call();
                },
                b: function (type, id, test) {
                    expect(type).to.equal("behavior");
                    expect(id).to.equal("b");
                    expect(test).to.equal("foo");
                    call();
                }
            }
        });
    });
});
