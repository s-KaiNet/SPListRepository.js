/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../build/sp.list.repository.d.ts" />
/// <reference path="TestLib.ts" />
/// <reference path="TestCategories.ts" />

class TestLibRepo extends SPListRepo.ListRepository<MyApp.TestLIbBaseItem>{
	constructor();
	constructor(id?: SP.Guid){
		if(id){
			super(id, MyApp.TestLIbBaseItem);
		} else{
			super("TestLIb", MyApp.TestLIbBaseItem)
		}
	}
}

class TestCategoryRepo extends SPListRepo.ListRepository<MyApp.TestCategoriesBaseItem>{
	constructor();
	constructor(id?: SP.Guid){
		if(id){
			super(id, MyApp.TestCategoriesBaseItem);
		} else{
			super("Lists/TestCategories", MyApp.TestCategoriesBaseItem)
		}
	}
}

SP.SOD.executeOrDelayUntilScriptLoaded(() =>{
	describe("Test SPListRepository", () => {		
		var testLibRepo = new TestLibRepo();
		var testCategoryRepo = new TestCategoryRepo();
		
		it("should get item by id", done => {
			var id = 1;
			testLibRepo.getItemById(id).done(item => {
				expect(item.id).toBe(id);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 4 items - files AND folders NOT recursive", done => {
			testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders)).done(items => {
				expect(items.length).toBe(4);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 3 items - files ONLY NOT recursive", done => {
			testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly)).done(items => {
				expect(items.length).toBe(3);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 1 items - folders ONLY NOT recursive", done => {
			testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FoldersOnly)).done(items => {
				expect(items.length).toBe(1);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 3 items - folders ONLY recursive", done => {
			testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FoldersOnlyRecursive)).done(items => {
				expect(items.length).toBe(3);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 9 items - files ONLY recursive", done => {
			testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnlyRecursive)).done(items => {
				expect(items.length).toBe(9);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 12 items - files AND fodlers recursive", done => {
			testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(items => {
				expect(items.length).toBe(12);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return 1 items - files AND fodlers recursive rowlimit = 1", done => {
			testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive, null, 1)).done(items => {
				expect(items.length).toBe(1);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return TestText field only", done => {			
			testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly, ["TestText"], 1)).done(items => {
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
			testLibRepo.getItemsByIds([1,2,3],new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(items => {
				expect(items.length).toBe(3);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return only items inside folders", done => {	
			testLibRepo.getItemsInsideFolders(["TestFolder/SubFolder", "TestFolder/images"],new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(items => {
				expect(items.length).toBe(3);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("gets last modified item", done => {
			testLibRepo.folder = "TestFolder";
			testLibRepo.getLastModifiedItem().done(item => {
				expect(item.id).toBe(8);
				testLibRepo.folder = null;
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				testLibRepo.folder = null;
				done();
			});	
		});
		
		it("gets last added item", done => {
			testLibRepo.folder = "TestFolder/SubFolder";
			testLibRepo.getLastAddedItem().done(item => {
				expect(item.id).toBe(11);
				testLibRepo.folder = null;
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				testLibRepo.folder = null;
				done();
			});	
		});
		
		it("should save the item", done => {
			var item = new MyApp.TestCategoriesBaseItem();
			item.title = "hello world";
			expect(item.id).toBeUndefined();
			testCategoryRepo.saveItem(item).done(m => {
				expect(m.id).not.toBeUndefined();
				done()
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should update the item", done => {
			testCategoryRepo.getItemById(1).done(m => {
				m.title = "hello world";
				testCategoryRepo.saveItem(m)
				.done(saved => {
					expect(saved.title).toBe("hello world");
					done();
				})
				.fail(error => {
					expect(error).toBeUndefined();
					done();
				});	
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should delete item by id", done => {
			var item = new MyApp.TestCategoriesBaseItem();
			item.title = "hello world";
			testCategoryRepo.saveItem(item).done(m => {
				testCategoryRepo.deleteItem(m)
				.done((deleted) =>{
					expect(deleted).toBeUndefined();
					done();
				})
				.fail(error => {
					expect(error).toBeUndefined();
					done();
				})
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should create folder", done => {
			testLibRepo.createFolder("test").done(m => {
				expect(m.id).not.toBeUndefined();
				testLibRepo.deleteItem(m)
				.done(deleted => {
					done();
				})
				.fail(error => {
					expect(error).toBeUndefined();
					done();
				})
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
		it("should return item by title", done => {
			testLibRepo.getItemsByTitle("doc1").done(items => {
				expect(items.length).toBe(1);
				done();
			})
			.fail(error => {
				expect(error).toBeUndefined();
				done();
			});	
		});
		
	});
}, "sp.js");