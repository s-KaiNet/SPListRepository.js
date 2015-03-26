SPListRepo.QuerySettings = (function(){
	"use strict";
	
	function QuerySettings(viewScope, viewFields, rowLimit) {
		var e = Function.validateParameters(arguments, [
				{ name: "viewScope", type: SPListRepo.ViewScope, optional: true },
				{ name: "viewFields", type: Array, elementType: String, optional: true, mayBeNull: true },
				{ name: "rowLimit", type: Number, optional: true }
			], true);
			
			if (e) throw e;
			
			this.viewScope = viewScope;
			this.viewFields = viewFields;
			this.rowLimit = rowLimit;
	}
	
	return QuerySettings;
})();

SPListRepo.QuerySettings.registerClass("SPListRepo.QuerySettings");