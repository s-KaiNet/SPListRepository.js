/// <reference path="../typings/tsd.d.ts" />
/// <reference path="ViewScope.ts" />
/// <reference path="Constants.ts" />
/// <reference path="ListService.ts" />
/// <reference path="BaseListItem.ts" />
/// <reference path="QuerySettings.ts" />
var SPListRepo;
(function (SPListRepo) {
    var ListRepository = (function () {
        function ListRepository(listUrlOrId, listItemConstructor) {
            var _this = this;
            this._listItemConstructor = listItemConstructor;
            this._context = SP.ClientContext.get_current();
            if (listUrlOrId instanceof SP.Guid) {
                this._loadListDeferred = SPListRepo.ListService.getListById(listUrlOrId);
            }
            else if (typeof listUrlOrId === "string") {
                this._loadListDeferred = SPListRepo.ListService.getListByUrl(listUrlOrId);
            }
            this._loadListDeferred.done(function (list) {
                _this._list = list;
            })
                .fail(function (error) {
                alert(error.message);
            });
        }
        ListRepository.prototype.getItems = function (querySettings) {
            return this._getItemsByExpression(null, querySettings);
        };
        ListRepository.prototype.getItemById = function (id) {
            var _this = this;
            return this._withPromise(function (deferred) {
                var item = _this._list.getItemById(id);
                _this._context.load(item);
                _this._context.executeQueryAsync(function () {
                    var resultItem = new _this._listItemConstructor(item);
                    deferred.resolve(resultItem);
                }, function (sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        };
        ListRepository.prototype.getItemsByTitle = function (title, querySettings) {
            var camlExpression = CamlBuilder.Expression().TextField("Title").EqualTo(title);
            return this._getItemsByExpression(camlExpression, querySettings);
        };
        ListRepository.prototype.getItemsByIds = function (ids, querySettings) {
            var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).In(ids);
            return this._getItemsByExpression(camlExpression, querySettings);
        };
        ListRepository.prototype.getItemsInsideFolders = function (folderNames, querySettings) {
            var _this = this;
            var camlExpression = CamlBuilder.Expression().TextField(SPListRepo.Fields.FileDirRef).In(folderNames.map(function (folderName) {
                var folderRelUrl = _this._getFolderRelativeUrl(folderName);
                if (folderRelUrl.indexOf("/") === 0) {
                    folderRelUrl = folderRelUrl.substring(1);
                }
                return folderRelUrl;
            }));
            return this._getItemsByExpression(camlExpression, querySettings);
        };
        ListRepository.prototype.getLastAddedItem = function (viewFields, recursive) {
            if (recursive === void 0) { recursive = false; }
            var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).NotEqualTo(0);
            var querySettings;
            if (recursive) {
                querySettings = new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnlyRecursive, viewFields, 1);
            }
            else {
                querySettings = new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly, viewFields, 1);
            }
            var query = this._getSPCamlQuery(this._getViewQuery(camlExpression, querySettings).OrderByDesc(SPListRepo.Fields.ID));
            return this._getItemBySPCamlQuery(query);
        };
        ListRepository.prototype.getLastModifiedItem = function (viewFields, recursive) {
            if (recursive === void 0) { recursive = false; }
            var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).NotEqualTo(0);
            var querySettings;
            if (recursive) {
                querySettings = new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnlyRecursive, viewFields, 1);
            }
            else {
                querySettings = new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly, viewFields, 1);
            }
            var query = this._getSPCamlQuery(this._getViewQuery(camlExpression, querySettings).OrderByDesc(SPListRepo.Fields.Modified));
            return this._getItemBySPCamlQuery(query);
        };
        ListRepository.prototype.saveItem = function (model) {
            if (!model.id || model.id < 1) {
                return this._addItem(model);
            }
            return this._updateItem(model);
        };
        ListRepository.prototype.deleteItem = function (model) {
            var _this = this;
            return this._withPromise(function (deferred) {
                var item = _this._list.getItemById(model.id);
                _this._context.load(item);
                item.deleteObject();
                _this._context.executeQueryAsync(function () {
                    deferred.resolve();
                }, function (sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        };
        ListRepository.prototype.createFolder = function (folderName) {
            var _this = this;
            return this._withPromise(function (deferred) {
                var folder = new SP.ListItemCreationInformation();
                folder.set_underlyingObjectType(SP.FileSystemObjectType.folder);
                folder.set_leafName(folderName);
                var folderItem = _this._list.addItem(folder);
                folderItem.set_item("Title", folderName);
                folderItem.update();
                var self = _this;
                _this._context.load(folderItem);
                _this._context.executeQueryAsync(function () {
                    var resultItem = new self._listItemConstructor(folderItem);
                    deferred.resolve(resultItem);
                }, function (sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        };
        ListRepository.prototype.createFile = function (url, content, overwrite) {
            var _this = this;
            return this._withPromise(function (deferred) {
                var fileCreateInfo = new SP.FileCreationInformation();
                fileCreateInfo.set_url(url);
                fileCreateInfo.set_overwrite(overwrite);
                fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
                for (var i = 0; i < content.length; i++) {
                    fileCreateInfo.get_content().append(content.charCodeAt(i));
                }
                var newFile = _this._context.get_web().getFolderByServerRelativeUrl(_this._getFolderRelativeUrl()).get_files().add(fileCreateInfo);
                _this._context.load(newFile);
                _this._context.executeQueryAsync(function () {
                    deferred.resolve(newFile);
                }, function (sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        };
        ListRepository.prototype._getItemBySPCamlQuery = function (spCamlQuery) {
            var deferred = this._createDeferred();
            this._getItemsBySPCamlQuery(spCamlQuery)
                .done(function (items) {
                if (items.length > 1)
                    throw "Result contains more than one element";
                deferred.resolve(items.length === 1 ? items[0] : null);
            })
                .fail(function (err) {
                deferred.reject(err);
            });
            return deferred.promise();
        };
        ListRepository.prototype._addItem = function (model) {
            var _this = this;
            return this._withPromise(function (deferred) {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                if (_this.folder) {
                    itemCreateInfo.set_folderUrl(_this._getFolderRelativeUrl());
                }
                var newItem = _this._list.addItem(itemCreateInfo);
                model.mapToListItem(newItem);
                var self = _this;
                newItem.update();
                _this._context.load(newItem);
                _this._context.executeQueryAsync(function () {
                    var resultItem = new self._listItemConstructor(newItem);
                    deferred.resolve(resultItem);
                }, function (sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        };
        ListRepository.prototype._updateItem = function (model) {
            var _this = this;
            return this._withPromise(function (deferred) {
                var item = _this._list.getItemById(model.id);
                _this._context.load(item);
                model.mapToListItem(item);
                var self = _this;
                item.update();
                _this._context.executeQueryAsync(function () {
                    var resultItem = new self._listItemConstructor(item);
                    deferred.resolve(resultItem);
                }, function (sender, args) {
                    deferred.reject(new SPListRepo.RequestError(args));
                });
            });
        };
        ListRepository.prototype._getItemsByExpression = function (camlExpression, querySettings) {
            querySettings = querySettings || new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders);
            var camlQuery = this._getSPCamlQuery(this._getViewQuery(camlExpression, querySettings));
            return this._getItemsBySPCamlQuery(camlQuery);
        };
        ListRepository.prototype._getViewQuery = function (camlExpression, querySettings) {
            var camlQuery;
            var viewQuery = new CamlBuilder().View(querySettings.viewFields);
            if (querySettings.rowLimit) {
                viewQuery = viewQuery.RowLimit(querySettings.rowLimit);
            }
            var foldersOnlyExpression = CamlBuilder.Expression().IntegerField(SPListRepo.Fields.FSObjType).EqualTo(1);
            switch (querySettings.viewScope) {
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
            if (querySettings.viewScope === SPListRepo.ViewScope.FoldersOnly || querySettings.viewScope === SPListRepo.ViewScope.FoldersOnlyRecursive) {
                if (camlExpression) {
                    camlQuery = viewQuery.Query().Where().All(camlExpression, foldersOnlyExpression);
                }
                else {
                    camlQuery = viewQuery.Query().Where().All(foldersOnlyExpression);
                }
            }
            else {
                if (camlExpression) {
                    camlQuery = viewQuery.Query().Where().All(camlExpression);
                }
                else {
                    camlQuery = viewQuery.Query().Where().All();
                }
            }
            return camlQuery;
        };
        ListRepository.prototype._getSPCamlQuery = function (viewXmlObject) {
            var viewQuery = viewXmlObject.ToString();
            console.log("Running query:");
            console.log(viewQuery);
            var query = new SP.CamlQuery();
            query.set_viewXml(viewQuery);
            return query;
        };
        ListRepository.prototype._getItemsBySPCamlQuery = function (spCamlQuery) {
            var _this = this;
            return this._withPromise(function (deferred) {
                if (_this.folder) {
                    spCamlQuery.set_folderServerRelativeUrl(_this._getFolderRelativeUrl());
                }
                var items = _this._list.getItems(spCamlQuery);
                _this._context.load(items);
                var self = _this;
                _this._context.executeQueryAsync(function () {
                    var itemsEnumerator = items.getEnumerator();
                    var resultItemList = [];
                    while (itemsEnumerator.moveNext()) {
                        resultItemList.push(new self._listItemConstructor(itemsEnumerator.get_current()));
                    }
                    deferred.resolve(resultItemList);
                }, function (sender, args) {
                    deferred.reject(new SPListRepo.RequestError(args));
                });
            });
        };
        ListRepository.prototype._getFolderRelativeUrl = function (folderName) {
            var folder = folderName || this.folder;
            var listRootUrl = this._list.get_rootFolder().get_serverRelativeUrl();
            listRootUrl = SPListRepo.Helper.ensureTrailingSlash(listRootUrl);
            return String.format("{0}{1}", listRootUrl, folder);
        };
        ListRepository.prototype._createDeferred = function () {
            return jQuery.Deferred();
        };
        ListRepository.prototype._withPromise = function (callback) {
            var deferred = this._createDeferred();
            this._loadListDeferred.done(function () {
                callback(deferred);
            });
            return deferred.promise();
        };
        return ListRepository;
    })();
    SPListRepo.ListRepository = ListRepository;
})(SPListRepo || (SPListRepo = {}));
