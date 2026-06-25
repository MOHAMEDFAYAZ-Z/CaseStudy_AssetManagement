using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class AuditRequest
    {
        [Key]
        public int AuditId { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime SentAt { get; set; } = DateTime.Now;
        public DateTime? RespondedAt { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;
    }
}