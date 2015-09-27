namespace MyApp{
	export class MicroFeedBaseItem extends SPListRepo.BaseListItem{
		constructor(item?: SP.ListItem){
			super(item);
			if(item){
				this.MicroBlogType = this.getFieldValue("MicroBlogType");
				this.PostAuthor = this.getFieldValue("PostAuthor");
				this.DefinitionId = this.getFieldValue("DefinitionId");
				this.RootPostID = this.getFieldValue("RootPostID");
				this.RootPostOwnerID = this.getFieldValue("RootPostOwnerID");
				this.RootPostUniqueID = this.getFieldValue("RootPostUniqueID");
				this.ReplyCount = this.getFieldValue("ReplyCount");
				this.ReferenceID = this.getFieldValue("ReferenceID");
				this.Attributes = this.getFieldValue("Attributes");
				this.Content = this.getFieldValue("Content");
				this.ContentData = this.getFieldValue("ContentData");
				this.SearchContent = this.getFieldValue("SearchContent");
				this.RefRoot = this.getFieldValue("RefRoot");
				this.RefReply = this.getFieldValue("RefReply");
				this.PostSource = this.getFieldValue("PostSource");
				this.PeopleCount = this.getFieldValue("PeopleCount");
				this.PeopleList = this.getFieldValue("PeopleList");
				this.MediaLinkType = this.getFieldValue("MediaLinkType");
				this.MediaLinkDescription = this.getFieldValue("MediaLinkDescription");
				this.PostSourceUri = this.getFieldValue("PostSourceUri");
				this.MediaLinkURI = this.getFieldValue("MediaLinkURI");
				this.MediaLinkUISnippet = this.getFieldValue("MediaLinkUISnippet");
				this.MediaLinkContentURI = this.getFieldValue("MediaLinkContentURI");
				this.MediaLength = this.getFieldValue("MediaLength");
				this.MediaWidth = this.getFieldValue("MediaWidth");
				this.MediaHeight = this.getFieldValue("MediaHeight");
				this.MediaActionClickUrl = this.getFieldValue("MediaActionClickUrl");
				this.MediaActionClickKind = this.getFieldValue("MediaActionClickKind");
				this.eMailSubscribers = this.getFieldValue("eMailSubscribers");
				this.eMailUnsubscribed = this.getFieldValue("eMailUnsubscribed");
				this.RemoteLocation = this.getFieldValue("RemoteLocation");
				this.LikesCount = this.getFieldValue("LikesCount");
				this.HashTags = this.getFieldValue("HashTags");
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

		MicroBlogType: any;
		PostAuthor: any;
		DefinitionId: any;
		RootPostID: any;
		RootPostOwnerID: any;
		RootPostUniqueID: any;
		ReplyCount: any;
		ReferenceID: any;
		Attributes: any;
		Content: any;
		ContentData: any;
		SearchContent: any;
		RefRoot: any;
		RefReply: any;
		PostSource: any;
		PeopleCount: any;
		PeopleList: any;
		MediaLinkType: any;
		MediaLinkDescription: any;
		PostSourceUri: any;
		MediaLinkURI: any;
		MediaLinkUISnippet: any;
		MediaLinkContentURI: any;
		MediaLength: any;
		MediaWidth: any;
		MediaHeight: any;
		MediaActionClickUrl: any;
		MediaActionClickKind: any;
		eMailSubscribers: any;
		eMailUnsubscribed: any;
		RemoteLocation: any;
		LikesCount: any;
		HashTags: any;
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