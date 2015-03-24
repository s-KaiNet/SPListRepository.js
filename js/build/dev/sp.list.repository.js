Type.registerNamespace("SPListRepo");

SPListRepo.Helpers =
(function ($) {
	"use strict";
	return {
		ensureTrailingSlash: function (url) {
			if(!url.endsWith("/")){
				return url + "/";
			}
			
			return url;
		},
		ensureLeadingSlash: function(url){
			if(!url.startsWith("/")){
				return "/" + url;
			}
			
			return url;
		}
	};
})(jQuery);
(function(){"use strict";window.SPListRepo.isDebug = 1; })();
SPListRepo.Logger =
(function (window) {
	"use strict";
	return {
		log: function(data){
			if(window.SPListRepo.isDebug){
				console.log(data);
			}
		}
	};
})(window);
Type.registerNamespace("SPListRepo.Fields");
Type.registerNamespace("SPListRepo.ErrorCodes");

(function(SPListRepo){
	"use strict";
	
	SPListRepo.ErrorCodes.FolderAlreadyExists = -2130245363;
	SPListRepo.ErrorCodes.IllegalName = -2130575245;


	SPListRepo.Fields.Modified = "Modified";
	SPListRepo.Fields.Created = "Created";
	SPListRepo.Fields.ModifiedBy = "Editor";
	SPListRepo.Fields.CreatedBy = "Author";
	SPListRepo.Fields.ID = "ID";
	SPListRepo.Fields.FSObjType = "FSObjType";
	SPListRepo.Fields.Title = "Title";
	SPListRepo.Fields.FileLeafRef = "FileLeafRef";
	SPListRepo.Fields.FileDirRef = "FileDirRef";
	SPListRepo.Fields.ContentTypeId = "ContentTypeId";	
})(SPListRepo);
SPListRepo.RequestError = (function(){
	"use strict";
	
	function RequestError(error) {
		if (error instanceof SP.ClientRequestFailedEventArgs) {
			this.stackTrace = error.get_stackTrace();
			this.message = error.get_message();
			this.correlation = error.get_errorTraceCorrelationId();
			this.errorCode = error.get_errorCode();
			this.details = error.get_errorDetails();
			this.errorType = error.get_errorTypeName();
		} else if (typeof error == "string") {
			this.message = error;
		}
	}
	
	return RequestError;
})();

SPListRepo.RequestError.registerClass("SPListRepo.RequestError");
SPListRepo.ListService =
(function ($) {
	"use strict";
	
	var listsPool = {};

	return {
		getListByUrl: function (listUrl) {
		
			if(listsPool[listUrl]){
				return listsPool[listUrl];
			}
			
			var loadDeferred = $.Deferred();
			listsPool[listUrl] = loadDeferred;
			
			var webAbsoluteUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webAbsoluteUrl);
			var webServerRelativeUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webServerRelativeUrl);
			var url = String.format("{0}_api/web/lists/?$expand=RootFolder&$filter=RootFolder/ServerRelativeUrl eq '{1}{2}'&$select=ID", webAbsoluteUrl, webServerRelativeUrl, listUrl);

			$.ajax({
				url: url, 
				type: "GET",
				contentType: "application/json;odata=verbose",
				headers:{
					"Accept": "application/json;odata=verbose"
				},
				success: function(data){
					var context = SP.ClientContext.get_current();
					var list = context.get_web().get_lists().getById(data.d.results[0].Id);
					context.load(list);
					context.executeQueryAsync(function(){
						listsPool[listUrl] = list;
						loadDeferred.resolve(list);
					}, function(sender, error){
						loadDeferred.reject(new SPListRepo.RequestError(error));
					});
				},
				error: function(jqXHR, textStatus){
					loadDeferred.reject(new SPListRepo.RequestError(textStatus));
				}
			});

			return loadDeferred.promise();
		}
	};
})(jQuery);
//https://msdn.microsoft.com/en-us/library/dd923822%28v=office.12%29.aspx

SPListRepo.ViewScope = function(){};
SPListRepo.ViewScope.prototype = {	
	//specified folder - folder that you specified in 'folder' parameter for the repository. If not specified, root folder used.	
	
	FilesOnly: 0, 				//Shows only the files(items) in the specified folder 
	FoldersOnly: 1, 			//Shows only the folders in the specified folder 
	FilesFolders: 2, 			//Shows only the files(items) AND subfolders of the specified folder.
	FilesOnlyRecursive: 3, 		//Shows all files(items) in the specified folder or any folder descending from it
	FoldersOnlyRecursive: 4,	//Shows all folders in the specified folder or any folder descending from it
	FilesFoldersRecursive: 5	//Shows all files(items) AND folders in the specified folder or any folder descending from it
};

