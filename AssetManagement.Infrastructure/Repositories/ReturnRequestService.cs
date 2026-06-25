using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class ReturnRequestService : IReturnRequestService
    {
        private readonly AppDbContext _context;

        public ReturnRequestService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ReturnRequestResponseDTO> CreateReturnRequest(int userId, CreateReturnRequestDTO dto)
        {
            try
            {
                var asset = await _context.Assets
                    .FirstOrDefaultAsync(a => a.AssetId == dto.AssetId);

                if (asset == null)
                    throw new Exception("Asset not found.");

                var allocation = await _context.AssetAllocations
                    .FirstOrDefaultAsync(a => a.AssetId == dto.AssetId
                        && a.UserId == userId
                        && a.Status == "Active");

                if (allocation == null)
                    throw new Exception("No active allocation found for this asset.");

                var returnRequest = new AssetReturnRequest
                {
                    AssetId = dto.AssetId,
                    UserId = userId,
                    Reason = dto.Reason,
                    Status = "Pending",
                    RequestedAt = DateTime.Now
                };

                _context.AssetReturnRequests.Add(returnRequest);
                await _context.SaveChangesAsync();

                return await GetReturnRequestById(returnRequest.ReturnRequestId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<ReturnRequestResponseDTO>> GetAllReturnRequests()
        {
            try
            {
                return await _context.AssetReturnRequests
                    .Include(r => r.Asset)
                    .Include(r => r.User)
                    .Select(r => new ReturnRequestResponseDTO
                    {
                        ReturnRequestId = r.ReturnRequestId,
                        AssetName = r.Asset.AssetName,
                        AssetNo = r.Asset.AssetNo,
                        EmployeeName = r.User.Name,
                        Reason = r.Reason,
                        Status = r.Status,
                        RequestedAt = r.RequestedAt,
                        ApprovedAt = r.ApprovedAt
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<ReturnRequestResponseDTO>> GetMyReturnRequests(int userId)
        {
            try
            {
                return await _context.AssetReturnRequests
                    .Include(r => r.Asset)
                    .Include(r => r.User)
                    .Where(r => r.UserId == userId)
                    .Select(r => new ReturnRequestResponseDTO
                    {
                        ReturnRequestId = r.ReturnRequestId,
                        AssetName = r.Asset.AssetName,
                        AssetNo = r.Asset.AssetNo,
                        EmployeeName = r.User.Name,
                        Reason = r.Reason,
                        Status = r.Status,
                        RequestedAt = r.RequestedAt,
                        ApprovedAt = r.ApprovedAt
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ReturnRequestResponseDTO> UpdateReturnRequestStatus(int id, string status)
        {
            try
            {
                var returnRequest = await _context.AssetReturnRequests
                    .Include(r => r.Asset)
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.ReturnRequestId == id);

                if (returnRequest == null)
                    throw new Exception("Return request not found.");

                returnRequest.Status = status;

                if (status == "Approved")
                {
                    returnRequest.ApprovedAt = DateTime.Now;
                    returnRequest.Asset.Status = "Available";

                    var allocation = await _context.AssetAllocations
                        .FirstOrDefaultAsync(a => a.AssetId == returnRequest.AssetId
                            && a.UserId == returnRequest.UserId
                            && a.Status == "Active");

                    if (allocation != null)
                    {
                        allocation.Status = "Returned";
                        allocation.ReturnedDate = DateTime.Now;
                    }
                }

                await _context.SaveChangesAsync();
                return await GetReturnRequestById(returnRequest.ReturnRequestId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private async Task<ReturnRequestResponseDTO> GetReturnRequestById(int id)
        {
            try
            {
                var returnRequest = await _context.AssetReturnRequests
                    .Include(r => r.Asset)
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.ReturnRequestId == id);

                if (returnRequest == null)
                    throw new Exception("Return request not found.");

                return new ReturnRequestResponseDTO
                {
                    ReturnRequestId = returnRequest.ReturnRequestId,
                    AssetName = returnRequest.Asset.AssetName,
                    AssetNo = returnRequest.Asset.AssetNo,
                    EmployeeName = returnRequest.User.Name,
                    Reason = returnRequest.Reason,
                    Status = returnRequest.Status,
                    RequestedAt = returnRequest.RequestedAt,
                    ApprovedAt = returnRequest.ApprovedAt
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}