namespace MyApp{
	export class TestLIbBaseItem extends SPListRepo.BaseListItem{
		constructor(item?: SP.ListItem){
			super(item);
			if(item){
				this.TestText = this.getFieldValue("TestText");
				this.TestMultilineText = this.getFieldValue("TestMultilineText");
				this.TestChoice = this.getFieldValue("TestChoice");
				this.TestNumber = this.getFieldValue("TestNumber");
				this.TestDateTime = this.getFieldValue("TestDateTime");
				this.TestYesNo = this.getFieldValue("TestYesNo");
				this.TestUserField = this.getFieldValue("TestUserField");
				this.TestLilnk = this.getFieldValue("TestLilnk");
				this.TestLookup = this.getFieldValue("TestLookup");
				this.ContentType = this.getFieldValue("ContentType");
				this._CopySource = this.getFieldValue("_CopySource");
				this.CheckoutUser = this.getFieldValue("CheckoutUser");
				this._CheckinComment = this.getFieldValue("_CheckinComment");
				this.LinkFilenameNoMenu = this.getFieldValue("LinkFilenameNoMenu");
				this.LinkFilename = this.getFieldValue("LinkFilename");
				this.DocIcon = this.getFieldValue("DocIcon");
				this.FileSizeDisplay = this.getFieldValue("FileSizeDisplay");
				this.ItemChildCount = this.getFieldValue("ItemChildCount");
				this.FolderChildCount = this.getFieldValue("FolderChildCount");
				this.AppAuthor = this.getFieldValue("AppAuthor");
				this.AppEditor = this.getFieldValue("AppEditor");
				this.Edit = this.getFieldValue("Edit");
				this._UIVersionString = this.getFieldValue("_UIVersionString");
				this.ParentVersionString = this.getFieldValue("ParentVersionString");
				this.ParentLeafName = this.getFieldValue("ParentLeafName");
			}
		}

		TestText: any;
		TestMultilineText: any;
		TestChoice: any;
		TestNumber: any;
		TestDateTime: any;
		TestYesNo: any;
		TestUserField: any;
		TestLilnk: any;
		TestLookup: any;
		ContentType: any;
		_CopySource: any;
		CheckoutUser: any;
		_CheckinComment: any;
		LinkFilenameNoMenu: any;
		LinkFilename: any;
		DocIcon: any;
		FileSizeDisplay: any;
		ItemChildCount: any;
		FolderChildCount: any;
		AppAuthor: any;
		AppEditor: any;
		Edit: any;
		_UIVersionString: any;
		ParentVersionString: any;
		ParentLeafName: any;
	}
}