SPListRepo.ViewScope.registerEnum("SPListRepo.ViewScope", false);
SPListRepo.QuerySettings = (function(){
	"use strict";
	
	function QuerySettings(viewScope, viewFields, rowLimit) {
		var e = Function.validateParameters(arguments, [
				{ name: "viewScope", type: SPListRepo.ViewScope, optional: true },
				{ name: "viewFields", type: Array, elementType: String, optional: true },
				{ name: "rowLimit", type: Number, optional: true }
			], true);
			
			if (e) throw e;
			
			this.viewScope = viewScope;
			this.viewFields = viewFields;
			this.rowLimit = rowLimit;
	}
	
	return QuerySettings;
})();

SPListRepo.QuerySettings.registerClass("SPListRepo.QuerySettings");
SPListRepo.BaseListItem =
(function(){
	"use strict";
	
	function BaseListItem(item) {
		var e = Function.validateParameters(arguments, [
			{ name: "item", type: SP.ListItem }
		], true);

		if (e) throw e;

		this.item = item;
		this.id = item.get_id();
		this.created = this.getFieldValue(SPListRepo.Fields.Created);
		this.createdBy = this.getFieldValue(SPListRepo.Fields.CreatedBy);
		this.modified = this.getFieldValue(SPListRepo.Fields.Modified);
		this.modifiedBy = this.getFieldValue(SPListRepo.Fields.ModifiedBy);
		this.title = this.getFieldValue(SPListRepo.Fields.Title);
		this.fileDirRef = this.getFieldValue(SPListRepo.Fields.FileDirRef);
		this.fileSystemObjectType = this.item.get_fileSystemObjectType();
	}
	
	BaseListItem.prototype.getFieldValue = function(name){
		var value = this.item.get_fieldValues()[name];
		
		if(typeof value !== "undefined"){
			return this.item.get_item(name);
		}
		
		return undefined;
	}
	
	return BaseListItem;
})();

