/// <reference path="../_references.ts" />

namespace SPListRepo{
	export class ngPromise<T> implements IPromise<T>{
		constructor(private dfd: ng.IDeferred<T>){
			
		}
		
		done(cb: (data?: T) => any): IPromise<T>{
			this.dfd.promise.then(cb);
			
			return this;
		}
		
		fail(cb: (reason?: any) => any): IPromise<T>{
			this.dfd.promise.catch(cb);
			
			return this;
		}
		
		then(success: (data?: T) => any, error: (reason?: any) => any): IPromise<T>{
			this.dfd.promise.then(success, error);
			
			return this;
		}
		
		always(cb: () => any): IPromise<T>{
			this.dfd.promise.finally(cb);
			
			return this;
		}		
	}
}