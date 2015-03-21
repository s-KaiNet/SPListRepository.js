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
		this.created = item.get_item(SPListRepo.Fields.Created);
		this.createdBy = item.get_item(SPListRepo.Fields.CreatedBy);
		this.modified = item.get_item(SPListRepo.Fields.Modified);
		this.modifiedBy = item.get_item(SPListRepo.Fields.ModifiedBy);
		this.title = item.get_item(SPListRepo.Fields.Title);
		this.fileDirRef = item.get_item(SPListRepo.Fields.FileDirRef);
	}
	
	return BaseListItem;
})();

SPListRepo.BaseListItem.registerClass("SPListRepo.BaseListItem");