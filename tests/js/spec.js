/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../build/sp.list.repository.d.ts" />
/// <reference path="TestLib.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TestRepo = (function (_super) {
    __extends(TestRepo, _super);
    function TestRepo(id) {
        if (id) {
            _super.call(this, id, MyApp.TestLIbBaseItem);
        }
        else {
            _super.call(this, "TestLIb", MyApp.TestLIbBaseItem);
        }
    }
    return TestRepo;
})(SPListRepo.ListRepository);
SP.SOD.executeOrDelayUntilScriptLoaded(function () {
    describe("Test SPListRepository", function () {
        var test = new TestRepo();
        it("should get item by id", function (done) {
            var id = 1;
            test.getItemById(id).done(function (item) {
                expect(item.id).toBe(id);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 3 items - files AND folders NOT recursive", function (done) {
            test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFolders)).done(function (items) {
                expect(items.length).toBe(3);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 2 items - files ONLY NOT recursive", function (done) {
            test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly)).done(function (items) {
                expect(items.length).toBe(2);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 1 items - folders ONLY NOT recursive", function (done) {
            test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FoldersOnly)).done(function (items) {
                expect(items.length).toBe(1);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 2 items - folders ONLY recursive", function (done) {
            test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FoldersOnlyRecursive)).done(function (items) {
                expect(items.length).toBe(2);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 4 items - files ONLY recursive", function (done) {
            test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnlyRecursive)).done(function (items) {
                expect(items.length).toBe(4);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 6 items - files AND fodlers recursive", function (done) {
            test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(function (items) {
                expect(items.length).toBe(6);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return 1 items - files AND fodlers recursive rowlimit = 1", function (done) {
            test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive, null, 1)).done(function (items) {
                expect(items.length).toBe(1);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return TestText field only", function (done) {
            test.getItems(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly, ["TestText"], 1)).done(function (items) {
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
            test.getItemsByIds([1, 2, 3], new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(function (items) {
                expect(items.length).toBe(3);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("should return only items inside folders", function (done) {
            test.getItemsInsideFolders(["TestFolder/TestFolder"], new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesFoldersRecursive)).done(function (items) {
                expect(items.length).toBe(1);
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                done();
            });
        });
        it("get last modified item", function (done) {
            test.folder = "TestFolder";
            test.getLastModifiedItem(new SPListRepo.QuerySettings(SPListRepo.ViewScope.FilesOnly)).done(function (item) {
                expect(item.id).toBe(5);
                test.folder = null;
                done();
            })
                .fail(function (error) {
                expect(error).toBeUndefined();
                test.folder = null;
                done();
            });
        });
    });
}, "sp.js");
