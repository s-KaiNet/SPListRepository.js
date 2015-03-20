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