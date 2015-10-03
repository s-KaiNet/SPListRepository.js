/// <reference path="../typings/tsd.d.ts" />
/// <reference path="ViewScope.ts" />
/// <reference path="Constants.ts" />

namespace SPListRepo{
	export class BaseListItem{
		
		spListItem: SP.ListItem;
		file: SP.File;
		id: number;
		created: Date;
		createdBy: string;
		modified:Date;
		modifiedBy: string;
		title: string;
		fileDirRef: string;
		fileSystemObjectType: SP.FileSystemObjectType;
		fileLeafRef: string = undefined;
		
		constructor(item?: SP.ListItem){
			if(item){
				this.mapFromListItem(item);
			}
		}		
		
		mapFromListItem(item: SP.ListItem): void{
			this.spListItem = item;
			this.file = this.spListItem.get_file();
			this.id = item.get_id();
			this.created = this.getFieldValue(Fields.Created);
			this.createdBy = this.getFieldValue(Fields.CreatedBy);
			this.modified = this.getFieldValue(Fields.Modified);
			this.modifiedBy = this.getFieldValue(Fields.ModifiedBy);
			this.title = this.getFieldValue(Fields.Title);
			this.fileDirRef = this.getFieldValue(Fields.FileDirRef);
			this.fileSystemObjectType = this.spListItem.get_fileSystemObjectType();
		}
		
		mapToListItem(item: SP.ListItem): void{
			this.setFieldValue(item, Fields.Title, this.title);
			this.setFieldValue(item, Fields.FileLeafRef, this.fileLeafRef);
		}
		
		protected getFieldValue(name:string): any{
			var value = this.spListItem.get_fieldValues()[name];
		
			if(typeof value !== "undefined"){
				return this.spListItem.get_item(name);
			}
			
			return undefined;
		}
		
		protected setFieldValue(item: SP.ListItem, name: string, value: any): void{
			if(value !== undefined){
				item.set_item(name, value);
			}
		}
	}
}