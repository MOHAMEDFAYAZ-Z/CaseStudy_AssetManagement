using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class AuditService : IAuditService
    {
        private readonly AppDbContext _context;

        public AuditService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AuditResponseDTO>> SendAuditToAll()
        {
            try
            {
                var allocations = await _context.AssetAllocations
                    .Include(a => a.Asset)
                    .Include(a => a.User)
                    .Where(a => a.Status == "Active")
                    .ToListAsync();

                foreach (var allocation in allocations)
                {
                    var existingAudit = await _context.AuditRequests
                        .FirstOrDefaultAsync(a => a.AssetId == allocation.AssetId
                            && a.UserId == allocation.UserId
                            && a.Status == "Pending");

                    if (existingAudit == null)
                    {
                        _context.AuditRequests.Add(new AuditRequest
                        {
                            AssetId = allocation.AssetId,
                            UserId = allocation.UserId,
                            Status = "Pending",
                            SentAt = DateTime.Now
                        });
                    }
                }

                await _context.SaveChangesAsync();
                return await GetAllAudits();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<AuditResponseDTO>> GetAllAudits()
        {
            try
            {
                return await _context.AuditRequests
                    .Include(a => a.Asset)
                    .Include(a => a.User)
                    .Select(a => new AuditResponseDTO
                    {
                        AuditId = a.AuditId,
                        AssetName = a.Asset.AssetName,
                        AssetNo = a.Asset.AssetNo,
                        EmployeeName = a.User.Name,
                        Status = a.Status,
                        SentAt = a.SentAt,
                        RespondedAt = a.RespondedAt
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<AuditResponseDTO>> GetMyAudits(int userId)
        {
            try
            {
                return await _context.AuditRequests
                    .Include(a => a.Asset)
                    .Include(a => a.User)
                    .Where(a => a.UserId == userId)
                    .Select(a => new AuditResponseDTO
                    {
                        AuditId = a.AuditId,
                        AssetName = a.Asset.AssetName,
                        AssetNo = a.Asset.AssetNo,
                        EmployeeName = a.User.Name,
                        Status = a.Status,
                        SentAt = a.SentAt,
                        RespondedAt = a.RespondedAt
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AuditResponseDTO> RespondToAudit(int auditId, string status)
        {
            try
            {
                var audit = await _context.AuditRequests
                    .Include(a => a.Asset)
                    .Include(a => a.User)
                    .FirstOrDefaultAsync(a => a.AuditId == auditId);

                if (audit == null)
                    throw new Exception("Audit request not found.");

                audit.Status = status;
                audit.RespondedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return new AuditResponseDTO
                {
                    AuditId = audit.AuditId,
                    AssetName = audit.Asset.AssetName,
                    AssetNo = audit.Asset.AssetNo,
                    EmployeeName = audit.User.Name,
                    Status = audit.Status,
                    SentAt = audit.SentAt,
                    RespondedAt = audit.RespondedAt
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}