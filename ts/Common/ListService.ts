/// <reference path="../_references.ts" />

namespace SPListRepo{	
	export class ListService{
		private $ = jQuery;

		static getListByUrl(listUrl: string, hostWebUrl?: string):JQueryPromise<SP.List>{		
			var loadDeferred = $.Deferred<SP.List>();
			
			var success = function(list:SP.List){
				loadDeferred.resolve(list);			
			};
			
			var error = function(err:RequestError){
				loadDeferred.reject(err);
			};
			
			var context = SP.ClientContext.get_current();			
			var hostContext: SP.AppContextSite | SP.ClientContext;
			var hostWeb: SP.Web = null;
			if(hostWebUrl){
				hostContext = new SP.AppContextSite(context, hostWebUrl);
				hostWeb = hostContext.get_web();
				context.load(hostWeb, "Url", "ServerRelativeUrl")
			} else{
				hostContext = context;
			}
			
			var web = context.get_web();
			context.load(web, "Url", "ServerRelativeUrl");	
			context.executeQueryAsync(() => {
				var webAbsoluteUrl = Helper.ensureTrailingSlash(web.get_url());
				var webServerRelativeUrl = hostWebUrl ? Helper.ensureTrailingSlash(hostWeb.get_serverRelativeUrl()) : Helper.ensureTrailingSlash(web.get_serverRelativeUrl());
				var url = "";
				if(hostWebUrl){
					url = String.format("{0}_api/SP.AppContextSite(@target)/web/lists/?@target='{3}'&$expand=RootFolder&$filter=RootFolder/ServerRelativeUrl eq '{1}{2}'&$select=ID", 
					webAbsoluteUrl, webServerRelativeUrl, listUrl, hostWebUrl);
				}else{
					url = String.format("{0}_api/web/lists/?$expand=RootFolder&$filter=RootFolder/ServerRelativeUrl eq '{1}{2}'&$select=ID", webAbsoluteUrl, webServerRelativeUrl, listUrl);
				}

				if((<any>(hostContext.get_web())).getList){ //Post Feb.2015 CU - getList() availiable
					var list = (<any>(hostContext.get_web())).getList(String.format("{0}{1}", webServerRelativeUrl, listUrl)); 
					context.load(list, "Title", "RootFolder", "Id");
					context.executeQueryAsync(function(){
						success(list);
					}, function(sender, err) { 
						error(new RequestError(err));
					});
				}else{						//Pre Feb.2015 CU - getList missing
					ListService.getListUsingRest(url, success, error, hostWebUrl);
				}			
				}, (sender, err) => {
					error(new RequestError(err));
			});			
			
			return loadDeferred.promise();
		}
		
		static getListById(id: SP.Guid, hostWebUrl?: string):JQueryPromise<SP.List>{
			var loadDeferred = $.Deferred<SP.List>();
			var context = SP.ClientContext.get_current();
			var hostContext: SP.ClientContext | SP.AppContextSite;
			if(hostWebUrl){
				hostContext = new SP.AppContextSite(context, hostWebUrl);
			}
			else{
				hostContext = context;
			}
			var list = hostContext.get_web().get_lists().getById(id);
			context.load(list, "Title", "RootFolder", "Id");
			context.executeQueryAsync(function(){
				loadDeferred.resolve(list);
			}, function(sender, err) { 
				loadDeferred.reject(new RequestError(err));
			});
			
			return loadDeferred.promise();
		}
		
		private static getListUsingRest(url:string, success:(lsit:SP.List) => void, error: (err:RequestError) => void, hostWebUrl?: string){
			$.ajax({
				url: url, 
				type: "GET",
				contentType: "application/json;odata=verbose",
				headers:{
					"Accept": "application/json;odata=verbose"
				},
				success: function(data){
					var context = SP.ClientContext.get_current();
					var hostContext: SP.ClientContext | SP.AppContextSite;
					if(hostWebUrl){
						hostContext = new SP.AppContextSite(context, hostWebUrl);
					}
					else{
						hostContext = context;
					}
					var list = hostContext.get_web().get_lists().getById(data.d.results[0].Id);
					context.load(list, "Title", "RootFolder", "Id");
					context.executeQueryAsync(function(){
						success(list);
					}, function(sender, e){
						error(new RequestError(e));
					});
				},
				error: function(jqXHR, textStatus){
					error(new RequestError(textStatus));
				}
			});
		}		
	}
}