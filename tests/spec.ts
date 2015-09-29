/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../build/sp.list.repository.d.ts" />
/// <reference path="TestLib.ts" />

class TestRepo extends SPListRepo.ListRepository<MyApp.TestLIbBaseItem>{
	constructor();
	constructor(id?: SP.Guid){
		if(id){
			super(id, MyApp.TestLIbBaseItem);
		} else{
			super("TestLIb", MyApp.TestLIbBaseItem)
		}
	}
}

SP.SOD.executeOrDelayUntilScriptLoaded(() =>{
	describe("Test SPListRepository", () => {		
		var test = new TestRepo();
		
		it("should get item by id", done => {
			var id = 1;
			test.getItemById(id).done(item => {
				expect(item.id).toBe(id);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 3 items - files AND folders NOT recursive", done => {
			test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders)).done(items => {
				expect(items.length).toBe(3);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 2 items - files ONLY NOT recursive", done => {
			test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly)).done(items => {
				expect(items.length).toBe(2);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 1 items - folders ONLY NOT recursive", done => {
			test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FoldersOnly)).done(items => {
				expect(items.length).toBe(1);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 2 items - folders ONLY recursive", done => {
			test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FoldersOnlyRecursive)).done(items => {
				expect(items.length).toBe(2);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 4 items - files ONLY recursive", done => {
			test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnlyRecursive)).done(items => {
				expect(items.length).toBe(4);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 6 items - files AND fodlers recursive", done => {
			test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(items => {
				expect(items.length).toBe(6);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 1 items - files AND fodlers recursive rowlimit = 1", done => {
			test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive, null, 1)).done(items => {
				expect(items.length).toBe(1);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return TestText field only", done => {			
			test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly, ["TestText"], 1)).done(items => {
				expect(items.length).toBe(1);
				var item = items[0];
				expect(item.testText).not.toBe(undefined);
				expect(item.testChoice).toBe(undefined);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 3 items by its ids", done => {	
			test.getItemsByIds([1,2,3],new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(items => {
				expect(items.length).toBe(3);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return only items inside folders", done => {	
			test.getItemsInsideFolders(["TestFolder/TestFolder"],new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(items => {
				expect(items.length).toBe(1);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("get last modified item", done => {
			test.folder = "TestFolder";
			test.getLastModifiedItem(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly)).done(item => {
				expect(item.id).toBe(5);
				test.folder = null;
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				test.folder = null;
				done();
			});	
		});
	});
}, "sp.js");