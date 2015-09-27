using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Security;
using EnvDTE;
using Microsoft.SharePoint.Client;
using Debugger = System.Diagnostics.Debugger;

namespace SPListRepository.Generator
{
	public static class Helper
	{
		public static Dictionary<FieldType, string> FieldTypeMappings;
		public static List<FieldType> SupportedFieldTypes;

		static Helper()
		{
			FieldTypeMappings = new Dictionary<FieldType, string>
			{
				{FieldType.Boolean, "boolean"},
				{FieldType.Choice, "string"},
				{FieldType.ContentTypeId, "string"},
				{FieldType.Counter, "number"},
				{FieldType.DateTime, "Date"},
				{FieldType.Integer, "number"},
				{FieldType.Lookup, "SP.FieldLookupValue"},
				{FieldType.Number, "number"},
				{FieldType.Text, "string"},
				{FieldType.URL, "SP.FieldUrlValue"},
				{FieldType.User, "SP.FieldUserValue"},
				{FieldType.MultiChoice, "SP.FieldMultiChoice"},
				{FieldType.Note, "SP.FieldMultiLineText"},
				{FieldType.Computed, "string"}
			};

			SupportedFieldTypes = new List<FieldType>();
			SupportedFieldTypes.AddRange(FieldTypeMappings.Keys);
		}

		public static string GetTypeStringByFieldType(Field field)
		{
			if (field.FieldTypeKind == FieldType.Lookup && ((FieldLookup)field).AllowMultipleValues)
			{
				return "SP.FieldLookupValue[]";
			}

			if (field.FieldTypeKind == FieldType.User && ((FieldUser)field).AllowMultipleValues)
			{
				return "SP.FieldUserValue[]";
			}

			if (FieldTypeMappings.Keys.Contains(field.FieldTypeKind))
			{
				return FieldTypeMappings[field.FieldTypeKind];
			}

			throw new Exception("Can't find mapping for field type " + field.TypeAsString);
		}

		public static bool IsFieldTypeSupported(FieldType type)
		{
			return SupportedFieldTypes.Any(f => f == type);
		}

		public static ClientContext CreateContext(GeneratorConfig config)
		{
			var ctx = new ClientContext(config.SiteUrl);

			var isOnPrem = config.SiteUrl.IndexOf(".sharepoint.com") == -1;

			if (isOnPrem && config.Creds != null)
			{
				ctx.Credentials = new NetworkCredential(config.Creds.UserName, config.Creds.Password);
			}
			else
			{
				var passWord = new SecureString();
				foreach (char c in config.Creds.Password) passWord.AppendChar(c);

				ctx.Credentials = new SharePointOnlineCredentials(config.Creds.UserName, passWord);
			}

			return ctx;
		}

		public static bool IsListAcceptable(List list, GeneratorConfig config)
		{
			if (config.Lists.All)
			{
				if (config.Lists.ExcludeHidden && list.Hidden)
				{
					return false;
				}

				if (config.Lists.Exclude.Count > 0 && config.Lists.Exclude.Any(url => list.RootFolder.ServerRelativeUrl.IndexOf(url, StringComparison.OrdinalIgnoreCase) != -1))
				{
					return false;
				}

				return true;
			}

			if (config.Lists.Include.Count > 0)
			{
				return config.Lists.Include.Any(url => list.RootFolder.ServerRelativeUrl.IndexOf(url, StringComparison.OrdinalIgnoreCase) != -1);
			}

			return false;
		}

		public static bool IsFieldAcceptable(Field field, GeneratorConfig config)
		{
			var baseFieldsToExclude = new[] { "ID", "Modified", "Created", "Editor", "Author", "FSObjType", "Title", "FileLeafRef", "FileDirRef", "ContentTypeId" };

			if (!IsFieldTypeSupported(field.FieldTypeKind))
			{
				Debug.WriteLine("WARNING: Skipping field {0} because its field type '{1} not supported.'", field.InternalName, field.TypeAsString);
				return false;
			}

			if (baseFieldsToExclude.ToList().Any(f => f.Equals(field.InternalName)))
			{
				return false;
			}

			if (config.Fields.All)
			{
				if (config.Fields.ExcludeHidden && field.Hidden)
				{
					return false;
				}

				if (config.Fields.Exclude.Count > 0 && config.Fields.Exclude.Any(f => f.Equals(field.InternalName)))
				{
					return false;
				}

				return true;
			}

			if (config.Fields.Include.Count > 0)
			{
				return config.Fields.Include.Any(f => f.Equals(field.InternalName));
			}

			return false;
		}

		public static void CheckSchemaConsistency(GeneratorConfig config)
		{
			if (config.Lists == null)
			{
				throw new Exception("lists attribute is required");
			}

			if (config.Lists.All && config.Lists.Include.Count > 0)
			{
				throw new Exception("Lists config: provide only one of the two properties - either 'all' or 'include'");
			}

			if (config.Lists.Include.Count > 0 && (config.Lists.Exclude.Count > 0 || config.Lists.ExcludeHidden))
			{
				throw new Exception("Lists config: properties 'exclude' and 'excludeHidden' are redundant when 'include' provided");
			}

			if (config.Fields == null)
			{
				throw new Exception("fields attribute is required");
			}

			if (config.Fields.All && config.Fields.Include.Count > 0)
			{
				throw new Exception("Fields config: provide only one of the two properties - either 'all' or 'include'");
			}

			if (config.Fields.Include.Count > 0 && (config.Fields.Exclude.Count > 0 || config.Fields.ExcludeHidden))
			{
				throw new Exception("Fields config: properties 'exclude' and 'excludeHidden' are redundant when 'include' provided");
			}
		}

		public static string LowerCaseFirstLetter(string input)
		{
			return Char.ToLowerInvariant(input[0]) + input.Substring(1);
		}
	}
}
