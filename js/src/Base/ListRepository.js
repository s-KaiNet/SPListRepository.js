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
		this._loadListDeferred = SPListRepo.ListService.getListByUrl(this._listUrl);
		this._loadListDeferred.done(Function.createDelegate(this, function (list) {
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

			return this._withPromise(function(deferred) {
				
				var item = this._list.getItemById(id);
				this._context.load(item);

				var self = this;

				this._context.executeQueryAsync(function () {
					var resultItem = new self._listItemConstructor(item);
					deferred.resolve(resultItem);
				}, function (sender, error) {
					deferred.reject(new SPListRepo.RequestError(error));
				});
			});
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
		
		getLastModifiedItem: function(querySettings) {
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

			return this._withPromise(function(deferred) {
				
				var item = this._list.getItemById(model.id);
				this._context.load(item);

				item.deleteObject();

				this._context.executeQueryAsync(function () {
					deferred.resolve();
				}, function (sender, error) {
					deferred.reject(new SPListRepo.RequestError(error));
				});
			});
		},

		createFolder: function (folderName) {
			var e = Function.validateParameters(arguments, [
				{ name: "folderName", type: String }
			], true);

			if (e) throw e;
			
			return this._withPromise(function(deferred) {
				
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
			});
		},
		
		createFile: function(url, content, overwrite){
			var e = Function.validateParameters(arguments, [
				{ name: "url", type: String },
				{ name: "content", type: String },
				{ name: "overwrite", type: Boolean }
			], true);

			if (e) throw e;			
			
			return this._withPromise(function(deferred){
				
				var fileCreateInfo = new SP.FileCreationInformation();
				
				fileCreateInfo.set_url(url);
				fileCreateInfo.set_overwrite(overwrite);
				fileCreateInfo.set_content(new SP.Base64EncodedByteArray());

				for (var i = 0; i < content.length; i++) {

					fileCreateInfo.get_content().append(content.charCodeAt(i));
				}
				
				var newFile = this._context.get_web().getFolderByServerRelativeUrl(this._getFolderRelativeUrl()).get_files().add(fileCreateInfo);
				this._context.load(newFile);
				
				this._context.executeQueryAsync(function () {
					deferred.resolve(newFile);
				}, function (sender, error) {
					deferred.reject(new SPListRepo.RequestError(error));
				});
			});
		},
		
		_createDeferred: function () {
			return $.Deferred();
		},
		
		_withPromise: function(callback){
			var deferred = this._createDeferred();
			var self = this;
			this._loadListDeferred.done(Function.createDelegate(this, function () {				
				callback.apply(this, [deferred]);
			}));				
			
			return deferred.promise();
		},
		
		_addItem: function (model) {
			var e = Function.validateParameters(arguments, [
				{ name: "model", type: this._listItemConstructor }
			], true);

			if (e) throw e;
			
			return this._withPromise(function(deferred) {
			
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
			});
		},

		_updateItem: function (model) {
			var e = Function.validateParameters(arguments, [
				{ name: "model", type: this._listItemConstructor }
			], true);

			if (e) throw e;
			
			return this._withPromise(function(deferred) {
				
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
			});
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
			return this._withPromise(function(deferred) {
				
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
			});
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