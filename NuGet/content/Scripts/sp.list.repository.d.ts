/// <reference path="typings/tsd.d.ts" />
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
    enum ViewScope {
        FilesOnly = 0,
        FoldersOnly = 1,
        FilesFolders = 2,
        FilesOnlyRecursive = 3,
        FoldersOnlyRecursive = 4,
        FilesFoldersRecursive = 5,
    }
}
declare namespace SPListRepo {
    class ListService {
        private $;
        static getListByUrl(listUrl: string, hostWebUrl?: string): JQueryPromise<SP.List>;
        static getListById(id: SP.Guid, hostWebUrl?: string): JQueryPromise<SP.List>;
        private static getListUsingRest(url, success, error, hostWebUrl?);
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
    interface IPromise<T> {
        then(success: (data?: T) => any, error: (reason?: any) => any): IPromise<T>;
        done(cb: (data?: T) => any): IPromise<T>;
        fail(cb: (reason?: any) => any): IPromise<T>;
        always(cb: () => any): IPromise<T>;
        getUnderlyingPromise(): any;
    }
}
declare namespace SPListRepo {
    interface IDeferred<T> {
        promise(): IPromise<T>;
        resolve(data?: T): any;
        reject(reason?: any): any;
    }
}
declare namespace SPListRepo {
    class ngPromise<T> implements IPromise<T> {
        private dfd;
        constructor(dfd: ng.IDeferred<T>);
        done(cb: (data?: T) => any): IPromise<T>;
        fail(cb: (reason?: any) => any): IPromise<T>;
        then(success: (data?: T) => any, error: (reason?: any) => any): IPromise<T>;
        always(cb: () => any): IPromise<T>;
        getUnderlyingPromise(): any;
    }
}
declare namespace SPListRepo {
    class jQPromise<T> implements IPromise<T> {
        private dfd;
        constructor(dfd: JQueryDeferred<T>);
        done(cb: (data?: T) => any): IPromise<T>;
        fail(cb: (reason?: any) => any): IPromise<T>;
        then(success: (data?: T) => any, error: (reason?: any) => any): IPromise<T>;
        always(cb: () => any): IPromise<T>;
        getUnderlyingPromise(): any;
    }
}
declare namespace SPListRepo {
    class QPromise<T> implements IPromise<T> {
        private dfd;
        constructor(dfd: Q.Deferred<T>);
        done(cb: (data?: T) => any): IPromise<T>;
        fail(cb: (reason?: any) => any): IPromise<T>;
        then(success: (data?: T) => any, error: (reason?: any) => any): IPromise<T>;
        always(cb: () => any): IPromise<T>;
        getUnderlyingPromise(): any;
    }
}
declare namespace SPListRepo {
    class ngDeferred<T> implements IDeferred<T> {
        dfd: ng.IDeferred<T>;
        constructor();
        promise(): IPromise<T>;
        resolve(data: T): void;
        reject(): void;
    }
}
declare namespace SPListRepo {
    class jQDeferred<T> implements IDeferred<T> {
        dfd: JQueryDeferred<T>;
        constructor();
        promise(): IPromise<T>;
        resolve(data?: T): JQueryDeferred<T>;
        reject(reason?: any): JQueryDeferred<T>;
    }
}
declare namespace SPListRepo {
    class QDeferred<T> implements IDeferred<T> {
        dfd: Q.Deferred<T>;
        constructor();
        promise(): IPromise<T>;
        resolve(data?: T): void;
        reject(reason?: any): void;
    }
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
    interface IBaseItemConstruct<T extends BaseListItem> {
        new (item?: SP.ListItem): T;
    }
    class ListRepository<T extends BaseListItem> {
        protected _context: SP.ClientContext;
        protected _loadListDeferred: JQueryPromise<SP.List>;
        protected _list: SP.List;
        protected _listItemConstructor: IBaseItemConstruct<T>;
        folder: string;
        constructor(listUrlOrId: string | SP.Guid, listItemConstructor: IBaseItemConstruct<T>, hostUrl?: string);
        getItems(querySettings?: QuerySettings): IPromise<T[]>;
        getItemById(id: number): IPromise<T>;
        getItemsByTitle(title: string, querySettings?: QuerySettings): IPromise<T[]>;
        getItemsByIds(ids: number[], querySettings?: QuerySettings): IPromise<T[]>;
        getItemsInsideFolders(folderNames: string[], querySettings?: QuerySettings): IPromise<T[]>;
        getLastAddedItem(viewFields?: string[], recursive?: boolean): IPromise<T>;
        getLastModifiedItem(viewFields?: string[], recursive?: boolean): IPromise<T>;
        saveItem(model: T): IPromise<T>;
        deleteItem(model: T): IPromise<T>;
        createFolder(folderName: string): IPromise<T>;
        createFile(url: string, content: string, overwrite: boolean): IPromise<SP.File>;
        protected _getItemBySPCamlQuery(spCamlQuery: SP.CamlQuery): IPromise<T>;
        protected _addItem(model: T): IPromise<T>;
        protected _updateItem(model: T): IPromise<T>;
        protected _getItemsByExpression(camlExpression: CamlBuilder.IExpression, querySettings?: QuerySettings): IPromise<T[]>;
        protected _getItemByExpression(camlExpression: CamlBuilder.IExpression, querySettings?: QuerySettings): IPromise<T>;
        protected _getViewQuery(camlExpression: CamlBuilder.IExpression, querySettings: QuerySettings): CamlBuilder.IExpression;
        protected _getSPCamlQuery(viewXmlObject: CamlBuilder.IFinalizable): SP.CamlQuery;
        protected _getItemsBySPCamlQuery(spCamlQuery: SP.CamlQuery): IPromise<T[]>;
        protected _getFolderRelativeUrl(folderName?: string): string;
        protected _createDeferred<T>(): IDeferred<T>;
        protected _withPromise<T>(callback: (deferred: IDeferred<T>) => void): IPromise<T>;
    }
}
