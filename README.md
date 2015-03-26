# SPListRepository.js
Repository pattern implementation for convenient list data access thought the SharePoint JavaScript client object model.  

Main file is `js\build\release\sp.list.repository.min.js `

How to run\build:   
1. Clone the repository  
2. Run `grunt release` for release or `grunt dev` for development.

Currently project has following dependencies:   

- [`jQuery`](https://github.com/jquery/jquery) (promises) 
- [`camljs`](https://camljs.codeplex.com/) (convenient CAML queries construction) 
- [`MicrosoftAjax.js`](http://www.asp.net/ajax/cdn/cdnajax35) (already included with SharePoint through the `asp:ScriptManager` control, contains some extensions for JavaScript including classes extensibility, inheritance, param validation, helper methods etc., more information [here](https://msdn.microsoft.com/en-us/library/bb397536%28v=vs.100%29.aspx))

`SPListRepository.js` provides base classes for working with SharePoint JavaScript client object model.   

Base classes include: 

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
#####Constructor: `ListRepository(listUrl, listItemConstructor)`
- `listUrl` - required, list relative url, for example `Lists/News`
- `listItemConstructor` - required, constructor function for item object  

#####Property: `folder`
When folder property is instantiated, then all CAML query-related operation on list will be relateive to this folder. For subfolders use `RootFolderName/SubFolderName`. Corresponds to `folderServerRelativeUrl` property on `SP.CamlQuery` object. 
#####Method: `getItems(querySettings)`
Returns all items using specified query settings. 

- `querySettings` - optional, `SPListRepo.QuerySettings` object

#####Method: `getItemById(id)`
Returns item by its Id. 

- `id` - required number, Id of the item

#####Method: `getItemsByIds(ids, querySettings) `
Returns items by their Ids.  


- `ids` - required, array of items' Ids  
- `querySettings` - optional, `SPListRepo.QuerySettings` object  

#####Method: `getItemsInsideFolders(folderNames, querySettings)`
Returns items inside specified folders.
- `folderNames` - required, string array of folder names, for sub folders use `RootFolderName/Subfolder`
- `querySettings` - optional, `SPListRepo.QuerySettings` object  

#####Method: `getLastAddedItem(querySettings)`
Returns last added item. Depending on `querySettings` and `folder` property may return item from the entire list or from the specified folder.  

- `querySettings` - optional, `SPListRepo.QuerySettings` object  

#####Method: `getLastModifiedItem(querySettings)`
Returns last modified item. Depending on querySettings and folder property may return item from the entire list or from the specified folder.  

- `querySettings` - optional, `SPListRepo.QuerySettings` object 

#####Method: `saveItem(model)`
Saves item in SharePoint. If model.id is specified item will be updated, otherwise item will be added.  

 - `model` - required, object that was created using `listItemConstructor` constructor function that you specified for list repository constructor  
 
#####Method: `deleteItem(model) ` 
Deletes item. 

 - `model` - required, object that was created using `listItemConstructor` constructor function that you specified for list repository constructor   

#####Method: `createFolder(folderName)`
Creates folder.  

 - `folderName` - required, string name. For sub folder use `RootFolderName/SubFolder` (`RootFolderName` should exists)


##Sample using

For example you have a News list (`Lists/News` url). The list contains following fields:   

 - `Title`, text
 - `Body`, rich text
 - `Category`, lookup
 - `Published`, date
 - `Original_x0020_Source`, url

List structure:   

 - Root folders - names of the years, i.e. 2014, 2015, ...
 - Sub folders - month names, January, February, March, ...
 - news for March, 2015 are inside 2015/March folder

You need to query top 5 news for March, 2015 using `SPListRepository.js.`  

1) Create class that will represent your news item and inherit it from `SPListRepo.BaseListItem`:   

```javascript
var MyApp = MyApp || {};

MyApp.NewsListItem = 
(function(){
	"use strict";
	
	function NewsListItem(item) {
		if (item) {
			NewsListItem.initializeBase(this, [item]);
	
			this.body = this.getFieldValue("Body");
			this.category = this.getFieldValue("Category");
			this.published = this.getFieldValue("Published");
			this.originalSource = this.getFieldValue("Original_x0020_Source");
		}
	}
	
	return NewsListItem;
})();

MyApp.NewsListItem.registerClass("MyApp.NewsListItem", SPListRepo.BaseListItem);

```  

`item` parameter is SP.ListItem object, it is optional  

```javascript
NewsListItem.initializeBase(this, [item]);
```
Call base method in order to initialize some base properties like `title`, `created`, `modified` and others.  
   
```javascript
this.body = this.getFieldValue("Body");
```
Initialize other fields specific to your list.   

```javascript
MyApp.NewsListItem.registerClass("MyApp.NewsListItem", SPListRepo.BaseListItem);
```

Register class and inherit it from the base `SPListRepo.BaseListItem`  

 2) Create NewsRepository inherited from `SPListRepo.ListRepository`. Add required methods to your repository.   


```javascript
MyApp.NewsRepository = 
(function(){
	"use strict";
	
	function NewsRepository(listUrl) {
	    NewsRepository.initializeBase(this, [listUrl, MyApp.NewsListItem]);
	}
	
	NewsRepository.prototype = {
	    _setFieldValues: function (item, model) {
	        NewsRepository.callBaseMethod(this, "_setFieldValues", [item, model]);
	
	        item.set_item("Body", model.body);
	        item.set_item("Category", model.category);
			item.set_item("Published", model.published);
			item.set_item("Original_x0020_Source", model.originalSource);
	    },
	
	    getRecentNewsByCategory: function (categoryId, querySettings) {
	        var camlExpression = CamlBuilder.Expression().LookupField("Category").Id().EqualTo(categoryId);
	        
	        var viewQuery = this._getViewQuery(camlExpression, querySettings);
	        var query = this._getSPCamlQuery(viewQuery.OrderByDesc(SPListRepo.Fields.Modified));

			return this._getItemsBySPCamlQuery(query);
	    },
	};
	
	return NewsRepository;
})();


MyApp.NewsRepository.registerClass("MyApp.NewsRepository", SPListRepo.ListRepository);

```   

```javascript
NewsRepository.initializeBase(this, [listUrl, MyApp.NewsListItem]);
```
Call base constructor and pass list item constrution function to it.  

```javascript
_setFieldValues: function (item, model) {
    NewsRepository.callBaseMethod(this, "_setFieldValues", [item, model]);

    item.set_item("Body", model.body);
	.....
},

```  
This method overload is required if you are going to save your items. In this method you should provide mapping between your model (`MyApp.NewsListItem` object) and `SP.ListItem` object.   

```javascript
getRecentNewsByCategory: function (categoryId, querySettings)
```
Methods that returns news by `categoryId` and depending on `querySettings`.  

```javascript
MyApp.NewsRepository.registerClass("MyApp.NewsRepository", SPListRepo.ListRepository);
```   
Register repository class inherited from `SPListRepo.ListRepository`.   
####Using: 
Create repository:  

```javascript
var newsRepository = new MyApp.NewsRepository("Lists/News");  

```    

Get top 5 news from March: 

```javascript
newsRepository.folder = "2015/March";
newsRepository.getRecentNewsByCategory(2, new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly, ["Title", "Body", "Category"], 5)).done(function(newsItems){
//work with newsItems - instanses of MyApp.NewsListItem
});
```  

Get top 20 news from 2015:  

```javascript
newsRepository.folder = "2015";
newsRepository.getRecentNewsByCategory(2, new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnlyRecursive, ["Title", "Body", "Category"], 20))
``` 


Save and delete item:  

```javascript
var newItem = new MyApp.NewsListItem();
newItem.category = new SP.FieldLookupValue();
newItem.category.set_lookupId(1);
newItem.body = "<h2>Breaking News!!!</h2>";
newItem.Published = new Date();
newItem.originalSource = new SP.FieldUrlValue();
newItem.originalSource.set_url("http://some.cool.site.com");
newItem.originalSource.set_description("test link");

newsRepository.saveItem(newItem).done(function(savedItem){
	console.log("item saved:");
	console.log(savedItem);
	console.log("Item id: " + savedItem.id);
	newsRepository.deleteItem(savedItem).done(function(){
		console.log("Deleted!");
	});
});

```    

