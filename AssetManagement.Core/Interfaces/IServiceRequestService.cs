using AssetManagement.Core.DTOs;

namespace AssetManagement.Core.Interfaces
{
    public interface IServiceRequestService
    {
        Task<ServiceRequestResponseDTO> CreateServiceRequest(int userId, CreateServiceRequestDTO dto);
        Task<List<ServiceRequestResponseDTO>> GetAllServiceRequests();
        Task<List<ServiceRequestResponseDTO>> GetMyServiceRequests(int userId);
        Task<ServiceRequestResponseDTO> UpdateServiceRequestStatus(int id, string status);
    }
}