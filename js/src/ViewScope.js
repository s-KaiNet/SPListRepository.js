//https://msdn.microsoft.com/en-us/library/dd923822%28v=office.12%29.aspx

SPListRepo.ViewScope = function(){};
SPListRepo.ViewScope.prototype = {	
	//specified folder - folder that you specified in 'folder' parameter for the repository. If not specified, root folder used.	
	
	FilesOnly: 0, 				//Shows only the files(items) in the specified folder 
	FoldersOnly: 1, 			//Shows only the folders in the specified folder 
	FilesFolders: 2, 			//Shows only the files(items) AND subfolders of the specified folder.
	FilesOnlyRecursive: 3, 		//Shows all files(items) in the specified folder or any folder descending from it
	FoldersOnlyRecursive: 4,	//Shows all folders in the specified folder or any folder descending from it
	FilesFoldersRecursive: 5	//Shows all files(items) AND folders in the specified folder or any folder descending from it
};

SPListRepo.ViewScope.registerEnum("SPListRepo.ViewScope", false);