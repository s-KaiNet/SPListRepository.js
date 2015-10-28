/// <reference path="../_references.ts" />

namespace SPListRepo{
	export class jQPromise<T> implements IPromise<T>{
		constructor(private dfd: JQueryDeferred<T>){
			
		}
		
		done(cb: (data?: T) => any): IPromise<T>{
			this.dfd.promise().done(cb);
			
			return this;
		}
		
		fail(cb: (reason?: any) => any): IPromise<T>{
			this.dfd.promise().fail(cb);
			
			return this;
		}
		
		then(success: (data?: T) => any, error: (reason?: any) => any): IPromise<T>{
			this.dfd.promise().then(success, error);
			
			return this;
		}
		
		always(cb: () => any) : IPromise<T>{
			this.dfd.promise().always(cb);
			
			return this;
		}
		
		getUnderlyingPromise(): any{
			return this.dfd.promise();
		}
	}
}