SPListRepo.ListService =
(function ($) {
	"use strict";
	
	var listsPool = {};

	return {
		getListByUrl: function (listUrl) {
		
			if(listsPool[listUrl]){
				return listsPool[listUrl];
			}
			
			var loadDeferred = $.Deferred();
			listsPool[listUrl] = loadDeferred;
			
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