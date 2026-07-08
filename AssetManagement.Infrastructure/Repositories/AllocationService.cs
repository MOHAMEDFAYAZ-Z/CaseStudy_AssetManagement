using AssetManagement.Core.DTOs;
using AssetManagement.Core.Exceptions;
using AssetManagement.Core.Interfaces;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class AllocationService : IAllocationService
    {
        private readonly AppDbContext _context;

        public AllocationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AllocationResponseDTO> RequestAsset(int userId, CreateAllocationDTO createAllocationDTO)
        {
            try
            {
                var asset = await _context.Assets
                    .FirstOrDefaultAsync(a => a.AssetId == createAllocationDTO.AssetId);

                if (asset == null)
                    throw new NotFoundException("Asset not found.");

                if (asset.Status != "Available")
                    throw new BadRequestException("Asset is not available for allocation.");

                var allocation = new AssetAllocation
                {
                    AssetId = createAllocationDTO.AssetId,
                    UserId = userId,
                    AllocatedDate = DateTime.Now,
                    Status = "Active"
                };

                asset.Status = "Allocated";

                _context.AssetAllocations.Add(allocation);
                await _context.SaveChangesAsync();

                return await GetAllocationById(allocation.AllocationId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<AllocationResponseDTO>> GetAllAllocations()
        {
            try
            {
                return await _context.AssetAllocations
                    .Include(a => a.Asset)
                    .Include(a => a.User)
                    .Select(a => new AllocationResponseDTO
                    {
                        AllocationId = a.AllocationId,
                        AssetId = a.Asset.AssetId,
                        AssetName = a.Asset.AssetName,
                        AssetNo = a.Asset.AssetNo,
                        ImageUrl = a.Asset.ImageUrl,
                        EmployeeName = a.User.Name,
                        EmployeeEmail = a.User.Email,
                        AllocatedDate = a.AllocatedDate,
                        ReturnedDate = a.ReturnedDate,
                        Status = a.Status
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<AllocationResponseDTO>> GetMyAllocations(int userId)
        {
            try
            {
                return await _context.AssetAllocations
                    .Include(a => a.Asset)
                    .Include(a => a.User)
                    .Where(a => a.UserId == userId)
                    .Select(a => new AllocationResponseDTO
                    {
                        AllocationId = a.AllocationId,
                        AssetId = a.Asset.AssetId,
                        AssetName = a.Asset.AssetName,
                        AssetNo = a.Asset.AssetNo,
                        ImageUrl = a.Asset.ImageUrl,
                        EmployeeName = a.User.Name,
                        EmployeeEmail = a.User.Email,
                        AllocatedDate = a.AllocatedDate,
                        ReturnedDate = a.ReturnedDate,
                        Status = a.Status
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AllocationResponseDTO> UpdateAllocationStatus(int id, string status)
        {
            try
            {
                var allocation = await _context.AssetAllocations
                    .Include(a => a.Asset)
                    .FirstOrDefaultAsync(a => a.AllocationId == id);

                if (allocation == null)
                    throw new NotFoundException("Asset not found.");

                allocation.Status = status;

                if (status == "Returned")
                {
                    allocation.ReturnedDate = DateTime.Now;
                    allocation.Asset.Status = "Available";
                }

                await _context.SaveChangesAsync();

                return await GetAllocationById(allocation.AllocationId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        private async Task<AllocationResponseDTO> GetAllocationById(int id)
        {
            try
            {
                var allocation = await _context.AssetAllocations
                    .Include(a => a.Asset)
                    .Include(a => a.User)
                    .FirstOrDefaultAsync(a => a.AllocationId == id);

                if (allocation == null)
                    throw new NotFoundException("Allocation not found.");

                return new AllocationResponseDTO
                {
                    AllocationId = allocation.AllocationId,
                    AssetId = allocation.Asset.AssetId,
                    AssetName = allocation.Asset.AssetName,
                    AssetNo = allocation.Asset.AssetNo,
                    ImageUrl = allocation.Asset.ImageUrl,
                    EmployeeName = allocation.User.Name,
                    EmployeeEmail = allocation.User.Email,
                    AllocatedDate = allocation.AllocatedDate,
                    ReturnedDate = allocation.ReturnedDate,
                    Status = allocation.Status
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}