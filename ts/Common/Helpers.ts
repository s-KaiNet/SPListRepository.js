/// <reference path="../_references.ts" />

Type.registerNamespace("SPListRepo");

namespace SPListRepo{
	export class Helper {
		public static ensureTrailingSlash(url: string) : string{
			if(!url.endsWith("/")){
				return url + "/";
			}

			return url;
		}

		public static ensureLeadingSlash(url: string) : string{
			if(!(url.substr(0, 1) === "/")){
				return "/" + url;
			}

			return url;
		}
	}
}