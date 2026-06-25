using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.DTOs
{
    public class CreateReturnRequestDTO
    {
        [Required(ErrorMessage = "Asset ID is required.")]
        public int AssetId { get; set; }

        [Required(ErrorMessage = "Reason is required.")]
        public string Reason { get; set; } = string.Empty;
    }

    public class ReturnRequestResponseDTO
    {
        public int ReturnRequestId { get; set; }
        public string AssetName { get; set; } = string.Empty;
        public string AssetNo { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
    }
}