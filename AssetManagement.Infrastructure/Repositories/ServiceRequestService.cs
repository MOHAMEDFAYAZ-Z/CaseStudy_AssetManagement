using AssetManagement.Core.DTOs;
using AssetManagement.Core.Exceptions;
using AssetManagement.Core.Interfaces;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class ServiceRequestService : IServiceRequestService
    {
        private readonly AppDbContext _context;

        public ServiceRequestService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceRequestResponseDTO> CreateServiceRequest(int userId, CreateServiceRequestDTO dto)
        {
            try
            {
                var asset = await _context.Assets
                    .FirstOrDefaultAsync(a => a.AssetNo == dto.AssetNo);

                if (asset == null)
                    throw new NotFoundException("Asset not found.");

                // Check if asset already has pending service request
                var existingRequest = await _context.ServiceRequests
                    .FirstOrDefaultAsync(s => s.AssetNo == dto.AssetNo
                        && s.Status == "Pending" || s.Status == "InProgress");

                if (existingRequest != null)
                    throw new BadRequestException("Asset already has an active service request.");

                var serviceRequest = new ServiceRequest
                {
                    AssetNo = dto.AssetNo,
                    Description = dto.Description,
                    IssueType = dto.IssueType,
                    Status = "Pending",
                    CreatedAt = DateTime.Now,
                    AssetId = asset.AssetId,
                    UserId = userId
                };

                asset.Status = "InService";

                _context.ServiceRequests.Add(serviceRequest);
                await _context.SaveChangesAsync();

                return await GetServiceRequestById(serviceRequest.ServiceId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<ServiceRequestResponseDTO>> GetAllServiceRequests()
        {
            try
            {
                return await _context.ServiceRequests
                    .Include(s => s.Asset)
                    .Include(s => s.User)
                    .Select(s => new ServiceRequestResponseDTO
                    {
                        ServiceId = s.ServiceId,
                        AssetNo = s.AssetNo,
                        ImageUrl = s.Asset.ImageUrl,
                        AssetName = s.Asset.AssetName,
                        Description = s.Description,
                        IssueType = s.IssueType,
                        Status = s.Status,
                        EmployeeName = s.User.Name,
                        CreatedAt = s.CreatedAt
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<ServiceRequestResponseDTO>> GetMyServiceRequests(int userId)
        {
            try
            {
                return await _context.ServiceRequests
                    .Include(s => s.Asset)
                    .Include(s => s.User)
                    .Where(s => s.UserId == userId)
                    .Select(s => new ServiceRequestResponseDTO
                    {
                        ServiceId = s.ServiceId,
                        AssetNo = s.AssetNo,
                        ImageUrl = s.Asset.ImageUrl,
                        AssetName = s.Asset.AssetName,
                        Description = s.Description,
                        IssueType = s.IssueType,
                        Status = s.Status,
                        EmployeeName = s.User.Name,
                        CreatedAt = s.CreatedAt
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ServiceRequestResponseDTO> UpdateServiceRequestStatus(int id, string status)
        {
            try
            {
                var serviceRequest = await _context.ServiceRequests
                    .Include(s => s.Asset)
                    .FirstOrDefaultAsync(s => s.ServiceId == id);

                if (serviceRequest == null)
                    throw new NotFoundException("Service request not found.");

                serviceRequest.Status = status;

                if (status == "Resolved")
                    serviceRequest.Asset.Status = "Available";

                await _context.SaveChangesAsync();

                return await GetServiceRequestById(serviceRequest.ServiceId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private async Task<ServiceRequestResponseDTO> GetServiceRequestById(int id)
        {
            try
            {
                var serviceRequest = await _context.ServiceRequests
                    .Include(s => s.Asset)
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.ServiceId == id);

                if (serviceRequest == null)
                    throw new NotFoundException("Service request not found.");

                return new ServiceRequestResponseDTO
                {
                    ServiceId = serviceRequest.ServiceId,
                    AssetNo = serviceRequest.AssetNo,
                    ImageUrl = serviceRequest.Asset.ImageUrl,
                    AssetName = serviceRequest.Asset.AssetName,
                    Description = serviceRequest.Description,
                    IssueType = serviceRequest.IssueType,
                    Status = serviceRequest.Status,
                    EmployeeName = serviceRequest.User.Name,
                    CreatedAt = serviceRequest.CreatedAt
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}