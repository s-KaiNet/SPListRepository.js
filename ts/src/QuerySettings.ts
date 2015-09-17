/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="ViewScope.ts" />

namespace SPListRepo{
	
	export class QuerySettings {
		viewScope: SPListRepo.ViewScope;
		viewFields: string[];
		rowLimit: number;
		
		constructor(viewScope?: SPListRepo.ViewScope, viewFields?: string[], rowLimit?: number){	
			this.viewScope = viewScope;
			this.viewFields = viewFields;
			this.rowLimit = rowLimit;	
		}
	}
}