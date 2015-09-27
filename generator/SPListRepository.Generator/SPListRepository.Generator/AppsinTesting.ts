namespace MyApp{
	export class AppsinTestingBaseItem extends SPListRepo.BaseListItem{
		constructor(item?: SP.ListItem){
			super(item);
			if(item){
				this.ContentType = this.getFieldValue("ContentType");
				this._UIVersionString = this.getFieldValue("_UIVersionString");
				this.Attachments = this.getFieldValue("Attachments");
				this.Edit = this.getFieldValue("Edit");
				this.LinkTitleNoMenu = this.getFieldValue("LinkTitleNoMenu");
				this.LinkTitle = this.getFieldValue("LinkTitle");
				this.DocIcon = this.getFieldValue("DocIcon");
				this.ItemChildCount = this.getFieldValue("ItemChildCount");
				this.FolderChildCount = this.getFieldValue("FolderChildCount");
				this.AppAuthor = this.getFieldValue("AppAuthor");
				this.AppEditor = this.getFieldValue("AppEditor");
				this.ProductId = this.getFieldValue("ProductId");
				this.AppVersion = this.getFieldValue("AppVersion");
				this.AppName = this.getFieldValue("AppName");
			}
		}

		ContentType: any;
		_UIVersionString: any;
		Attachments: any;
		Edit: any;
		LinkTitleNoMenu: any;
		LinkTitle: any;
		DocIcon: any;
		ItemChildCount: any;
		FolderChildCount: any;
		AppAuthor: any;
		AppEditor: any;
		ProductId: any;
		AppVersion: any;
		AppName: any;
	}
}