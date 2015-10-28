/// <reference path="../_references.ts" />
var SPListRepo;
(function (SPListRepo) {
    var QDeferred = (function () {
        function QDeferred() {
            this.dfd = Q.defer();
        }
        QDeferred.prototype.promise = function () {
            return new SPListRepo.QPromise(this.dfd);
        };
        QDeferred.prototype.resolve = function (data) {
            return this.dfd.resolve(data);
        };
        QDeferred.prototype.reject = function (reason) {
            return this.dfd.reject(reason);
        };
        return QDeferred;
    })();
    SPListRepo.QDeferred = QDeferred;
})(SPListRepo || (SPListRepo = {}));
