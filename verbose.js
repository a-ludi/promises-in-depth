var fancyconsole = require('./fancyconsole');

function transformDoing(doing) {
    return function (something) {
        var promise;

        fancyconsole.comment('Constructing promise doing(' + something + ')');
        promise = doing(something);
        fancyconsole.comment('Constructed promise doing(' + something + ')');

        return promise;
    }
}

function transformThen(Promise) {
    Promise.prototype._origThen = Promise.prototype.then;
    Promise.prototype.then = function (onFulfilled) {
        var promise;

        fancyconsole.comment('Entering then(' + onFulfilled.name + ')');
        promise = this._origThen(onFulfilled);
        fancyconsole.comment('Finished then(' + onFulfilled.name + ')');

        return promise;
    }
}

module.exports = {
    transformDoing: transformDoing,
    transformThen: transformThen
}