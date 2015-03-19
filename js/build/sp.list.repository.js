var SPListRepo = SPListRepo || {};

SPListRepo.Helpers =
(function ($) {
	"use strict";
	return {
		ensureTrailingSlash: function (url) {
			if(!url.endsWith("/")){
				return url + "/";
			}
			
			return url;
		},
		ensureLeadingSlash: function(url){
			if(!url.startsWith("/")){
				return "/" + url;
			}
			
			return url;
		}
	};
})(jQuery);
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
SPListRepo.ListService =
(function ($) {
	"use strict";
	
	var listsPool = {};

	return {
		getListByUrl: function (listUrl) {
		
			if(listsPool[listUrl]){
				return $.when(listsPool[listUrl]);
			}
			
			var loadDeferred = $.Deferred();
			
			var webAbsoluteUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webAbsoluteUrl);
			var webServerRelativeUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webServerRelativeUrl);
			var url = String.format("{0}_api/web/lists/?$expand=RootFolder&$filter=RootFolder/ServerRelativeUrl eq '{1}{2}'&$select=ID", webAbsoluteUrl, webServerRelativeUrl, listUrl);

			$.ajax({
				url: url, 
				type: "GET",
				contentType: "application/json;odata=verbose",
				headers:{
					"Accept": "application/json;odata=verbose"
				},
				success: function(data){
					var context = SP.ClientContext.get_current();
					var list = context.get_web().get_lists().getById(data.d.results[0].Id);
					context.load(list);
					context.executeQueryAsync(function(){
						listsPool[listUrl] = list;
						loadDeferred.resolve(list);
					}, function(sender, error){
						loadDeferred.reject(new SPListRepo.RequestError(error));
					});
				},
				error: function(jqXHR, textStatus){
					loadDeferred.reject(new SPListRepo.RequestError(textStatus));
				}
			});

			return loadDeferred.promise();
		}
	};
})(jQuery);