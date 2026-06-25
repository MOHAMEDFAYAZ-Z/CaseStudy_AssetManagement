using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.DTOs
{
    public class CreateAllocationDTO
    {
        [Required(ErrorMessage = "Asset ID is required.")]
        public int AssetId { get; set; }
    }

    public class AllocationResponseDTO
    {
        public int AllocationId { get; set; }
        public string AssetName { get; set; } = string.Empty;
        public string AssetNo { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeEmail { get; set; } = string.Empty;
        public DateTime AllocatedDate { get; set; }
        public DateTime? ReturnedDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}