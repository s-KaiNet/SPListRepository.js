/// <reference path="../_references.ts" />

namespace SPListRepo{
	export interface IPromise<T>{
		then(success: (data?: T) => any, error: (reason?: any) => any): IPromise<T>;
		done(cb: (data?: T) => any): IPromise<T>;
		fail(cb: (reason?: any) => any): IPromise<T>;
		always(cb: () => any): IPromise<T>;
	}
}