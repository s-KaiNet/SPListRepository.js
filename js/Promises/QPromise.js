/// <reference path="../_references.ts" />
var SPListRepo;
(function (SPListRepo) {
    var QPromise = (function () {
        function QPromise(dfd) {
            this.dfd = dfd;
        }
        QPromise.prototype.done = function (cb) {
            this.dfd.promise.done(cb);
        };
        QPromise.prototype.fail = function (cb) {
            this.dfd.promise.catch(cb);
        };
        QPromise.prototype.then = function (success, error) {
            this.dfd.promise.then(success, error);
        };
        QPromise.prototype.always = function (cb) {
            this.dfd.promise.finally(cb);
        };
        return QPromise;
    })();
    SPListRepo.QPromise = QPromise;
})(SPListRepo || (SPListRepo = {}));
