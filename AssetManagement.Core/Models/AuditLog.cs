using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class AuditLog
    {
        [Key]
        public int AuditLogId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public DateTime PerformedAt { get; set; } = DateTime.Now;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}