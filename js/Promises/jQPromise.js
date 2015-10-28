/// <reference path="../_references.ts" />
var SPListRepo;
(function (SPListRepo) {
    var jQPromise = (function () {
        function jQPromise(dfd) {
            this.dfd = dfd;
        }
        jQPromise.prototype.done = function (cb) {
            this.dfd.promise().done(cb);
        };
        jQPromise.prototype.fail = function (cb) {
            this.dfd.promise().fail(cb);
        };
        jQPromise.prototype.then = function (success, error) {
            this.dfd.promise().then(success, error);
        };
        jQPromise.prototype.always = function (cb) {
            this.dfd.promise().always(cb);
        };
        return jQPromise;
    })();
    SPListRepo.jQPromise = jQPromise;
})(SPListRepo || (SPListRepo = {}));
