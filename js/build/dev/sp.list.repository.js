Type.registerNamespace("SPListRepo");

SPListRepo.Helpers = function() {
    "use strict";
    return {
        ensureTrailingSlash: function(url) {
            return url.endsWith("/") ? url : url + "/";
        },
        ensureLeadingSlash: function(url) {
            return url.startsWith("/") ? url : "/" + url;
        }
    };
}(jQuery);

!function() {
    "use strict";
    window.SPListRepo.isDebug = 0;
}();

Type.registerNamespace("SPListRepo.Fields");

Type.registerNamespace("SPListRepo.ErrorCodes");

!function(SPListRepo) {
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
}(SPListRepo);

SPListRepo.RequestError = function() {
    "use strict";
    function RequestError(error) {
        if (error instanceof SP.ClientRequestFailedEventArgs) {
            this.stackTrace = error.get_stackTrace();
            this.message = error.get_message();
            this.correlation = error.get_errorTraceCorrelationId();
            this.errorCode = error.get_errorCode();
            this.details = error.get_errorDetails();
            this.errorType = error.get_errorTypeName();
        } else "string" == typeof error && (this.message = error);
    }
    return RequestError;
}();

SPListRepo.RequestError.registerClass("SPListRepo.RequestError");

SPListRepo.ListService = function($) {
    "use strict";
    function getListUsingRest(url, success, error) {
        $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                Accept: "application/json;odata=verbose"
            },
            success: function(data) {
                var context = SP.ClientContext.get_current(), list = context.get_web().get_lists().getById(data.d.results[0].Id);
                context.load(list, "Title", "RootFolder", "Id");
                context.executeQueryAsync(function() {
                    success(list);
                }, function(sender, error) {
                    loadDeferred.reject(new SPListRepo.RequestError(error));
                });
            },
            error: function(jqXHR, textStatus) {
                error(textStatus);
            }
        });
    }
    return {
        getListByUrl: function(listUrl) {
            var loadDeferred = $.Deferred(), webAbsoluteUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webAbsoluteUrl), webServerRelativeUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webServerRelativeUrl), url = String.format("{0}_api/web/lists/?$expand=RootFolder&$filter=RootFolder/ServerRelativeUrl eq '{1}{2}'&$select=ID", webAbsoluteUrl, webServerRelativeUrl, listUrl), context = SP.ClientContext.get_current(), success = function(list) {
                loadDeferred.resolve(list);
            }, error = function(err) {
                loadDeferred.reject(new SPListRepo.RequestError(err));
            };
            if (context.get_web().getList) {
                var list = context.get_web().getList(String.format("{0}{1}", webServerRelativeUrl, listUrl));
                context.load(list, "Title", "RootFolder", "Id");
                context.executeQueryAsync(function() {
                    success(list);
                }, function(sender, err) {
                    error(err);
                });
            } else getListUsingRest(url, success, error);
            return loadDeferred.promise();
        },
        getListById: function(listId) {
            var loadDeferred = $.Deferred(), context = SP.ClientContext.get_current(), list = context.get_web().get_lists().getById(listId);
            context.load(list, "Title", "RootFolder", "Id");
            context.executeQueryAsync(function() {
                loadDeferred.resolve(list);
            }, function(sender, err) {
                loadDeferred.reject(new SPListRepo.RequestError(err));
            });
            return loadDeferred.promise();
        }
    };
}(jQuery);

SPListRepo.ViewScope = function() {};

SPListRepo.ViewScope.prototype = {
    FilesOnly: 0,
    FoldersOnly: 1,
    FilesFolders: 2,
    FilesOnlyRecursive: 3,
    FoldersOnlyRecursive: 4,
    FilesFoldersRecursive: 5
};

SPListRepo.ViewScope.registerEnum("SPListRepo.ViewScope", !1);

SPListRepo.QuerySettings = function() {
    "use strict";
    function QuerySettings(viewScope, viewFields, rowLimit) {
        var e = Function.validateParameters(arguments, [ {
            name: "viewScope",
            type: SPListRepo.ViewScope,
            optional: !0
        }, {
            name: "viewFields",
            type: Array,
            elementType: String,
            optional: !0,
            mayBeNull: !0
        }, {
            name: "rowLimit",
            type: Number,
            optional: !0
        } ], !0);
        if (e) throw e;
        this.viewScope = viewScope;
        this.viewFields = viewFields;
        this.rowLimit = rowLimit;
    }
    return QuerySettings;
}();

