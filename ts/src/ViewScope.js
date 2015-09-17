/// <reference path="../../typings/tsd.d.ts" />
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
