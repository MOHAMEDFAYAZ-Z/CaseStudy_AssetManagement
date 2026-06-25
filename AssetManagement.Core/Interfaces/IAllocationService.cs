using AssetManagement.Core.DTOs;

namespace AssetManagement.Core.Interfaces
{
    public interface IAllocationService
    {
        Task<AllocationResponseDTO> RequestAsset(int userId, CreateAllocationDTO createAllocationDTO);
        Task<List<AllocationResponseDTO>> GetAllAllocations();
        Task<List<AllocationResponseDTO>> GetMyAllocations(int userId);
        Task<AllocationResponseDTO> UpdateAllocationStatus(int id, string status);
    }
}