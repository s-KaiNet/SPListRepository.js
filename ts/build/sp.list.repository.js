
/// <reference path="../typings/tsd.d.ts" />
Type.registerNamespace("SPListRepo.Fields");
Type.registerNamespace("SPListRepo.ErrorCodes");
var SPListRepo;
(function (SPListRepo) {
  var Fields;
  (function (Fields) {
    Fields.Modified = "Modified";
    Fields.Created = "Created";
    Fields.ModifiedBy = "Editor";
    Fields.CreatedBy = "Author";
    Fields.ID = "ID";
    Fields.FSObjType = "FSObjType";
    Fields.Title = "Title";
    Fields.FileLeafRef = "FileLeafRef";
    Fields.FileDirRef = "FileDirRef";
    Fields.ContentTypeId = "ContentTypeId";
  })(Fields = SPListRepo.Fields || (SPListRepo.Fields = {}));
})(SPListRepo || (SPListRepo = {}));
var SPListRepo;
(function (SPListRepo) {
  var ErrorCodes;
  (function (ErrorCodes) {
    ErrorCodes.FolderAlreadyExists = -2130245363;
    ErrorCodes.IllegalName = -2130575245;
  })(ErrorCodes = SPListRepo.ErrorCodes || (SPListRepo.ErrorCodes = {}));
})(SPListRepo || (SPListRepo = {}));
/// <reference path="../typings/tsd.d.ts" />
var SPListRepo;
(function (SPListRepo) {
  var RequestError = (function () {
    function RequestError(error) {
      if (error instanceof SP.ClientRequestFailedEventArgs) {
        this.stackTrace = error.get_stackTrace();
        this.message = error.get_message();
        this.correlation = error.get_errorTraceCorrelationId();
        this.errorCode = error.get_errorCode();
        this.details = error.get_errorDetails();
        this.errorType = error.get_errorTypeName();
      }
      else if (typeof error === "string") {
        this.message = error;
      }
    }
    return RequestError;
  })();
  SPListRepo.RequestError = RequestError;
})(SPListRepo || (SPListRepo = {}));
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="ViewScope.ts" />
var SPListRepo;
(function (SPListRepo) {
  var QuerySettings = (function () {
    function QuerySettings(viewScope, viewFields, rowLimit) {
      this.viewScope = viewScope;
      this.viewFields = viewFields;
      this.rowLimit = rowLimit;
    }
    return QuerySettings;
  })();
  SPListRepo.QuerySettings = QuerySettings;
})(SPListRepo || (SPListRepo = {}));
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="RequestError.ts" />
/// <reference path="Helpers.ts" />
var SPListRepo;
(function (SPListRepo) {
  var ListService = (function () {
    function ListService() {
      this.$ = jQuery;
    }
    ListService.getListByUrl = function (listUrl) {
      var loadDeferred = $.Deferred();
      var webAbsoluteUrl = SPListRepo.Helper.ensureTrailingSlash(_spPageContextInfo.webAbsoluteUrl);
      var webServerRelativeUrl = SPListRepo.Helper.ensureTrailingSlash(_spPageContextInfo.webServerRelativeUrl);
      var url = String.format("{0}_api/web/lists/?$expand=RootFolder&$filter=RootFolder/ServerRelativeUrl eq '{1}{2}'&$select=ID", webAbsoluteUrl, webServerRelativeUrl, listUrl);
      var context = SP.ClientContext.get_current();
      var success = function (list) {
        loadDeferred.resolve(list);
      };
      var error = function (err) {
        loadDeferred.reject(err);
      };
      if ((context.get_web()).getList) {
        var list = (context.get_web()).getList(String.format("{0}{1}", webServerRelativeUrl, listUrl));
        context.load(list);
        context.executeQueryAsync(function () {
          success(list);
        }, function (sender, err) {
          error(new SPListRepo.RequestError(err));
        });
      }
      else {
        ListService.getListUsingRest(url, success, error);
      }
      return loadDeferred.promise();
    };
    ListService.getListById = function (id) {
      var loadDeferred = $.Deferred();
      var context = SP.ClientContext.get_current();
      var list = context.get_web().get_lists().getById(id);
      context.load(list, "Title", "RootFolder", "Id");
      context.executeQueryAsync(function () {
        loadDeferred.resolve(list);
      }, function (sender, err) {
        loadDeferred.reject(new SPListRepo.RequestError(err));
      });
      return loadDeferred.promise();
    };
    ListService.getListUsingRest = function (url, success, error) {
      $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json;odata=verbose",
        headers: {
          "Accept": "application/json;odata=verbose"
        },
        success: function (data) {
          var context = SP.ClientContext.get_current();
          var list = context.get_web().get_lists().getById(data.d.results[0].Id);
          context.load(list);
          context.executeQueryAsync(function () {
            success(list);
          }, function (sender, e) {
            error(new SPListRepo.RequestError(e));
          });
        },
        error: function (jqXHR, textStatus) {
          error(new SPListRepo.RequestError(textStatus));
        }
      });
    };
    return ListService;
  })();
  SPListRepo.ListService = ListService;
})(SPListRepo || (SPListRepo = {}));
/// <reference path="../typings/tsd.d.ts" />
var SPListRepo;
(function (SPListRepo) {
  (function (ViewScope) {
    ViewScope[ViewScope["FilesOnly"] = 0] = "FilesOnly";
    ViewScope[ViewScope["FoldersOnly"] = 1] = "FoldersOnly";
    ViewScope[ViewScope["FilesFolders"] = 2] = "FilesFolders";
    ViewScope[ViewScope["FilesOnlyRecursive"] = 3] = "FilesOnlyRecursive";
    ViewScope[ViewScope["FoldersOnlyRecursive"] = 4] = "FoldersOnlyRecursive";
    ViewScope[ViewScope["FilesFoldersRecursive"] = 5] = "FilesFoldersRecursive"; //Shows all files(items) AND folders in the specified folder or any folder descending from it
  })(SPListRepo.ViewScope || (SPListRepo.ViewScope = {}));
  var ViewScope = SPListRepo.ViewScope;
})(SPListRepo || (SPListRepo = {}));
Type.registerNamespace("SPListRepo.ViewScope");
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="ViewScope.ts" />
/// <reference path="Constants.ts" />
var SPListRepo;
(function (SPListRepo) {
  var BaseListItem = (function () {
    function BaseListItem(item) {
      this.fileLeafRef = undefined;
      if (item) {
        this.spListItem = item;
        this.file = this.spListItem.get_file();
        this.id = item.get_id();
        this.created = this.getFieldValue(SPListRepo.Fields.Created);
        this.createdBy = this.getFieldValue(SPListRepo.Fields.CreatedBy);
        this.modified = this.getFieldValue(SPListRepo.Fields.Modified);
        this.modifiedBy = this.getFieldValue(SPListRepo.Fields.ModifiedBy);
        this.title = this.getFieldValue(SPListRepo.Fields.Title);
        this.fileDirRef = this.getFieldValue(SPListRepo.Fields.FileDirRef);
        this.fileSystemObjectType = this.spListItem.get_fileSystemObjectType();
      }
    }
    BaseListItem.prototype.getFieldValue = function (name) {
      var value = this.spListItem.get_fieldValues()[name];
      if (typeof value !== "undefined") {
        return this.spListItem.get_item(name);
      }
      return undefined;
    };
    return BaseListItem;
  })();
  SPListRepo.BaseListItem = BaseListItem;
})(SPListRepo || (SPListRepo = {}));
