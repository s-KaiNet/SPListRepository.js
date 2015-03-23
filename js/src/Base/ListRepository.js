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
			
			return this._getItemsByQuery(null, querySettings);
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

		getItemsByIds: function(ids, querySettings) {
			var e = Function.validateParameters(arguments, [
					{ name: "ids", type: Array, elementType: Number },
					{ name: "querySettings", type: SPListRepo.QuerySettings, optional: true }
			]);

			if (e) throw e;

			var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).In(ids);

			return this._getItemsByQuery(camlExpression, querySettings);
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

			return this._getItemsByQuery(camlExpression, querySettings);
		},

		getLastAddedItem: function (querySettings) {
			var e = Function.validateParameters(arguments, [
					{ name: "querySettings", type: SPListRepo.QuerySettings, optional: true }
			]);

			if (e) throw e;
			
			var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).NotEqualTo(0).OrderByDesc(SPListRepo.Fields.ID);
			
			querySettings = querySettings || new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders);
			querySettings.rowLimit = 1;

			return this._getItemByQuery(camlExpression, querySettings);
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

		_getItemsByQuery: function (camlExpression, querySettings) {

			var deferred = this._createDeferred();
			querySettings = querySettings || new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders);
			
			var camlQuery = this._getViewQuery(camlExpression, querySettings.viewScope, querySettings.viewFields, querySettings.rowLimit);
			
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

		_getItemByQuery: function (camlExpression, querySettings) {

			var deferred = this._createDeferred();

			this._getItemsByQuery(camlExpression, querySettings)
			.done(function(items){
				if (items.length > 1) throw "Result contains more than one element";

				deferred.resolve(items.length === 1 ? items[0] : null);
			})
			.fail(function(err){
				deferred.reject(err);
			});
			
			return deferred.promise();
		},
		
		_getViewQuery: function(camlExpression, viewScope, viewFields, rowLimit){

			var deferred = this._createDeferred();
			var camlQuery;
			var viewQuery = new CamlBuilder().View(viewFields);
			
			if(rowLimit){
				viewQuery = viewQuery.RowLimit(rowLimit);
			}
			var foldersOnlyExpression = CamlBuilder.Expression().IntegerField(SPListRepo.Fields.FSObjType).EqualTo(1);
			switch (viewScope)
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
			
			if(viewScope === SPListRepo.ViewScope.FoldersOnly || viewScope === SPListRepo.ViewScope.FoldersOnlyRecursive){
				if(camlExpression){
					camlQuery = viewQuery.Query().Where().All(camlExpression, foldersOnlyExpression).ToString();
				} else {
					camlQuery = viewQuery.Query().Where().All(foldersOnlyExpression).ToString();
				}
			}
			else{
				if(camlExpression){
					camlQuery = viewQuery.Query().Where().All(camlExpression).ToString();
				} else {
					camlQuery = viewQuery.Query().Where().All().ToString();
				}
			}			
			
			console.log(camlQuery);
			var query = new SP.CamlQuery();
			query.set_viewXml(camlQuery);
			
			return query;
		}
	};
	
	return ListRepository;
})(jQuery);

SPListRepo.ListRepository.registerClass("SPListRepo.ListRepository");