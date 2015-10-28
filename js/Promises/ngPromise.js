/// <reference path="../_references.ts" />
var SPListRepo;
(function (SPListRepo) {
    var ngPromise = (function () {
        function ngPromise(dfd) {
            this.dfd = dfd;
        }
        ngPromise.prototype.done = function (cb) {
            this.dfd.promise.then(cb);
        };
        ngPromise.prototype.fail = function (cb) {
            this.dfd.promise.catch(cb);
        };
        ngPromise.prototype.then = function (success, error) {
            this.dfd.promise.then(success, error);
        };
        ngPromise.prototype.always = function (cb) {
            this.dfd.promise.finally(cb);
        };
        return ngPromise;
    })();
    SPListRepo.ngPromise = ngPromise;
})(SPListRepo || (SPListRepo = {}));
