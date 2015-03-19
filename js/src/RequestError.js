SPListRepo.RequestError = (function(){
	"use strict";
	
	function RequestError(error) {
		if (error instanceof SP.ClientRequestFailedEventArgs) {
			this.stackTrace = error.get_stackTrace();
			this.message = error.get_message();
			this.correlation = error.get_errorTraceCorrelationId();
			this.errorCode = error.get_errorCode();
			this.details = error.get_errorDetails();
			this.errorType = error.get_errorTypeName();
		} else if (typeof error == "string") {
			this.message = error;
		}
	}
	
	return RequestError;
})();

SPListRepo.RequestError.registerClass("SPListRepo.RequestError");