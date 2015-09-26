/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../build/sp.list.repository.d.ts" />

describe("Test SPListRepository", () => {
	it("should get item by id", done => {
		var test = new SPListRepo.ListRepository("SiteAssets", SPListRepo.BaseListItem);
		
		test.getItemById(68).done(item => {
			expect(item.id).toBe(68);
			done();
		})
		.fail(error => {
			expect(error).toBeUndefined();
			done();
		});	
	});
});


