using AssetManagement.Core.DTOs;

namespace AssetManagement.Core.Interfaces
{
    public interface IAuditService
    {
        Task<List<AuditResponseDTO>> SendAuditToAll();
        Task<List<AuditResponseDTO>> GetAllAudits();
        Task<List<AuditResponseDTO>> GetMyAudits(int userId);
        Task<AuditResponseDTO> RespondToAudit(int auditId, string status);
    }
}