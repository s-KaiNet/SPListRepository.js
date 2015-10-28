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
    var QDeferred = (function () {
        function QDeferred() {
            this.dfd = Q.defer();
        }
        QDeferred.prototype.promise = function () {
            return new QPromise(this.dfd);
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
    var ngDeferred = (function () {
        function ngDeferred() {
            var $q = angular.injector(["ng"]).get("$q");
            this.dfd = $q.defer();
        }
        ngDeferred.prototype.promise = function () {
            return new ngPromise(this.dfd);
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
    var jQDeferred = (function () {
        function jQDeferred() {
            this.dfd = jQuery.Deferred();
            var inj = angular.injector(['ng']).get("$q");
        }
        jQDeferred.prototype.promise = function () {
            return new jQPromise(this.dfd);
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
