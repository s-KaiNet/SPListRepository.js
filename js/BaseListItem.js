/// <reference path="../typings/tsd.d.ts" />
/// <reference path="ViewScope.ts" />
/// <reference path="Constants.ts" />
var SPListRepo;
(function (SPListRepo) {
    var BaseListItem = (function () {
        function BaseListItem(item) {
            this.fileLeafRef = undefined;
            if (item) {
                this.spListItem = item;
                this.file = this.spListItem.get_file();
                this.id = item.get_id();
                this.created = this.getFieldValue(SPListRepo.Fields.Created);
                this.createdBy = this.getFieldValue(SPListRepo.Fields.CreatedBy);
                this.modified = this.getFieldValue(SPListRepo.Fields.Modified);
                this.modifiedBy = this.getFieldValue(SPListRepo.Fields.ModifiedBy);
                this.title = this.getFieldValue(SPListRepo.Fields.Title);
                this.fileDirRef = this.getFieldValue(SPListRepo.Fields.FileDirRef);
                this.fileSystemObjectType = this.spListItem.get_fileSystemObjectType();
            }
        }
        BaseListItem.prototype.getFieldValue = function (name) {
            var value = this.spListItem.get_fieldValues()[name];
            if (typeof value !== "undefined") {
                return this.spListItem.get_item(name);
            }
            return undefined;
        };
        return BaseListItem;
    })();
    SPListRepo.BaseListItem = BaseListItem;
})(SPListRepo || (SPListRepo = {}));
