var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../build/sp.list.repository.d.ts" />
var MyApp;
(function (MyApp) {
    var TestCategoriesBaseItem = (function (_super) {
        __extends(TestCategoriesBaseItem, _super);
        function TestCategoriesBaseItem(item) {
            _super.call(this, item);
            if (item) {
                this.mapFromListItem(item);
            }
        }
        TestCategoriesBaseItem.prototype.mapFromListItem = function (item) {
            this.contentType = this.getFieldValue("ContentType");
            this._UIVersionString = this.getFieldValue("_UIVersionString");
            this.edit = this.getFieldValue("Edit");
            this.linkTitleNoMenu = this.getFieldValue("LinkTitleNoMenu");
            this.linkTitle = this.getFieldValue("LinkTitle");
            this.docIcon = this.getFieldValue("DocIcon");
            this.itemChildCount = this.getFieldValue("ItemChildCount");
            this.folderChildCount = this.getFieldValue("FolderChildCount");
            this.appAuthor = this.getFieldValue("AppAuthor");
            this.appEditor = this.getFieldValue("AppEditor");
        };
        TestCategoriesBaseItem.prototype.mapToListItem = function (item) {
            _super.prototype.mapToListItem.call(this, item);
            this.setFieldValue(item, "ContentType", this.contentType);
            this.setFieldValue(item, "_UIVersionString", this._UIVersionString);
            this.setFieldValue(item, "Edit", this.edit);
            this.setFieldValue(item, "LinkTitleNoMenu", this.linkTitleNoMenu);
            this.setFieldValue(item, "LinkTitle", this.linkTitle);
            this.setFieldValue(item, "DocIcon", this.docIcon);
            this.setFieldValue(item, "ItemChildCount", this.itemChildCount);
            this.setFieldValue(item, "FolderChildCount", this.folderChildCount);
            this.setFieldValue(item, "AppAuthor", this.appAuthor);
            this.setFieldValue(item, "AppEditor", this.appEditor);
        };
        return TestCategoriesBaseItem;
    })(SPListRepo.BaseListItem);
    MyApp.TestCategoriesBaseItem = TestCategoriesBaseItem;
})(MyApp || (MyApp = {}));
