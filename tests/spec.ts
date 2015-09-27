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

describe("Test SPListRepository", () => {
	it("should get item by id", done => {
		var test = new TestRepo();
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
});