SPListRepo.BaseListItem.registerClass("SPListRepo.BaseListItem");
SPListRepo.ListRepository = 
(function($){
	"use strict";
	
	function ListRepository(listUrl, listItemConstructor) {
		var e = Function.validateParameters(arguments, [
			{ name: "listUrl", type: String },
			{ name: "listItemConstructor", type: Function }
		], true);

		if (e) throw e;

		this._listUrl = listUrl;
		this._listItemConstructor = listItemConstructor;

		this._context = SP.ClientContext.get_current();
		this._loadListDeffered = SPListRepo.ListService.getListByUrl(this._listUrl);
		this._loadListDeffered.done(Function.createDelegate(this, function (list) {
			this._list = list;
		}));

		this.folder = null;
	}

	ListRepository.prototype = {
		getItems: function (querySettings) {
			var e = Function.validateParameters(arguments, [
				{ name: "querySettings", type: SPListRepo.QuerySettings, optional: true }
			], true);
			
			if (e) throw e;
			
			return this._getItemsByExpression(null, querySettings);
		},
		
		getItemById: function (id) {
			var e = Function.validateParameters(arguments, [
				{ name: "id", type: Number }
			], true);

			if (e) throw e;

			var deferred = this._createDeferred();

			this._loadListDeffered.done(Function.createDelegate(this, function () {
				var item = this._list.getItemById(id);
				this._context.load(item);

				var self = this;

				this._context.executeQueryAsync(function () {
					var resultItem = new self._listItemConstructor(item);
					deferred.resolve(resultItem);
				}, function (sender, error) {
					deferred.reject(new SPListRepo.RequestError(error));
				});
			}));

			return deferred.promise();
		},

		getItemsByIds: function(ids, querySettings) {
			var e = Function.validateParameters(arguments, [
					{ name: "ids", type: Array, elementType: Number },
					{ name: "querySettings", type: SPListRepo.QuerySettings, optional: true }
			]);

			if (e) throw e;

			var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).In(ids);

			return this._getItemsByExpression(camlExpression, querySettings);
		},

		getItemsInsideFolders: function(folderNames, querySettings) {
			var e = Function.validateParameters(arguments, [
					{ name: "folderNames", type: Array, elementType: String },
					{ name: "querySettings", type: SPListRepo.QuerySettings, optional: true }
			]);

			if (e) throw e;

			var self = this;
			
			var camlExpression = CamlBuilder.Expression().TextField(SPListRepo.Fields.FileDirRef).In(folderNames.map(function(folderName) {
				var folderRelUrl = self._getFolderRelativeUrl(folderName);
				if (folderRelUrl.startsWith("/")) {
					folderRelUrl = folderRelUrl.substring(1);
				}

				return folderRelUrl;
			}));

			return this._getItemsByExpression(camlExpression, querySettings);
		},

		getLastAddedItem: function (querySettings) {
			var e = Function.validateParameters(arguments, [
					{ name: "querySettings", type: SPListRepo.QuerySettings, optional: true }
			]);

			if (e) throw e;
			
			var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).NotEqualTo(0);			
			
			querySettings = querySettings || new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders);
			querySettings.rowLimit = 1;
			
			var query = this._getSPCamlQuery(this._getViewQuery(camlExpression, querySettings).OrderByDesc(SPListRepo.Fields.ID));

			return this._getItemsBySPCamlQuery(query);
		},
		
		getLastModifiedItem(querySettings){
			var e = Function.validateParameters(arguments, [
					{ name: "querySettings", type: SPListRepo.QuerySettings, optional: true }
			]);

			if (e) throw e;
			
			var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).NotEqualTo(0);			
			
			querySettings = querySettings || new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders);
			querySettings.rowLimit = 1;
			
			var query = this._getSPCamlQuery(this._getViewQuery(camlExpression, querySettings).OrderByDesc(SPListRepo.Fields.Modified));

			return this._getItemsBySPCamlQuery(query);
		},
		
		saveItem: function (model) {
			var e = Function.validateParameters(arguments, [
				{ name: "model", type: this._listItemConstructor }
			], true);

			if (e) throw e;

			if (!model.id || model.id < 1) {
				return this._addItem(model);
			}

			return this._updateItem(model);
		},

		deleteItem: function (model) {
			var e = Function.validateParameters(arguments, [
				{ name: "model", type: this._listItemConstructor }
			], true);

			if (e) throw e;

			var deferred = this._createDeferred();

			this._loadListDeffered.done(Function.createDelegate(this, function () {
				var item = this._list.getItemById(model.id);
				this._context.load(item);

				item.deleteObject();

				this._context.executeQueryAsync(function () {
					deferred.resolve();
				}, function (sender, error) {
					deferred.reject(new SPListRepo.RequestError(error));
				});
			}));

			return deferred.promise();
		},

		createFolder: function (folderName) {
			var e = Function.validateParameters(arguments, [
				{ name: "folderName", type: String }
			], true);

			if (e) throw e;

			var deferred = this._createDeferred();

			this._loadListDeffered.done(Function.createDelegate(this, function () {
				var folder = new SP.ListItemCreationInformation();
				folder.set_underlyingObjectType(SP.FileSystemObjectType.folder);
				folder.set_leafName(folderName);
				var folderItem = this._list.addItem(folder);
				folderItem.set_item("Title", folderName);
				folderItem.update();
				this._context.load(folderItem);
				this._context.executeQueryAsync(function () {
					deferred.resolve(folderItem);
				}, function (sender, error) {
					deferred.reject(new SPListRepo.RequestError(error));
				});
			}));

			return deferred.promise();
		},

		_createDeferred: function () {
			return $.Deferred();
		},

		_addItem: function (model) {
			var e = Function.validateParameters(arguments, [
				{ name: "model", type: this._listItemConstructor }
			], true);

			if (e) throw e;

			var deferred = this._createDeferred();

			this._loadListDeffered.done(Function.createDelegate(this, function () {
				var itemCreateInfo = new SP.ListItemCreationInformation();
				if (this.folder) {
					itemCreateInfo.set_folderUrl(this._getFolderRelativeUrl());
				}
				var newItem = this._list.addItem(itemCreateInfo);

				this._setFieldValues(newItem, model);
				var self = this;

				newItem.update();
				this._context.load(newItem);

				this._context.executeQueryAsync(function () {
					var resultItem = new self._listItemConstructor(newItem);
					deferred.resolve(resultItem);
				}, function (sender, error) {
					deferred.reject(new SPListRepo.RequestError(error)); 
				});
			}));

			return deferred.promise();
		},

		_updateItem: function (model) {
			var e = Function.validateParameters(arguments, [
				{ name: "model", type: this._listItemConstructor }
			], true);

			if (e) throw e;

			var deferred = this._createDeferred();

			this._loadListDeffered.done(Function.createDelegate(this, function () {
				var item = this._list.getItemById(model.id);
				this._context.load(item);

				this._setFieldValues(item, model);
				var self = this;

				item.update();

				this._context.executeQueryAsync(function () {
					var resultItem = new self._listItemConstructor(item);
					deferred.resolve(resultItem);
				}, function (sender, args) {
					deferred.reject(new SPListRepo.RequestError(args));
				});
			}));

			return deferred.promise();
		},

		_setFieldValues: function (item, model) {
			item.set_item(SPListRepo.Fields.Title, model.title);
			if (model.fileLeafRef) {
				item.set_item(SPListRepo.Fields.FileLeafRef, model.fileLeafRef);
			}
		},

		_getFolderRelativeUrl: function (folderName) {
			var folder = folderName || this.folder;
			var webRelativeUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webServerRelativeUrl);

			return String.format("{0}{1}/{2}", webRelativeUrl, this._listUrl, folder);
		},

		//NOTE: camlExpression - all that can lay out inside <Where></Where> tags in CAML query. For example <OrderBy> is not allowed, because it is outside the <Where>
		_getItemsByExpression: function (camlExpression, querySettings) {

			var deferred = this._createDeferred();
			querySettings = querySettings || new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders);
			
			var camlQuery = this._getSPCamlQuery(this._getViewQuery(camlExpression, querySettings));
			
			return this._getItemsBySPCamlQuery(camlQuery);
		},
		
		_getItemsBySPCamlQuery: function(spCamlQuery) {
			
			var deferred = this._createDeferred();
			this._loadListDeffered.done(Function.createDelegate(this, function () {
				if (this.folder) {
					spCamlQuery.set_folderServerRelativeUrl(this._getFolderRelativeUrl());
				}
				var items = this._list.getItems(spCamlQuery);
				this._context.load(items);

				var self = this;

				this._context.executeQueryAsync(function () {
					var itemsEnumerator = items.getEnumerator();
					var resultItemList = [];

					while (itemsEnumerator.moveNext()) {
						resultItemList.push(new self._listItemConstructor(itemsEnumerator.get_current()));
					}
					
					SPListRepo.Logger.log(String.format("Getting results ({0}):", resultItemList.length));
					SPListRepo.Logger.log(resultItemList);
					deferred.resolve(resultItemList);

				}, function (sender, args) {
					deferred.reject(new SPListRepo.RequestError(args));
				});
			}));

			return deferred.promise();
		},

		_getItemByExpression: function (camlExpression, querySettings) {

			var deferred = this._createDeferred();

			this._getItemsByExpression(camlExpression, querySettings)
			.done(function(items){
				if (items.length > 1) throw "Result contains more than one element";
				
				deferred.resolve(items.length === 1 ? items[0] : null);

			})
			.fail(function(err){
				deferred.reject(err);
			});
			
			return deferred.promise();
		},
		
		_getViewQuery: function(camlExpression, querySettings){

			var deferred = this._createDeferred();
			var camlQuery;
			var viewQuery = new CamlBuilder().View(querySettings.viewFields);
			
			if(querySettings.rowLimit){
				viewQuery = viewQuery.RowLimit(querySettings.rowLimit);
			}
			var foldersOnlyExpression = CamlBuilder.Expression().IntegerField(SPListRepo.Fields.FSObjType).EqualTo(1);
			switch (querySettings.viewScope)
			{
				case SPListRepo.ViewScope.FilesOnly: 
					viewQuery = viewQuery.Scope(CamlBuilder.ViewScope.FilesOnly);
					break;
				case SPListRepo.ViewScope.FoldersOnly: 
				case SPListRepo.ViewScope.FilesFolders: 
					break;
				case SPListRepo.ViewScope.FilesOnlyRecursive: 
					viewQuery = viewQuery.Scope(CamlBuilder.ViewScope.Recursive);
					break;
				case SPListRepo.ViewScope.FoldersOnlyRecursive: 
				case SPListRepo.ViewScope.FilesFoldersRecursive: 
					viewQuery = viewQuery.Scope(CamlBuilder.ViewScope.RecursiveAll);
					break;
				default: 
					viewQuery = viewQuery.Scope(CamlBuilder.ViewScope.RecursiveAll);
					break;
			}
			
			if(querySettings.viewScope === SPListRepo.ViewScope.FoldersOnly || querySettings.viewScope === SPListRepo.ViewScope.FoldersOnlyRecursive){
				if(camlExpression){
					camlQuery = viewQuery.Query().Where().All(camlExpression, foldersOnlyExpression);
				} else {
					camlQuery = viewQuery.Query().Where().All(foldersOnlyExpression);
				}
			}
			else{
				if(camlExpression){
					camlQuery = viewQuery.Query().Where().All(camlExpression);
				} else {
					camlQuery = viewQuery.Query().Where().All();
				}
			}			
				
			return camlQuery;
		},
		
		_getSPCamlQuery: function(viewXmlObject){
			var viewQuery = viewXmlObject.ToString();
			SPListRepo.Logger.log("Running query:");
			SPListRepo.Logger.log(viewQuery);
			var query = new SP.CamlQuery();
			query.set_viewXml(viewQuery);			
			return query;
		}
	};
	
	return ListRepository;
})(jQuery);

SPListRepo.ListRepository.registerClass("SPListRepo.ListRepository");