﻿/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../build/sp.list.repository.d.ts" />

namespace MyApp{
	export class TestLIbBaseItem extends SPListRepo.BaseListItem{
		testText: string;
		testMultilineText: SP.FieldMultiLineText;
		testChoice: string;
		testNumber: number;
		testDateTime: Date;
		testYesNo: boolean;
		testUserField: SP.FieldUserValue;
		testLilnk: SP.FieldUrlValue;
		testLookup: SP.FieldLookupValue;
		contentType: string;
		_CopySource: string;
		checkoutUser: SP.FieldUserValue;
		_CheckinComment: SP.FieldLookupValue;
		linkFilenameNoMenu: string;
		linkFilename: string;
		docIcon: string;
		fileSizeDisplay: string;
		itemChildCount: SP.FieldLookupValue;
		folderChildCount: SP.FieldLookupValue;
		appAuthor: SP.FieldLookupValue;
		appEditor: SP.FieldLookupValue;
		edit: string;
		_UIVersionString: string;
		parentVersionString: SP.FieldLookupValue;
		parentLeafName: SP.FieldLookupValue;
		constructor(item?: SP.ListItem){
			super(item);
			if(item){
				this.mapFromListItem(item);
			}
		}

		mapFromListItem(item: SP.ListItem): void{
			super.mapFromListItem(item);

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
		}

		mapToListItem(item: SP.ListItem): void{
			super.mapToListItem(item);

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
		}
	}
}