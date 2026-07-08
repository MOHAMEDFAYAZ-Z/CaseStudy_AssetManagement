using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.DTOs
{
    public class CreateAssetDTO
    {
        [Required(ErrorMessage = "Asset number is required.")]
        public string AssetNo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Asset name is required.")]
        public string AssetName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Asset model is required.")]
        public string AssetModel { get; set; } = string.Empty;

        [Required(ErrorMessage = "Manufacturing date is required.")]
        public DateTime ManufacturingDate { get; set; }

        [Required(ErrorMessage = "Expiry date is required.")]
        public DateTime ExpiryDate { get; set; }

        [Required(ErrorMessage = "Asset value is required.")]
        [Range(1, double.MaxValue, ErrorMessage = "Asset value must be greater than 0.")]
        public decimal AssetValue { get; set; }

        [Required(ErrorMessage = "Category is required.")]
        public int CategoryId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class UpdateAssetDTO
    {
        [Required(ErrorMessage = "Asset name is required.")]
        public string AssetName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Asset model is required.")]
        public string AssetModel { get; set; } = string.Empty;

        public DateTime ManufacturingDate { get; set; }
        public DateTime ExpiryDate { get; set; }

        [Range(1, double.MaxValue, ErrorMessage = "Asset value must be greater than 0.")]
        public decimal AssetValue { get; set; }

        public int CategoryId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class AssetResponseDTO
    {
        public int AssetId { get; set; }
        public string AssetNo { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string AssetModel { get; set; } = string.Empty;
        public DateTime ManufacturingDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public decimal AssetValue { get; set; }
        public string Status { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }
}