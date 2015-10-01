/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../build/sp.list.repository.d.ts" />
/// <reference path="TestLib.ts" />
/// <reference path="TestCategories.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TestLibRepo = (function (_super) {
    __extends(TestLibRepo, _super);
    function TestLibRepo(id) {
        if (id) {
            _super.call(this, id, MyApp.TestLIbBaseItem);
        }
        else {
            _super.call(this, "TestLIb", MyApp.TestLIbBaseItem);
        }
    }
    return TestLibRepo;
})(SPListRepo.ListRepository);
var TestCategoryRepo = (function (_super) {
    __extends(TestCategoryRepo, _super);
    function TestCategoryRepo(id) {
        if (id) {
            _super.call(this, id, MyApp.TestCategoriesBaseItem);
        }
        else {
            _super.call(this, "Lists/TestCategories", MyApp.TestCategoriesBaseItem);
        }
    }
    return TestCategoryRepo;
})(SPListRepo.ListRepository);
SP.SOD.executeOrDelayUntilScriptLoaded(function () {
    describe("Test SPListRepository", function () {
        var testLibRepo = new TestLibRepo();
        var testCategoryRepo = new TestCategoryRepo();
        it("should get item by id", function (done) {
            var id = 1;
            testLibRepo.getItemById(id).done(function (item) {
                expect(item.id).toBe(id);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 4 items - files AND folders NOT recursive", function (done) {
            testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders)).done(function (items) {
                expect(items.length).toBe(4);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 3 items - files ONLY NOT recursive", function (done) {
            testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly)).done(function (items) {
                expect(items.length).toBe(3);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 1 items - folders ONLY NOT recursive", function (done) {
            testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FoldersOnly)).done(function (items) {
                expect(items.length).toBe(1);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 3 items - folders ONLY recursive", function (done) {
            testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FoldersOnlyRecursive)).done(function (items) {
                expect(items.length).toBe(3);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 9 items - files ONLY recursive", function (done) {
            testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnlyRecursive)).done(function (items) {
                expect(items.length).toBe(9);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 12 items - files AND fodlers recursive", function (done) {
            testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(function (items) {
                expect(items.length).toBe(12);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 1 items - files AND fodlers recursive rowlimit = 1", function (done) {
            testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive, null, 1)).done(function (items) {
                expect(items.length).toBe(1);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return TestText field only", function (done) {
            testLibRepo.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly, ["TestText"], 1)).done(function (items) {
                expect(items.length).toBe(1);
                var item = items[0];
                expect(item.testText).not.toBe(undefined);
                expect(item.testChoice).toBe(undefined);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 3 items by its ids", function (done) {
            testLibRepo.getItemsByIds([1, 2, 3], new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(function (items) {
                expect(items.length).toBe(3);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return only items inside folders", function (done) {
            testLibRepo.getItemsInsideFolders(["TestFolder/SubFolder", "TestFolder/images"], new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(function (items) {
                expect(items.length).toBe(3);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("gets last modified item", function (done) {
            testLibRepo.folder = "TestFolder";
            testLibRepo.getLastModifiedItem().done(function (item) {
                expect(item.id).toBe(8);
                testLibRepo.folder = null;
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                testLibRepo.folder = null;
                done();
            });
        });
        it("gets last added item", function (done) {
            testLibRepo.folder = "TestFolder/SubFolder";
            testLibRepo.getLastAddedItem().done(function (item) {
                expect(item.id).toBe(11);
                testLibRepo.folder = null;
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                testLibRepo.folder = null;
                done();
            });
        });
        it("should save the item", function (done) {
            var item = new MyApp.TestCategoriesBaseItem();
            item.title = "hello world";
            expect(item.id).toBeUndefined();
            testCategoryRepo.saveItem(item).done(function (m) {
                expect(m.id).not.toBeUndefined();
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should update the item", function (done) {
            testCategoryRepo.getItemById(1).done(function (m) {
                m.title = "hello world";
                testCategoryRepo.saveItem(m)
                    .done(function (saved) {
                    expect(saved.title).toBe("hello world");
                    done();
                })
                    .fail(function (error) {
                    expect(error).toBeUndefined();
                    done();
                });
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should delete item by id", function (done) {
            var item = new MyApp.TestCategoriesBaseItem();
            item.title = "hello world";
            testCategoryRepo.saveItem(item).done(function (m) {
                testCategoryRepo.deleteItem(m)
                    .done(function (deleted) {
                    expect(deleted).toBeUndefined();
                    done();
                })
                    .fail(function (error) {
                    expect(error).toBeUndefined();
                    done();
                });
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should create folder", function (done) {
            testLibRepo.createFolder("test").done(function (m) {
                expect(m.id).not.toBeUndefined();
                testLibRepo.deleteItem(m)
                    .done(function (deleted) {
                    done();
                })
                    .fail(function (error) {
                    expect(error).toBeUndefined();
                    done();
                });
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return item by title", function (done) {
            testLibRepo.getItemsByTitle("doc1").done(function (items) {
                expect(items.length).toBe(1);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
    });
}, "sp.js");
