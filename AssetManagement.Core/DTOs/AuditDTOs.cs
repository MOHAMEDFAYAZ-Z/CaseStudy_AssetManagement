using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.DTOs
{
    public class CreateAuditRequestDTO
    {
        [Required(ErrorMessage = "Asset ID is required.")]
        public int AssetId { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; }
    }

    public class AuditResponseDTO
    {
        public int AuditId { get; set; }
        public string AssetName { get; set; } = string.Empty;
        public string AssetNo { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public DateTime? RespondedAt { get; set; }
    }
}