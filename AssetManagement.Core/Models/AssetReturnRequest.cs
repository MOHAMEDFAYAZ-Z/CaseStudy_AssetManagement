using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class AssetReturnRequest
    {
        [Key]
        public int ReturnRequestId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public DateTime RequestedAt { get; set; } = DateTime.Now;
        public DateTime? ApprovedAt { get; set; }

        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}