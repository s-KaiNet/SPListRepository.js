/// <reference path="../../typings/tsd.d.ts" />

declare module SPListRepo {
    enum ViewScope {
        FilesOnly = 0,
        FoldersOnly = 1,
        FilesFolders = 2,
        FilesOnlyRecursive = 3,
        FoldersOnlyRecursive = 4,
        FilesFoldersRecursive = 5,
    }
}
declare module SPListRepo.Fields {
    var Modified: string;
    var Created: string;
    var ModifiedBy: string;
    var CreatedBy: string;
    var ID: string;
    var FSObjType: string;
    var Title: string;
    var FileLeafRef: string;
    var FileDirRef: string;
    var ContentTypeId: string;
}
declare module SPListRepo.ErrorCodes {
    var FolderAlreadyExists: number;
    var IllegalName: number;
}
declare module SPListRepo {
    class BaseListItem {
        spListItem: SP.ListItem;
        file: SP.File;
        id: number;
        created: Date;
        createdBy: string;
        modified: Date;
        modifiedBy: string;
        title: string;
        fileDirRef: string;
        fileSystemObjectType: SP.FileSystemObjectType;
        fileLeafRef: string;
        constructor(item?: SP.ListItem);
        getFieldValue(name: string): any;
    }
}
declare module SPListRepo {
    class Helper {
        static ensureTrailingSlash(url: string): string;
        static ensureLeadingSlash(url: string): string;
    }
}
declare module SPListRepo {
    class RequestError {
        stackTrace: string;
        message: string;
        correlation: string;
        errorCode: number;
        details: string;
        errorType: string;
        constructor(error: SP.ClientRequestFailedEventArgs | string);
    }
}
declare module SPListRepo {
    class ListService {
        private $;
        static getListByUrl(listUrl: string): JQueryPromise<SP.List>;
        static getListById(id: SP.Guid): JQueryPromise<SP.List>;
        private static getListUsingRest(url, success, error);
    }
}
declare module SPListRepo {
    class QuerySettings {
        viewScope: SPListRepo.ViewScope;
        viewFields: string[];
        rowLimit: number;
        constructor(viewScope?: SPListRepo.ViewScope, viewFields?: string[], rowLimit?: number);
    }
}
declare module SPListRepo {
    interface IBaseItemConstruct<T extends BaseListItem> {
        new (item?: SP.ListItem): T;
    }
    class ListRepository<T extends BaseListItem> {
        private _context;
        private _loadListDeferred;
        private _list;
        private _listItemConstructor;
        folder: string;
        constructor(listUrlOrId: string | SP.Guid, listItemConstructor: IBaseItemConstruct<T>);
        getItems(querySettings: SPListRepo.QuerySettings): JQueryPromise<T[]>;
        getItemById(id: number): JQueryPromise<T>;
        getItemsByIds(ids: number[], querySettings: SPListRepo.QuerySettings): JQueryPromise<T[]>;
        getItemsInsideFolders(folderNames: string[], querySettings: SPListRepo.QuerySettings): JQueryPromise<T[]>;
        getLastAddedItem(querySettings: SPListRepo.QuerySettings): JQueryPromise<T>;
        getLastModifiedItem(querySettings: SPListRepo.QuerySettings): JQueryPromise<T>;
        saveItem(model: T): JQueryPromise<T>;
        deleteItem(model: T): JQueryPromise<T>;
        createFolder(folderName: string): JQueryPromise<SP.ListItem>;
        createFile(url: string, content: string, overwrite: boolean): JQueryPromise<SP.File>;
        private _getItemBySPCamlQuery(spCamlQuery);
        private _addItem(model);
        private _updateItem(model);
        private _setFieldValues(item, model);
        private _getItemsByExpression(camlExpression, querySettings?);
        private _getViewQuery(camlExpression, querySettings);
        private _getSPCamlQuery(viewXmlObject);
        private _getItemsBySPCamlQuery(spCamlQuery);
        private _getFolderRelativeUrl(folderName?);
        private _createDeferred<T>();
        private _withPromise<U>(callback);
    }
}
