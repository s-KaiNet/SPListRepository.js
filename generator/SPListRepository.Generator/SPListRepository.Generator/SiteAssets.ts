namespace MyApp{
	export class SiteAssetsBaseItem extends SPListRepo.BaseListItem{
		constructor(item?: SP.ListItem){
			super(item);
			if(item){
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