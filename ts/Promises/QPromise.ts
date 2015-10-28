/// <reference path="../_references.ts" />

namespace SPListRepo{
	export class QPromise<T> implements IPromise<T>{
		constructor(private dfd: Q.Deferred<T>){
			
		}
		
		done(cb: (data?: T) => any): IPromise<T>{
			this.dfd.promise.done(cb);
			
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