SPListRepo.QuerySettings.registerClass("SPListRepo.QuerySettings");

SPListRepo.BaseListItem = function() {
    "use strict";
    function BaseListItem(item) {
        var e = Function.validateParameters(arguments, [ {
            name: "item",
            type: SP.ListItem,
            optional: !0
        } ], !0);
        if (e) throw e;
        if (item) {
            this.item = item;
            this.file = this.item.file;
            this.id = item.get_id();
            this.created = this.getFieldValue(SPListRepo.Fields.Created);
            this.createdBy = this.getFieldValue(SPListRepo.Fields.CreatedBy);
            this.modified = this.getFieldValue(SPListRepo.Fields.Modified);
            this.modifiedBy = this.getFieldValue(SPListRepo.Fields.ModifiedBy);
            this.title = this.getFieldValue(SPListRepo.Fields.Title);
            this.fileDirRef = this.getFieldValue(SPListRepo.Fields.FileDirRef);
            this.fileSystemObjectType = this.item.get_fileSystemObjectType();
        }
    }
    BaseListItem.prototype.getFieldValue = function(name) {
        var value = this.item.get_fieldValues()[name];
        return "undefined" != typeof value ? this.item.get_item(name) : void 0;
    };
    return BaseListItem;
}();

SPListRepo.BaseListItem.registerClass("SPListRepo.BaseListItem");

