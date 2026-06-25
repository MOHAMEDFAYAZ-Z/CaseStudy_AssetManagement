using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Employee";
        public string Gender { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int? DepartmentId { get; set; }
        public Department? Department { get; set; }

        public ICollection<AssetAllocation> Allocations { get; set; } = new List<AssetAllocation>();
        public ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
        public ICollection<AuditRequest> AuditRequests { get; set; } = new List<AuditRequest>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<AssetReturnRequest> ReturnRequests { get; set; } = new List<AssetReturnRequest>();
        public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    }
}