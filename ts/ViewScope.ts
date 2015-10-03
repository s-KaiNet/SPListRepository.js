/// <reference path="../typings/tsd.d.ts" />

//https://msdn.microsoft.com/en-us/library/dd923822%28v=office.12%29.aspx
namespace SPListRepo{
	export enum ViewScope{
		FilesOnly = 0, 				//Shows only files(items) in the specified folder (<View Scope="FilesOnly")
		FoldersOnly = 1, 			//Shows only olders in the specified folder (custom query)
		FilesFolders = 2, 			//Shows all files(items) AND folders of the specified folder (View Scope="")
		FilesOnlyRecursive = 3, 	//Shows only files(items) in the specified folder or any folder descending from it (<View Scope="Recursive")
		FoldersOnlyRecursive = 4,	//Shows only folders in the specified folder or any folder descending from it (custom query)
		FilesFoldersRecursive = 5	//Shows all files(items) AND folders in the specified folder or any folder descending from it (<View Scope="RecursiveAll")
	}
}

Type.registerNamespace("SPListRepo.ViewScope");