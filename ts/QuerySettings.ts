/// <reference path="../typings/tsd.d.ts" />
/// <reference path="ViewScope.ts" />

namespace SPListRepo{
		
	export class QuerySettings {
		viewScope: ViewScope;
		viewFields: string[];
		rowLimit: number;
		
		constructor(viewScope?: ViewScope, viewFields?: string[], rowLimit?: number){	
			this.viewScope = viewScope;
			this.viewFields = viewFields;
			this.rowLimit = rowLimit;	
		}
	}
}