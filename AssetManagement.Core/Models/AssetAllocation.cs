using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class AssetAllocation
    {
        [Key]
        public int AllocationId { get; set; }
        public DateTime AllocatedDate { get; set; } = DateTime.Now;
        public DateTime? ReturnedDate { get; set; }
        public string Status { get; set; } = "Active";

        public int AssetId { get; set; }
        public Asset Asset { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}