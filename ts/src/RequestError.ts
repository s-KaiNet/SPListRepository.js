/// <reference path="../../typings/tsd.d.ts" />

namespace SPListRepo{
	export class RequestError {
		stackTrace:string;
		message:string;
		correlation:string;
		errorCode:number;
		details:string;
		errorType:string;
		
		constructor(error: SP.ClientRequestFailedEventArgs|string){
			if (error instanceof SP.ClientRequestFailedEventArgs) {
			this.stackTrace = error.get_stackTrace();
			this.message = error.get_message();
			this.correlation = error.get_errorTraceCorrelationId();
			this.errorCode = error.get_errorCode();
			this.details = error.get_errorDetails();
			this.errorType = error.get_errorTypeName();
			} else if (typeof error === "string") {
				this.message = error;
			}
		}
	}
}