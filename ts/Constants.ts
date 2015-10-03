/// <reference path="../typings/tsd.d.ts" />

Type.registerNamespace("SPListRepo.Fields");
Type.registerNamespace("SPListRepo.ErrorCodes");

namespace SPListRepo.Fields {
	export var Modified = "Modified";
	export var Created = "Created";
	export var ModifiedBy = "Editor";
	export var CreatedBy = "Author";
	export var ID = "ID";
	export var FSObjType = "FSObjType";
	export var Title = "Title";
	export var FileLeafRef = "FileLeafRef";
	export var FileDirRef = "FileDirRef";
	export var ContentTypeId = "ContentTypeId";
}

namespace SPListRepo.ErrorCodes{
	export var FolderAlreadyExists = -2130245363;
	export var IllegalName = -2130575245;
}