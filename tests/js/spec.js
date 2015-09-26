/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../build/sp.list.repository.d.ts" />
describe("Test SPListRepository", function () {
    it("should get item by id", function (done) {
        var test = new SPListRepo.ListRepository("SiteAssets", SPListRepo.BaseListItem);
        test.getItemById(68).done(function (item) {
            expect(item.id).toBe(68);
            done();
        })
            .fail(function (error) {
            expect(error).toBeUndefined();
            done();
        });
    });
});
