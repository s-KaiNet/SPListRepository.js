SPListRepo.ListService =
(function ($) {
	"use strict";
	
	var listsPool = {};
	
	function getListUsingRest(url, success, error){
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
						success(list);
					}, function(sender, error){
						loadDeferred.reject(new SPListRepo.RequestError(error));
					});
				},
				error: function(jqXHR, textStatus){
					error(textStatus);
				}
			});		
	}

	return {
		getListByUrl: function (listUrl) {	
			var loadDeferred = $.Deferred();
			
			var webAbsoluteUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webAbsoluteUrl);
			var webServerRelativeUrl = SPListRepo.Helpers.ensureTrailingSlash(_spPageContextInfo.webServerRelativeUrl);
			var url = String.format("{0}_api/web/lists/?$expand=RootFolder&$filter=RootFolder/ServerRelativeUrl eq '{1}{2}'&$select=ID", webAbsoluteUrl, webServerRelativeUrl, listUrl);
			
			var context = SP.ClientContext.get_current();
			
			var success = function(list){
				loadDeferred.resolve(list);			
			};
			
			var error = function(err){
				loadDeferred.reject(new SPListRepo.RequestError(err));
			};
			if(context.get_web().getList){ //Post Feb.2015 CU - getList() availiable
				var list = context.get_web().getList(String.format("{0}{1}", webServerRelativeUrl, listUrl)); 
				context.load(list);
				context.executeQueryAsync(function(){
					success(list);
				}, function(sender, err) { 
					error(err);
				});
			}else{							//Pre Feb.2015 CU - getList missing
				getListUsingRest(url, success, error);
			}			
			
			return loadDeferred.promise();
		}
	};
})(jQuery);