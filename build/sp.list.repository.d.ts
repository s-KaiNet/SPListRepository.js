/// <reference path="typings/tsd.d.ts" />
declare namespace SPListRepo {
    enum ViewScope {
        FilesOnly = 0,
        FoldersOnly = 1,
        FilesFolders = 2,
        FilesOnlyRecursive = 3,
        FoldersOnlyRecursive = 4,
        FilesFoldersRecursive = 5,
    }
}
declare namespace SPListRepo.Fields {
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
declare namespace SPListRepo.ErrorCodes {
    var FolderAlreadyExists: number;
    var IllegalName: number;
}
declare namespace SPListRepo {
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
        mapFromListItem(item: SP.ListItem): void;
        mapToListItem(item: SP.ListItem): void;
        protected getFieldValue(name: string): any;
        protected setFieldValue(item: SP.ListItem, name: string, value: any): void;
    }
}
declare namespace SPListRepo {
    class Helper {
        static ensureTrailingSlash(url: string): string;
        static ensureLeadingSlash(url: string): string;
    }
}
declare namespace SPListRepo {
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
declare namespace SPListRepo {
    class ListService {
        private $;
        static getListByUrl(listUrl: string): JQueryPromise<SP.List>;
        static getListById(id: SP.Guid): JQueryPromise<SP.List>;
        private static getListUsingRest(url, success, error);
    }
}
declare namespace SPListRepo {
    class QuerySettings {
        viewScope: ViewScope;
        viewFields: string[];
        rowLimit: number;
        constructor(viewScope?: ViewScope, viewFields?: string[], rowLimit?: number);
    }
}
declare namespace SPListRepo {
    interface IBaseItemConstruct<T extends BaseListItem> {
        new (item?: SP.ListItem): T;
    }
    class ListRepository<T extends BaseListItem> {
        protected _context: SP.ClientContext;
        protected _loadListDeferred: JQueryPromise<SP.List>;
        protected _list: SP.List;
        protected _listItemConstructor: IBaseItemConstruct<T>;
        folder: string;
        constructor(listUrlOrId: string | SP.Guid, listItemConstructor: IBaseItemConstruct<T>);
        getItems(querySettings?: QuerySettings): JQueryPromise<T[]>;
        getItemById(id: number): JQueryPromise<T>;
        getItemsByTitle(title: string, querySettings?: QuerySettings): JQueryPromise<T[]>;
        getItemsByIds(ids: number[], querySettings?: QuerySettings): JQueryPromise<T[]>;
        getItemsInsideFolders(folderNames: string[], querySettings?: QuerySettings): JQueryPromise<T[]>;
        getLastAddedItem(viewFields?: string[], recursive?: boolean): JQueryPromise<T>;
        getLastModifiedItem(viewFields?: string[], recursive?: boolean): JQueryPromise<T>;
        saveItem(model: T): JQueryPromise<T>;
        deleteItem(model: T): JQueryPromise<T>;
        createFolder(folderName: string): JQueryPromise<T>;
        createFile(url: string, content: string, overwrite: boolean): JQueryPromise<SP.File>;
        protected _getItemBySPCamlQuery(spCamlQuery: SP.CamlQuery): JQueryPromise<T>;
        protected _addItem(model: T): JQueryPromise<T>;
        protected _updateItem(model: T): JQueryPromise<T>;
        protected _getItemsByExpression(camlExpression: CamlBuilder.IExpression, querySettings?: QuerySettings): JQueryPromise<T[]>;
        protected _getViewQuery(camlExpression: CamlBuilder.IExpression, querySettings: QuerySettings): CamlBuilder.IExpression;
        protected _getSPCamlQuery(viewXmlObject: CamlBuilder.IFinalizable): SP.CamlQuery;
        protected _getItemsBySPCamlQuery(spCamlQuery: SP.CamlQuery): JQueryPromise<T[]>;
        protected _getFolderRelativeUrl(folderName?: string): string;
        protected _createDeferred<T>(): JQueryDeferred<T>;
        protected _withPromise<U>(callback: (deferred: JQueryDeferred<U>) => void): JQueryPromise<U>;
    }
}
