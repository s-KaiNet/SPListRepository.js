/// <reference path="../_references.ts" />

namespace SPListRepo{
	export class QDeferred<T> implements IDeferred<T>{
		dfd: Q.Deferred<T>;
		
		constructor(){
			this.dfd = Q.defer<T>();
		}
		
		promise(): IPromise<T>{
			return new QPromise<T>(this.dfd);
		}
		
		resolve(data?:T){
			return this.dfd.resolve(data);
		}
		
		reject(reason?:any){
			return this.dfd.reject(reason);
		}	
	}
}