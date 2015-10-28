/// <reference path="../_references.ts" />
var SPListRepo;
(function (SPListRepo) {
    var jQDeferred = (function () {
        function jQDeferred() {
            this.dfd = jQuery.Deferred();
            var inj = angular.injector(['ng']).get("$q");
        }
        jQDeferred.prototype.promise = function () {
            return new SPListRepo.jQPromise(this.dfd);
        };
        jQDeferred.prototype.resolve = function (data) {
            return this.dfd.resolve(data);
        };
        jQDeferred.prototype.reject = function (reason) {
            return this.dfd.reject(reason);
        };
        return jQDeferred;
    })();
    SPListRepo.jQDeferred = jQDeferred;
})(SPListRepo || (SPListRepo = {}));
