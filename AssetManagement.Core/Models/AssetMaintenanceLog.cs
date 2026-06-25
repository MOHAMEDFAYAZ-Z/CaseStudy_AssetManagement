using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class AssetMaintenanceLog
    {
        [Key]
        public int MaintenanceId { get; set; }
        public string MaintenanceType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime MaintenanceDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "Completed";
        public decimal MaintenanceCost { get; set; }

        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;
    }
}