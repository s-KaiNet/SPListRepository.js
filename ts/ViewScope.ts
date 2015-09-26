/// <reference path="../typings/tsd.d.ts" />

namespace SPListRepo{
	export enum ViewScope{
		FilesOnly = 0, 				//Shows only files(items) in the specified folder 
		FoldersOnly = 1, 			//Shows only olders in the specified folder 
		FilesFolders = 2, 			//Shows all files(items) AND folders of the specified folder.
		FilesOnlyRecursive = 3, 	//Shows only files(items) in the specified folder or any folder descending from it
		FoldersOnlyRecursive = 4,	//Shows only folders in the specified folder or any folder descending from it
		FilesFoldersRecursive = 5	//Shows all files(items) AND folders in the specified folder or any folder descending from it
	}
}

Type.registerNamespace("SPListRepo.ViewScope");