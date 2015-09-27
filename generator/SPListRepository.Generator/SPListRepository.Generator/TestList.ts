namespace MyApp{
	export class TestListBaseItem extends SPListRepo.BaseListItem{
		constructor(item?: SP.ListItem){
			super(item);
			if(item){
				this.Text_COl1 = this.getFieldValue("Text_COl1");
				this.MultiText_Col = this.getFieldValue("MultiText_Col");
				this.LookIt_UP = this.getFieldValue("LookIt_UP");
				this.Choice_Col = this.getFieldValue("Choice_Col");
				this.Date_Col = this.getFieldValue("Date_Col");
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
			}
		}

		Text_COl1: any;
		MultiText_Col: any;
		LookIt_UP: any;
		Choice_Col: any;
		Date_Col: any;
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
	}
}