/// <reference path="../typings/tsd.d.ts" />
Type.registerNamespace("SPListRepo");
var SPListRepo;
(function (SPListRepo) {
    var Helper = (function () {
        function Helper() {
        }
        Helper.ensureTrailingSlash = function (url) {
            if (!url.endsWith("/")) {
                return url + "/";
            }
            return url;
        };
        Helper.ensureLeadingSlash = function (url) {
            if (!(url.substr(0, 1) === "/")) {
                return "/" + url;
            }
            return url;
        };
        return Helper;
    })();
    SPListRepo.Helper = Helper;
})(SPListRepo || (SPListRepo = {}));
