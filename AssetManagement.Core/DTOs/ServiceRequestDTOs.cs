using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.DTOs
{
    public class CreateServiceRequestDTO
    {
        [Required(ErrorMessage = "Asset number is required.")]
        public string AssetNo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Issue type is required.")]
        [RegularExpression("^(Malfunction|Repair)$",
            ErrorMessage = "Issue type must be Malfunction or Repair.")]
        public string IssueType { get; set; } = string.Empty;
    }

    public class ServiceRequestResponseDTO
    {
        public int ServiceId { get; set; }
        public string AssetNo { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IssueType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}