SPListRepo.ListRepository = function($) {
    "use strict";
    function ListRepository(listUrlOrId, listItemConstructor) {
        var e = Function.validateParameters(arguments, [ {
            name: "listUrlOrId",
            type: String
        }, {
            name: "listItemConstructor",
            type: Function
        } ], !0);
        if (e) throw e;
        var listId, listUrl, guidRegex = /[\da-zA-Z]{8}-([\da-zA-Z]{4}-){3}[\da-zA-Z]{12}/g;
        listUrlOrId instanceof SP.Guid ? listId = listUrlOrId.toString() : guidRegex.test(listUrlOrId) ? listId = listUrlOrId.match(guidRegex)[0] : listUrl = listUrlOrId;
        this._listItemConstructor = listItemConstructor;
        this._context = SP.ClientContext.get_current();
        this._loadListDeferred = listId ? SPListRepo.ListService.getListById(listId) : SPListRepo.ListService.getListByUrl(listUrl);
        this._loadListDeferred.done(Function.createDelegate(this, function(list) {
            this._list = list;
            var rootFolderRelativeUrl = list.get_rootFolder().get_serverRelativeUrl();
            this._listUrl = rootFolderRelativeUrl.replace(SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webServerRelativeUrl), "");
        }));
        this.folder = null;
    }
    ListRepository.prototype = {
        getItems: function(querySettings) {
            var e = Function.validateParameters(arguments, [ {
                name: "querySettings",
                type: SPListRepo.QuerySettings,
                optional: !0
            } ], !0);
            if (e) throw e;
            return this._getItemsByExpression(null, querySettings);
        },
        getItemById: function(id) {
            var e = Function.validateParameters(arguments, [ {
                name: "id",
                type: Number
            } ], !0);
            if (e) throw e;
            return this._withPromise(function(deferred) {
                var item = this._list.getItemById(id);
                this._context.load(item);
                var self = this;
                this._context.executeQueryAsync(function() {
                    var resultItem = new self._listItemConstructor(item);
                    deferred.resolve(resultItem);
                }, function(sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        },
        getItemsByIds: function(ids, querySettings) {
            var e = Function.validateParameters(arguments, [ {
                name: "ids",
                type: Array,
                elementType: Number
            }, {
                name: "querySettings",
                type: SPListRepo.QuerySettings,
                optional: !0
            } ]);
            if (e) throw e;
            var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).In(ids);
            return this._getItemsByExpression(camlExpression, querySettings);
        },
        getItemsInsideFolders: function(folderNames, querySettings) {
            var e = Function.validateParameters(arguments, [ {
                name: "folderNames",
                type: Array,
                elementType: String
            }, {
                name: "querySettings",
                type: SPListRepo.QuerySettings,
                optional: !0
            } ]);
            if (e) throw e;
            var self = this, camlExpression = CamlBuilder.Expression().TextField(SPListRepo.Fields.FileDirRef).In(folderNames.map(function(folderName) {
                var folderRelUrl = self._getFolderRelativeUrl(folderName);
                folderRelUrl.startsWith("/") && (folderRelUrl = folderRelUrl.substring(1));
                return folderRelUrl;
            }));
            return this._getItemsByExpression(camlExpression, querySettings);
        },
        getLastAddedItem: function(querySettings) {
            var e = Function.validateParameters(arguments, [ {
                name: "querySettings",
                type: SPListRepo.QuerySettings,
                optional: !0
            } ]);
            if (e) throw e;
            var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).NotEqualTo(0);
            querySettings = querySettings || new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders);
            querySettings.rowLimit = 1;
            var query = this._getSPCamlQuery(this._getViewQuery(camlExpression, querySettings).OrderByDesc(SPListRepo.Fields.ID));
            return this._getItemsBySPCamlQuery(query);
        },
        getLastModifiedItem: function(querySettings) {
            var e = Function.validateParameters(arguments, [ {
                name: "querySettings",
                type: SPListRepo.QuerySettings,
                optional: !0
            } ]);
            if (e) throw e;
            var camlExpression = CamlBuilder.Expression().CounterField(SPListRepo.Fields.ID).NotEqualTo(0);
            querySettings = querySettings || new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders);
            querySettings.rowLimit = 1;
            var query = this._getSPCamlQuery(this._getViewQuery(camlExpression, querySettings).OrderByDesc(SPListRepo.Fields.Modified));
            return this._getItemsBySPCamlQuery(query);
        },
        saveItem: function(model) {
            var e = Function.validateParameters(arguments, [ {
                name: "model",
                type: this._listItemConstructor
            } ], !0);
            if (e) throw e;
            return !model.id || model.id < 1 ? this._addItem(model) : this._updateItem(model);
        },
        deleteItem: function(model) {
            var e = Function.validateParameters(arguments, [ {
                name: "model",
                type: this._listItemConstructor
            } ], !0);
            if (e) throw e;
            return this._withPromise(function(deferred) {
                var item = this._list.getItemById(model.id);
                this._context.load(item);
                item.deleteObject();
                this._context.executeQueryAsync(function() {
                    deferred.resolve();
                }, function(sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        },
        createFolder: function(folderName) {
            var e = Function.validateParameters(arguments, [ {
                name: "folderName",
                type: String
            } ], !0);
            if (e) throw e;
            return this._withPromise(function(deferred) {
                var folder = new SP.ListItemCreationInformation();
                folder.set_underlyingObjectType(SP.FileSystemObjectType.folder);
                folder.set_leafName(folderName);
                var folderItem = this._list.addItem(folder);
                folderItem.set_item("Title", folderName);
                folderItem.update();
                this._context.load(folderItem);
                this._context.executeQueryAsync(function() {
                    deferred.resolve(folderItem);
                }, function(sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        },
        createFile: function(url, content, overwrite) {
            var e = Function.validateParameters(arguments, [ {
                name: "url",
                type: String
            }, {
                name: "content",
                type: String
            }, {
                name: "overwrite",
                type: Boolean
            } ], !0);
            if (e) throw e;
            return this._withPromise(function(deferred) {
                var fileCreateInfo = new SP.FileCreationInformation();
                fileCreateInfo.set_url(url);
                fileCreateInfo.set_overwrite(overwrite);
                fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
                for (var i = 0; i < content.length; i++) fileCreateInfo.get_content().append(content.charCodeAt(i));
                var newFile = this._context.get_web().getFolderByServerRelativeUrl(this._getFolderRelativeUrl()).get_files().add(fileCreateInfo);
                this._context.load(newFile);
                this._context.executeQueryAsync(function() {
                    deferred.resolve(newFile);
                }, function(sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        },
        _createDeferred: function() {
            return $.Deferred();
        },
        _withPromise: function(callback) {
            var deferred = this._createDeferred();
            this._loadListDeferred.done(Function.createDelegate(this, function() {
                callback.apply(this, [ deferred ]);
            }));
            return deferred.promise();
        },
        _addItem: function(model) {
            var e = Function.validateParameters(arguments, [ {
                name: "model",
                type: this._listItemConstructor
            } ], !0);
            if (e) throw e;
            return this._withPromise(function(deferred) {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                this.folder && itemCreateInfo.set_folderUrl(this._getFolderRelativeUrl());
                var newItem = this._list.addItem(itemCreateInfo);
                this._setFieldValues(newItem, model);
                var self = this;
                newItem.update();
                this._context.load(newItem);
                this._context.executeQueryAsync(function() {
                    var resultItem = new self._listItemConstructor(newItem);
                    deferred.resolve(resultItem);
                }, function(sender, error) {
                    deferred.reject(new SPListRepo.RequestError(error));
                });
            });
        },
        _updateItem: function(model) {
            var e = Function.validateParameters(arguments, [ {
                name: "model",
                type: this._listItemConstructor
            } ], !0);
            if (e) throw e;
            return this._withPromise(function(deferred) {
                var item = this._list.getItemById(model.id);
                this._context.load(item);
                this._setFieldValues(item, model);
                var self = this;
                item.update();
                this._context.executeQueryAsync(function() {
                    var resultItem = new self._listItemConstructor(item);
                    deferred.resolve(resultItem);
                }, function(sender, args) {
                    deferred.reject(new SPListRepo.RequestError(args));
                });
            });
        },
        _setFieldValues: function(item, model) {
            item.set_item(SPListRepo.Fields.Title, model.title);
            model.fileLeafRef && item.set_item(SPListRepo.Fields.FileLeafRef, model.fileLeafRef);
        },
        _getFolderRelativeUrl: function(folderName) {
            var folder = folderName || this.folder, webRelativeUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webServerRelativeUrl);
            return String.format("{0}{1}/{2}", webRelativeUrl, this._listUrl, folder);
        },
        _getItemsByExpression: function(camlExpression, querySettings) {
            this._createDeferred();
            querySettings = querySettings || new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders);
            var camlQuery = this._getSPCamlQuery(this._getViewQuery(camlExpression, querySettings));
            return this._getItemsBySPCamlQuery(camlQuery);
        },
        _getItemsBySPCamlQuery: function(spCamlQuery) {
            return this._withPromise(function(deferred) {
                this.folder && spCamlQuery.set_folderServerRelativeUrl(this._getFolderRelativeUrl());
                var items = this._list.getItems(spCamlQuery);
                this._context.load(items);
                var self = this;
                this._context.executeQueryAsync(function() {
                    for (var itemsEnumerator = items.getEnumerator(), resultItemList = []; itemsEnumerator.moveNext(); ) resultItemList.push(new self._listItemConstructor(itemsEnumerator.get_current()));
                    console.log(String.format("Getting results ({0}):", resultItemList.length));
                    console.log(resultItemList);
                    deferred.resolve(resultItemList);
                }, function(sender, args) {
                    deferred.reject(new SPListRepo.RequestError(args));
                });
            });
        },
        _getItemByExpression: function(camlExpression, querySettings) {
            var deferred = this._createDeferred();
            this._getItemsByExpression(camlExpression, querySettings).done(function(items) {
                if (items.length > 1) throw "Result contains more than one element";
                deferred.resolve(1 === items.length ? items[0] : null);
            }).fail(function(err) {
                deferred.reject(err);
            });
            return deferred.promise();
        },
        _getViewQuery: function(camlExpression, querySettings) {
            var camlQuery, viewQuery = (this._createDeferred(), new CamlBuilder().View(querySettings.viewFields));
            querySettings.rowLimit && (viewQuery = viewQuery.RowLimit(querySettings.rowLimit));
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
            }
            camlQuery = querySettings.viewScope === SPListRepo.ViewScope.FoldersOnly || querySettings.viewScope === SPListRepo.ViewScope.FoldersOnlyRecursive ? camlExpression ? viewQuery.Query().Where().All(camlExpression, foldersOnlyExpression) : viewQuery.Query().Where().All(foldersOnlyExpression) : camlExpression ? viewQuery.Query().Where().All(camlExpression) : viewQuery.Query().Where().All();
            return camlQuery;
        },
        _getSPCamlQuery: function(viewXmlObject) {
            var viewQuery = viewXmlObject.ToString();
            console.log("Running query:");
            console.log(viewQuery);
            var query = new SP.CamlQuery();
            query.set_viewXml(viewQuery);
            return query;
        }
    };
    return ListRepository;
}(jQuery);

SPListRepo.ListRepository.registerClass("SPListRepo.ListRepository");