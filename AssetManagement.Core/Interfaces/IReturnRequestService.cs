using AssetManagement.Core.DTOs;

namespace AssetManagement.Core.Interfaces
{
    public interface IReturnRequestService
    {
        Task<ReturnRequestResponseDTO> CreateReturnRequest(int userId, CreateReturnRequestDTO dto);
        Task<List<ReturnRequestResponseDTO>> GetAllReturnRequests();
        Task<List<ReturnRequestResponseDTO>> GetMyReturnRequests(int userId);
        Task<ReturnRequestResponseDTO> UpdateReturnRequestStatus(int id, string status);
    }
}