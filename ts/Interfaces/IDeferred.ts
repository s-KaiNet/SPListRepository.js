/// <reference path="../_references.ts" />

namespace SPListRepo{
	export interface IDeferred<T>{
		promise(): IPromise<T>;
		resolve(data?:T);
		reject(reason?: any);
	}
}