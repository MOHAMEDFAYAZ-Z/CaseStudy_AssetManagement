using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class ServiceRequest
    {
        [Key]
        public int ServiceId { get; set; }
        public string AssetNo { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IssueType { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}