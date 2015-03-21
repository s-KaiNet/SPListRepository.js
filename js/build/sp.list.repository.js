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
			console.log(url);
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
		this.created = item.get_item(SPListRepo.Fields.Created);
		this.createdBy = item.get_item(SPListRepo.Fields.CreatedBy);
		this.modified = item.get_item(SPListRepo.Fields.Modified);
		this.modifiedBy = item.get_item(SPListRepo.Fields.ModifiedBy);
		this.title = item.get_item(SPListRepo.Fields.Title);
		this.fileDirRef = item.get_item(SPListRepo.Fields.FileDirRef);
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
		getItems: function () {
			return this._getItemsByQuery(SP.CamlQuery.createAllItemsQuery());
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
					deferred.reject(new RequestError(error));
				});
			}));

			return deferred.promise();
		},

		getItemsByIds: function(ids) {
			var e = Function.validateParameters(arguments, [
					{ name: "ids", type: Array, elementType: Number }
			]);

			if (e) throw e;

			var camlBuilder = new CamlBuilder();
			var caml = camlBuilder.Where().CounterField(SPListRepo.Fields.ID).In(ids).ToString();
			var query = new SP.CamlQuery();
			query.set_viewXml(String.format("<View>" +
												"<Query>{0}</Query>" +
											"</View>", caml));

			return this._getItemsByQuery(query);
		},

		getItemsInsideFolders: function(folderNames) {
			var e = Function.validateParameters(arguments, [
					{ name: "folderNames", type: Array, elementType: String }
			]);

			if (e) throw e;

			var self = this;
			var camlBuilder = new CamlBuilder();
			var caml = camlBuilder.Where().TextField(SPListRepo.Fields.FileDirRef).In(folderNames.map(function(folderName) {
				var folderRelUrl = self._getFolderRelativeUrl(folderName);
				if (folderRelUrl.startsWith("/")) {
					folderRelUrl = folderRelUrl.substring(1);
				}

				return folderRelUrl;
			})).ToString();
			var query = new SP.CamlQuery();
			query.set_viewXml(String.format("<View Scope=\"RecursiveAll\">" +
												"<Query>{0}</Query>" +
											"</View>", caml));

			return this._getItemsByQuery(query);
		},

		getLastAddedItem: function () {
			var camlBuilder = new CamlBuilder();
			var caml = camlBuilder.Where().CounterField(SPListRepo.Fields.ID).NotEqualTo(0).OrderByDesc(SPListRepo.Fields.ID).ToString();
			var query = new SP.CamlQuery();
			console.log(query);
			query.set_viewXml(String.format("<View>" +
												"<Query>{0}</Query>" +
												//"<RowLimit>1</RowLimit>" +
											"</View>", caml));

			return this._getItemByQuery(query);
		},

		getFolders: function () {
			var deferred = this._createDeferred();

			this._loadListDeffered.done(Function.createDelegate(this, function () {

				var camlBuilder = new CamlBuilder();
				var caml = camlBuilder.Where()
					.IntegerField(SPListRepo.Fields.FSObjType).EqualTo(1).ToString();
				var camlQuery = new SP.CamlQuery();
				camlQuery.set_viewXml(String.format("<View>" +
													"<Query>{0}</Query>" +
												"</View>", caml));

				var items = this._list.getItems(camlQuery);
				var self = this;
				this._context.load(items);
				this._context.executeQueryAsync(function () {
					var folders = [];
					var itemsEnumerator = items.getEnumerator();
					while (itemsEnumerator.moveNext()) {
						var item = itemsEnumerator.get_current();

						//FIX for Item folder - default, can't figure out how to prevent its creation
						if (item.get_item(SPListRepo.Fields.Title) === "Item") continue;

						folders.push(new self._listItemConstructor(item));
					}

					deferred.resolve(folders);
				}, function (sender, error) {
					deferred.reject(new RequestError(error));
				});
			}));

			return deferred.promise();
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
					deferred.reject(new RequestError(error));
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
					deferred.reject(new RequestError(error));
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
					deferred.reject(new RequestError(error));
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
					deferred.reject(new RequestError(args));
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

		_getItemsByQuery: function (camlQuery) {
			var e = Function.validateParameters(arguments, [
				{ name: "camlQuery", type: SP.CamlQuery }
			], true);

			if (e) throw e;

			var deferred = this._createDeferred();

			this._loadListDeffered.done(Function.createDelegate(this, function () {
				if (this.folder) {
					camlQuery.set_folderServerRelativeUrl(this._getFolderRelativeUrl());
				}
				var items = this._list.getItems(camlQuery);
				this._context.load(items);

				var self = this;

				this._context.executeQueryAsync(function () {
					var itemsEnumerator = items.getEnumerator();
					var resultItemList = [];

					while (itemsEnumerator.moveNext()) {
						resultItemList.push(new self._listItemConstructor(itemsEnumerator.get_current()));
					}
					deferred.resolve(resultItemList);

				}, function (sender, args) {
					deferred.reject(new RequestError(args));
				});
			}));

			return deferred.promise();
		},

		_getItemByQuery: function (camlQuery) {
			var e = Function.validateParameters(arguments, [
				{ name: "camlQuery", type: SP.CamlQuery }
			], true);

			if (e) throw e;

			var deferred = this._createDeferred();

			this._loadListDeffered.done(Function.createDelegate(this, function () {
				if (this.folder) {
					camlQuery.set_folderServerRelativeUrl(this._getFolderRelativeUrl());
				}
				var items = this._list.getItems(camlQuery);
				this._context.load(items);

				var self = this;

				this._context.executeQueryAsync(function () {
					var itemsEnumerator = items.getEnumerator();
					var resultItemList = [];

					while (itemsEnumerator.moveNext()) {
						resultItemList.push(new self._listItemConstructor(itemsEnumerator.get_current()));
					}
					if (resultItemList.length > 1) throw "Result contains more than one element";

					deferred.resolve(resultItemList.length === 1 ? resultItemList[0] : null);

				}, function (sender, args) {
					deferred.reject(new RequestError(args));
				});
			}));

			return deferred.promise();
		}
	};
	
	return ListRepository;
})(jQuery);

SPListRepo.ListRepository.registerClass("SPListRepo.ListRepository");