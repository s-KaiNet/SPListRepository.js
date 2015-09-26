/// <reference path="../typings/tsd.d.ts" />
/// <reference path="RequestError.ts" />
/// <reference path="Helpers.ts" />
var SPListRepo;
(function (SPListRepo) {
    var ListService = (function () {
        function ListService() {
            this.$ = jQuery;
        }
        ListService.getListByUrl = function (listUrl) {
            var loadDeferred = $.Deferred();
            var webAbsoluteUrl = SPListRepo.Helper.ensureTrailingSlash(_spPageContextInfo.webAbsoluteUrl);
            var webServerRelativeUrl = SPListRepo.Helper.ensureTrailingSlash(_spPageContextInfo.webServerRelativeUrl);
            var url = String.format("{0}_api/web/lists/?$expand=RootFolder&$filter=RootFolder/ServerRelativeUrl eq '{1}{2}'&$select=ID", webAbsoluteUrl, webServerRelativeUrl, listUrl);
            var context = SP.ClientContext.get_current();
            var success = function (list) {
                loadDeferred.resolve(list);
            };
            var error = function (err) {
                loadDeferred.reject(err);
            };
            if ((context.get_web()).getList) {
                var list = (context.get_web()).getList(String.format("{0}{1}", webServerRelativeUrl, listUrl));
                context.load(list);
                context.executeQueryAsync(function () {
                    success(list);
                }, function (sender, err) {
                    error(new SPListRepo.RequestError(err));
                });
            }
            else {
                ListService.getListUsingRest(url, success, error);
            }
            return loadDeferred.promise();
        };
        ListService.getListById = function (id) {
            var loadDeferred = $.Deferred();
            var context = SP.ClientContext.get_current();
            var list = context.get_web().get_lists().getById(id);
            context.load(list, "Title", "RootFolder", "Id");
            context.executeQueryAsync(function () {
                loadDeferred.resolve(list);
            }, function (sender, err) {
                loadDeferred.reject(new SPListRepo.RequestError(err));
            });
            return loadDeferred.promise();
        };
        ListService.getListUsingRest = function (url, success, error) {
            $.ajax({
                url: url,
                type: "GET",
                contentType: "application/json;odata=verbose",
                headers: {
                    "Accept": "application/json;odata=verbose"
                },
                success: function (data) {
                    var context = SP.ClientContext.get_current();
                    var list = context.get_web().get_lists().getById(data.d.results[0].Id);
                    context.load(list);
                    context.executeQueryAsync(function () {
                        success(list);
                    }, function (sender, e) {
                        error(new SPListRepo.RequestError(e));
                    });
                },
                error: function (jqXHR, textStatus) {
                    error(new SPListRepo.RequestError(textStatus));
                }
            });
        };
        return ListService;
    })();
    SPListRepo.ListService = ListService;
})(SPListRepo || (SPListRepo = {}));
