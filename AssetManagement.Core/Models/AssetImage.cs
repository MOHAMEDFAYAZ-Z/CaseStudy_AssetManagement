using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class AssetImage
    {
        [Key]
        public int ImageId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.Now;

        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;
    }
}