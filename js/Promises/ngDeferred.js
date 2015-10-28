/// <reference path="../_references.ts" />
var SPListRepo;
(function (SPListRepo) {
    var ngDeferred = (function () {
        function ngDeferred() {
            var $q = angular.injector(["ng"]).get("$q");
            this.dfd = $q.defer();
        }
        ngDeferred.prototype.promise = function () {
            return new SPListRepo.ngPromise(this.dfd);
        };
        ngDeferred.prototype.resolve = function (data) {
            return this.dfd.resolve(data);
        };
        ngDeferred.prototype.reject = function () {
            return this.dfd.reject();
        };
        return ngDeferred;
    })();
    SPListRepo.ngDeferred = ngDeferred;
})(SPListRepo || (SPListRepo = {}));
