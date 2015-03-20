Type.registerNamespace("SPListRepo");

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