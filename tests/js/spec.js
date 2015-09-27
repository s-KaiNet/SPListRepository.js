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
describe("Test SPListRepository", function () {
    it("should get item by id", function (done) {
        var test = new TestRepo();
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
});
