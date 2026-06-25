using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class AssetCategory
    {
        [Key]
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public ICollection<Asset> Assets { get; set; } = new List<Asset>();
    }
}