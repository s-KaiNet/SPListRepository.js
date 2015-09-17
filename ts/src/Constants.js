/// <reference path="../../typings/tsd.d.ts" />
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
