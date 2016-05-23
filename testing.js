var verbose = require('./verbose'),
    console = require('./fancyconsole');

function exec() {
    'use strict';

    var Promise = require("bluebird"),
        doing = function (something) {
            var promise = new Promise(function (resolve, reject) {
                    console.log("Doing " + something + "...");
                    resolve();
                });

            promise.name = 'doing(' + something + ')'

            return promise;
        },
        p = [],
        fulfillmentHandler;

    doing('first thing')
        .then(function somethingInbetween() {
            console.log("Doing something inbetween...");
        })
        .then(doing('second thing'))
        .then(function doesntWork() {
            console.comment("Okay, this is screwed. Let's make it work!");
            console.log("");
        })
        .then(function () {
            doing('first thing')
                .then(function somethingInbetween() {
                    console.log("Doing something inbetween...");
                })
                .then(() => doing('second thing'))
                .then(function itWorks() {
                    console.comment("Wow! Now it works as expected. But why's that?");
                    console.comment("Let's make things a little more verbose.");
                    console.log("");
                    doing = verbose.transformDoing(doing);
                    verbose.transformThen(Promise);

                    p[0] = doing('first thing')
                        .then(function somethingInbetween() {
                            console.log("Doing something inbetween...");
                        })
                        .then(doing('second thing'))
                        .then(function doesntWork() {
                            console.comment("Screwed as expected, but do you see the problem?");
                            console.comment("");
                            console.comment("TODO Why is `doing(second thing)` executed before `somethingInbetween` even");
                            console.comment("     though the latter is constructed earlier?");
                            console.comment("");
                            console.comment("Let's concentrate on `doing(second thing)`. Observe how the promise is being");
                            console.comment("constructed and immediately executed just before calling `then()`.");
                            console.comment("To use promises with `then()` properly you have to wrap the construction in a");
                            console.comment("function like this...");
                        });
                        p[1] = p[0].then(function willDoThingsProperly() {
                            doing('things properly')
                                .then(function () {
                                    console.comment('This is absolutely correct but we have the pyramid of doom...');
                                });
                        });
                        fulfillmentHandler = p[1]._fulfillmentHandler0;
                        p[1].then(function () {
                            console.comment("FIXME This is still not properly, because this `then` is not called on");
                            console.comment("      `doing(things properly)` but the anonymous promise stored in `p[1]`");
                            console.comment("Now this happens:");
                            console.comment("1. `then(willDoThingsProperly)` registers a callback which is called on");
                            console.comment("   fullfillment of the previous promise.");
                            console.comment("2. The previous promise is getting fullfilled.");
                            console.comment("3. Now our callback `willDoThingsProperly` gets called.");
                            console.comment("4. The promise `doing(things properly)` is constructed and immediately");
                            console.comment("   executed - as there is nothing else to do.");
                            console.comment("");
                            console.info(fulfillmentHandler);
                        })
                });
        });
}

module.exports = {
    exec: exec
}