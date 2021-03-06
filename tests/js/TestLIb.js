/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../build/sp.list.repository.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MyApp;
(function (MyApp) {
    var TestLIbBaseItem = (function (_super) {
        __extends(TestLIbBaseItem, _super);
        function TestLIbBaseItem(item) {
            _super.call(this, item);
            if (item) {
                this.mapFromListItem(item);
            }
        }
        TestLIbBaseItem.prototype.mapFromListItem = function (item) {
            _super.prototype.mapFromListItem.call(this, item);
            this.testText = this.getFieldValue("TestText");
            this.testMultilineText = this.getFieldValue("TestMultilineText");
            this.testChoice = this.getFieldValue("TestChoice");
            this.testNumber = this.getFieldValue("TestNumber");
            this.testDateTime = this.getFieldValue("TestDateTime");
            this.testYesNo = this.getFieldValue("TestYesNo");
            this.testUserField = this.getFieldValue("TestUserField");
            this.testLilnk = this.getFieldValue("TestLilnk");
            this.testLookup = this.getFieldValue("TestLookup");
            this.contentType = this.getFieldValue("ContentType");
            this._CopySource = this.getFieldValue("_CopySource");
            this.checkoutUser = this.getFieldValue("CheckoutUser");
            this._CheckinComment = this.getFieldValue("_CheckinComment");
            this.linkFilenameNoMenu = this.getFieldValue("LinkFilenameNoMenu");
            this.linkFilename = this.getFieldValue("LinkFilename");
            this.docIcon = this.getFieldValue("DocIcon");
            this.fileSizeDisplay = this.getFieldValue("FileSizeDisplay");
            this.itemChildCount = this.getFieldValue("ItemChildCount");
            this.folderChildCount = this.getFieldValue("FolderChildCount");
            this.appAuthor = this.getFieldValue("AppAuthor");
            this.appEditor = this.getFieldValue("AppEditor");
            this.edit = this.getFieldValue("Edit");
            this._UIVersionString = this.getFieldValue("_UIVersionString");
            this.parentVersionString = this.getFieldValue("ParentVersionString");
            this.parentLeafName = this.getFieldValue("ParentLeafName");
        };
        TestLIbBaseItem.prototype.mapToListItem = function (item) {
            _super.prototype.mapToListItem.call(this, item);
            this.setFieldValue(item, "TestText", this.testText);
            this.setFieldValue(item, "TestMultilineText", this.testMultilineText);
            this.setFieldValue(item, "TestChoice", this.testChoice);
            this.setFieldValue(item, "TestNumber", this.testNumber);
            this.setFieldValue(item, "TestDateTime", this.testDateTime);
            this.setFieldValue(item, "TestYesNo", this.testYesNo);
            this.setFieldValue(item, "TestUserField", this.testUserField);
            this.setFieldValue(item, "TestLilnk", this.testLilnk);
            this.setFieldValue(item, "TestLookup", this.testLookup);
            this.setFieldValue(item, "CheckoutUser", this.checkoutUser);
        };
        return TestLIbBaseItem;
    })(SPListRepo.BaseListItem);
    MyApp.TestLIbBaseItem = TestLIbBaseItem;
})(MyApp || (MyApp = {}));
