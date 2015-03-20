SPListRepo.BaseListItem =
(function(){
	"use strict";
	
	function BaseListItem(item) {
		var e = Function.validateParameters(arguments, [
			{ name: "item", type: SP.ListItem }
		], true);

		if (e) throw e;

		this.item = item;
		this.id = item.get_id();
		this.created = item.get_item(FAQ.Fields.Created);
		this.createdBy = item.get_item(FAQ.Fields.CreatedBy);
		this.modified = item.get_item(FAQ.Fields.Modified);
		this.modifiedBy = item.get_item(FAQ.Fields.ModifiedBy);
		this.title = item.get_item(FAQ.Fields.Title);
		this.fileDirRef = item.get_item(FAQ.Fields.FileDirRef);
	}
	
	return BaseListItem;
})();



SPListRepo.BaseListItem.registerClass("SPListRepo.BaseListItem");