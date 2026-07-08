using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class Asset
    {
        [Key]
        public int AssetId { get; set; }
        public string AssetNo { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string AssetModel { get; set; } = string.Empty;
        public DateTime ManufacturingDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal AssetValue { get; set; }
        public string Status { get; set; } = "Available";
        public string ImageUrl { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public AssetCategory Category { get; set; } = null!;

        public ICollection<AssetAllocation> Allocations { get; set; } = new List<AssetAllocation>();
        public ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
        public ICollection<AuditRequest> AuditRequests { get; set; } = new List<AuditRequest>();
        public ICollection<AssetImage> Images { get; set; } = new List<AssetImage>();
        public ICollection<AssetMaintenanceLog> MaintenanceLogs { get; set; } = new List<AssetMaintenanceLog>();
        public ICollection<AssetReturnRequest> ReturnRequests { get; set; } = new List<AssetReturnRequest>();
    }
}