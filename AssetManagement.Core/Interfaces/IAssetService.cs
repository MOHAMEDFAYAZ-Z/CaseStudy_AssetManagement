using AssetManagement.Core.DTOs;

namespace AssetManagement.Core.Interfaces
{
    public interface IAssetService
    {
        Task<List<AssetResponseDTO>> GetAllAssets();
        Task<AssetResponseDTO> GetAssetById(int id);
        Task<AssetResponseDTO> CreateAsset(CreateAssetDTO createAssetDTO);
        Task<AssetResponseDTO> UpdateAsset(int id, UpdateAssetDTO updateAssetDTO);
        Task<bool> DeleteAsset(int id);
        Task<List<AssetResponseDTO>> SearchAssets(string? keyword, int? categoryId);
        Task<PagedResponse<AssetResponseDTO>> GetAssetsPaged(PaginationParams paginationParams);
    }
}