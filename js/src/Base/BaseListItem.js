SPListRepo.BaseListItem =
(function(){
	"use strict";
	
	function BaseListItem(item) {
		var e = Function.validateParameters(arguments, [
			{ name: "item", type: SP.ListItem, optional:true }
		], true);

		if (e) throw e;

		if(item) {
			this.item = item;
			this.id = item.get_id();
			this.created = this.getFieldValue(SPListRepo.Fields.Created);
			this.createdBy = this.getFieldValue(SPListRepo.Fields.CreatedBy);
			this.modified = this.getFieldValue(SPListRepo.Fields.Modified);
			this.modifiedBy = this.getFieldValue(SPListRepo.Fields.ModifiedBy);
			this.title = this.getFieldValue(SPListRepo.Fields.Title);
			this.fileDirRef = this.getFieldValue(SPListRepo.Fields.FileDirRef);
			this.fileSystemObjectType = this.item.get_fileSystemObjectType();
		}
	}
	
	BaseListItem.prototype.getFieldValue = function(name){
		var value = this.item.get_fieldValues()[name];
		
		if(typeof value !== "undefined"){
			return this.item.get_item(name);
		}
		
		return undefined;
	}
	
	return BaseListItem;
})();

SPListRepo.BaseListItem.registerClass("SPListRepo.BaseListItem");