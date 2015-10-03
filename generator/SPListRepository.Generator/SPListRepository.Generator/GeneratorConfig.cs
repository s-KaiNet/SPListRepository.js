using System.Collections.Generic;

namespace SPListRepository.Generator
{
	public class GeneratorConfig
	{
		public class Credentials
		{
			public string UserName { get; set; }
			public string Password { get; set; }
		}

		public class ListsConfig
		{
			public bool All { get; set; }
			public bool ExcludeHidden { get; set; }
			public List<string> Exclude { get; set; }
			public List<string> Include { get; set; }

			public ListsConfig()
			{
				Exclude = new List<string>();
				Include = new List<string>();
			}
		}

		public class FieldsConfig
		{
			public bool All { get; set; }
			public bool ExcludeHidden { get; set; }
			public List<string> Exclude { get; set; }
			public List<string> Include { get; set; }

			public FieldsConfig()
			{
				Exclude = new List<string>();
				Include = new List<string>();
			}
		}

		public string SiteUrl { get; set; }
		public string Namespace { get; set; }
		public Credentials Creds { get; set; }
		public ListsConfig Lists { get; set; }
		public FieldsConfig Fields { get; set; }
	}
}
