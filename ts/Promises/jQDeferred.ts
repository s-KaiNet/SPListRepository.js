/// <reference path="../_references.ts" />

namespace SPListRepo{	
	export class jQDeferred<T> implements IDeferred<T>{
		dfd: JQueryDeferred<T>;
		
		constructor(){
			this.dfd = jQuery.Deferred<T>();		
		}
		
		promise(): IPromise<T>{
			return new jQPromise<T>(this.dfd);
		}
		
		resolve(data?:T){
			return this.dfd.resolve(data);
		}
		
		reject(reason?:any){
			return this.dfd.reject(reason);
		}
	}
}