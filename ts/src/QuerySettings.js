/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="ViewScope.ts" />
var SPListRepo;
(function (SPListRepo) {
    var QuerySettings = (function () {
        function QuerySettings(viewScope, viewFields, rowLimit) {
            this.viewScope = viewScope;
            this.viewFields = viewFields;
            this.rowLimit = rowLimit;
        }
        return QuerySettings;
    })();
    SPListRepo.QuerySettings = QuerySettings;
})(SPListRepo || (SPListRepo = {}));
