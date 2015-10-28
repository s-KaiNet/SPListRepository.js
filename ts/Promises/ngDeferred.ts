/// <reference path="../_references.ts" />

namespace SPListRepo{
	export class ngDeferred<T> implements IDeferred<T>{
		dfd: ng.IDeferred<T>;
		
		constructor(){
			var $q = angular.injector(["ng"]).get<ng.IQService>("$q");
			this.dfd = $q.defer();
			
		}
		
		promise(): IPromise<T>{
			return new ngPromise<T>(this.dfd);
		}
		
		resolve(data:T){
			return this.dfd.resolve(data);
		}
		
		reject(){
			return this.dfd.reject();
		}	
	}
}