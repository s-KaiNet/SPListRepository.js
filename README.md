# SPListRepository.js
Repository pattern implementation in TypeScript for convenient list data access through the SharePoint JavaScript client object model. Tested with SharePoint 2013 and SharePoint Online.

###NuGet: 
```
Install-Package SPListRepository.js 
```
###Bower:
```
bower install SPListRepository.js
```  

###Development: 
1. Clone the repository.
2. Restore dependencies `npm install`
2. Run `gulp build` for building javascript in one file and generating typescript schema. 
3. Run `gulp watch` to automatically build. 

###Test:
1. Install jasmine globally - `npm install jasmine -g`
2. Create two lists in SharePoint from template (`tests\data\TestLib.stp` and `tests\data\TestCategories.stp`)
3. Run gulp tests. 

Currently project has following dependencies:   

- [`jQuery`](https://github.com/jquery/jquery) (promises) 
- [`camljs`](https://camljs.codeplex.com/) (convenient CAML queries construction) 
- [`MicrosoftAjax.js`](http://www.asp.net/ajax/cdn/cdnajax35) (already included with SharePoint through the `asp:ScriptManager` control, contains some extensions for JavaScript including classes extensibility, inheritance, param validation, helper methods etc., more information [here](https://msdn.microsoft.com/en-us/library/bb397536%28v=vs.100%29.aspx))

`SPListRepository.js` provides base classes for working with SharePoint JavaScript client object model.   

Base classes include:   
---

###`SPListRepo.ViewScope` enumeration:
Contains scope values related to SP CAML query operations. All operations by default will be limited to one of this scopes:  

 - `FilesOnly` - Shows only files(items) in the specified folder 
 - `FoldersOnly` - Shows only folders in the specified folder 
 - `FilesFolders` - Shows all files(items) AND folders of the specified folder.
 - `FilesOnlyRecursive` - Shows only files(items) in the specified folder or any folder descending from it
 - `FoldersOnlyRecursive` - Shows only folders in the specified folder or any folder descending from it
 - `FilesFoldersRecursive` - Shows all files(items) AND folders in the specified folder or any folder descending from it 

###`SPListRepo.QuerySettings` class: 
##### Constructor: `QuerySettings(viewScope, viewFields, rowLimit)`:
 - `viewScope` - optional, `SPListRepo.ViewScope` enumeration value, default is `FilesFolders`
 - `viewFields` - optional, string array of field names to include in SPQuery, corresponds to `ViewFields` SPQuery element
 - `rowLimit` - optional, RowLimit SPQuery parameter

### `SPListRepo.ListRepository` class:
#####Constructor: `constructor(listUrlOrId: string|SP.Guid, listItemConstructor: IBaseItemConstruct<T>)`
- `listUrlOrId` - required, list relative url, for example `Lists/News` or list id
- `listItemConstructor` - required, constructor function for item object (see samples below)

#####Property: `folder`
When folder property is instantiated, then all CAML query-related operation on list will be relative to this folder. For subfolders use `RootFolderName/SubFolderName`. Corresponds to `folderServerRelativeUrl` property on `SP.CamlQuery` object. 
#####Method: `getItems(querySettings?: QuerySettings): JQueryPromise<T[]>`
Returns all items using specified query settings. 

- `querySettings` - optional, `SPListRepo.QuerySettings` object

#####Method: `getItemById(id: number): JQueryPromise<T>`
Returns item by its Id. 

- `id` - required number, Id of the item

#####Method: `getItemsByIds(ids: number[], querySettings?: QuerySettings): JQueryPromise<T[]>`
Returns items by their Ids.  
- `ids` - required, array of items' Ids  
- `querySettings` - optional, `SPListRepo.QuerySettings` object  

#####Method: `getItemsByTitle(title: string, querySettings?: QuerySettings): JQueryPromise<T[]>`
Returns items by title.  
- `title` - required, title field value  
- `querySettings` - optional, `SPListRepo.QuerySettings` object  

#####Method: `getItemsInsideFolders(folderNames: string[], querySettings?: QuerySettings): JQueryPromise<T[]>`
Returns items inside specified folders.
- `folderNames` - required, string array of folder names, for sub folders use `RootFolderName/Subfolder`
- `querySettings` - optional, `SPListRepo.QuerySettings` object  

#####Method: `getLastAddedItem(viewFields?: string[], recursive: boolean = false): JQueryPromise<T>`
Returns last added item. Depending on `querySettings` and `folder` property may return item from the entire list or from the specified folder.  

- `viewFields` - optional, string array of view fields for the CamlQuery
- `recursive` - optional, default `false`, to look into subfolders or not  

#####Method: `getLastModifiedItem(viewFields?: string[], recursive: boolean = false): JQueryPromise<T>`
Returns last modified item. Depending on querySettings and folder property may return item from the entire list or from the specified folder.  

- `viewFields` - optional, string array of view fields for the CamlQuery
- `recursive` - optional, default `false`, to look into subfolders or not 

#####Method: `saveItem(model: T) : JQueryPromise<T>`
Saves item in SharePoint. If model.id is specified item will be updated, otherwise item will be added.  

 - `model` - required, object that was created using `listItemConstructor` constructor function that you specified for list repository constructor  
 
#####Method: `deleteItem(model: T) : JQueryPromise<T>` 
Deletes item. 

 - `model` - required, object that was created using `listItemConstructor` constructor function that you specified for list repository constructor   

#####Method: `createFolder(folderName: string): JQueryPromise<T>`
Creates folder.  

 - `folderName` - required, string name. For sub folder use `RootFolderName/SubFolder` (`RootFolderName` should exists)

#####Method: `createFile(url: string, content: string, overwrite: boolean): JQueryPromise<SP.File>`
Creates file. If you want to save a file inside folder, you should provide `folder` property for list repository object (for example `folder = "MyFolder"`), otherwise it will be saved in a root folder of the list.  

- `url` - required, file url. Urls as `my/file.txt` are not allowed. Valid urls are actually file names, i.e. `file.txt`
- `content` - required, string file content
- `overwrite` - required bool, should we overwrite the existing file

Sample using
---

For generating your model classes you can use [Model Generator](https://github.com/s-KaiNet/SPListRepository.js/tree/master/generator/SPListRepository.Generator). It uses T4 to generate your typescript model classes from SharePoint using config `sp.list.repository.config.json`. It works for both SharePoint Online and on premise.
Config file format for generator:   

```json
{
	"siteUrl": "http://sp2013dev/sites/dev",
	"namespace": "MyApp",
	"creds": {
		"username": "sp\\administrator",
		"password": "QazWsx123"
	},
	"lists": {
		"all": true,
		"excludeHidden": true
		"include": ["Lists/TestCategories", "TestLIb"],
		"exclude": ["Lists/MyList"]
	},
	"fields": {
		"all": true,
		"excludeHidden": true,
		"include": ["Field1", "Field2"],
		"exclude": ["Field2"]
	}
}

```  
  
 - `siteUrl` - your site collection url where lists are located
 - `namespace` - namespace for your app
 - `creds` - credentials 
 - `lists` - lists node (you can provide excursively `include` or combination of `all`, `excludeHidden` and `exclude`): 
	 - `all` - will generate classes for all lists under siteUrl
	 - `excludeHidden` - will ignore hidden lists
	 - `exclude` - will ignore lists by leaf url
	 - `include` - only this lists will be included

 - `fields` - fields node (you can provide excursively `include` or combination of `all`, `excludeHidden` and `exclude`): 
	 - `all` - will generate properties for all fields for the list
	 - `excludeHidden` - will ignore hidden fields
	 - `exclude` - will ignore this fields
	 - `include` - only this fileds as properties will be included   


Samples:   
---  

You can explore `spec.ts` file for sample using.   
Sample model class generated by TestCategories list: 

```javascript  
namespace MyApp{
	export class TestCategoriesBaseItem extends SPListRepo.BaseListItem{
		contentType: string;
		_UIVersionString: string;
		edit: string;
		linkTitleNoMenu: string;
		linkTitle: string;
		docIcon: string;
		itemChildCount: SP.FieldLookupValue;
		folderChildCount: SP.FieldLookupValue;
		appAuthor: SP.FieldLookupValue;
		appEditor: SP.FieldLookupValue;
		constructor(item?: SP.ListItem){
			super(item);
			if(item){
				this.mapFromListItem(item);
			}
		}

		mapFromListItem(item: SP.ListItem): void{
			super.mapFromListItem(item);

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
		}

		mapToListItem(item: SP.ListItem): void{
			super.mapToListItem(item);

		}
	}
}
```   
and repository:   
```javascript  
class TestCategoryRepo extends SPListRepo.ListRepository<MyApp.TestCategoriesBaseItem>{
	constructor();
	constructor(id?: SP.Guid){
		if(id){
			super(id, MyApp.TestCategoriesBaseItem);
		} else{
			super("Lists/TestCategories", MyApp.TestCategoriesBaseItem)
		}
	}
}
```  

Get items from TestCategories list with title `'MyCategory'`: 

```javascript  
var testCategoryRepo = new TestCategoryRepo();
testLibRepo.getItemsByTitle("doc1").done(items => {
	//do actions with items which are instances of TestCategoriesBaseItem
	
})
```  

You can extend `TestCategoryRepo` with any methods you need using base method from `ListRepository`. 