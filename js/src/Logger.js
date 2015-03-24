SPListRepo.Logger =
(function (window) {
	"use strict";
	return {
		log: function(data){
			if(window.SPListRepo.isDebug){
				console.log(data);
			}
		}
	};
})(window);