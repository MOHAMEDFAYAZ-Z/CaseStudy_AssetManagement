using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class AssetService : IAssetService
    {
        private readonly AppDbContext _context;

        public AssetService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AssetResponseDTO>> GetAllAssets()
        {
            try
            {
                return await _context.Assets
                    .Include(a => a.Category)
                    .Select(a => new AssetResponseDTO
                    {
                        AssetId = a.AssetId,
                        AssetNo = a.AssetNo,
                        AssetName = a.AssetName,
                        AssetModel = a.AssetModel,
                        ManufacturingDate = a.ManufacturingDate,
                        ExpiryDate = a.ExpiryDate,
                        AssetValue = a.AssetValue,
                        Status = a.Status,
                        CategoryName = a.Category.CategoryName
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssetResponseDTO> GetAssetById(int id)
        {
            try
            {
                var asset = await _context.Assets
                    .Include(a => a.Category)
                    .FirstOrDefaultAsync(a => a.AssetId == id);

                if (asset == null)
                    throw new Exception("Asset not found.");

                return new AssetResponseDTO
                {
                    AssetId = asset.AssetId,
                    AssetNo = asset.AssetNo,
                    AssetName = asset.AssetName,
                    AssetModel = asset.AssetModel,
                    ManufacturingDate = asset.ManufacturingDate,
                    ExpiryDate = asset.ExpiryDate,
                    AssetValue = asset.AssetValue,
                    Status = asset.Status,
                    CategoryName = asset.Category.CategoryName
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssetResponseDTO> CreateAsset(CreateAssetDTO createAssetDTO)
        {
            try
            {
                var existingAsset = await _context.Assets
                    .FirstOrDefaultAsync(a => a.AssetNo == createAssetDTO.AssetNo);

                if (existingAsset != null)
                    throw new Exception("Asset number already exists.");

                var asset = new Asset
                {
                    AssetNo = createAssetDTO.AssetNo,
                    AssetName = createAssetDTO.AssetName,
                    AssetModel = createAssetDTO.AssetModel,
                    ManufacturingDate = createAssetDTO.ManufacturingDate,
                    ExpiryDate = createAssetDTO.ExpiryDate,
                    AssetValue = createAssetDTO.AssetValue,
                    CategoryId = createAssetDTO.CategoryId,
                    Status = "Available"
                };

                _context.Assets.Add(asset);
                await _context.SaveChangesAsync();

                return await GetAssetById(asset.AssetId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AssetResponseDTO> UpdateAsset(int id, UpdateAssetDTO updateAssetDTO)
        {
            try
            {
                var asset = await _context.Assets.FindAsync(id);

                if (asset == null)
                    throw new Exception("Asset not found.");

                asset.AssetName = updateAssetDTO.AssetName;
                asset.AssetModel = updateAssetDTO.AssetModel;
                asset.ManufacturingDate = updateAssetDTO.ManufacturingDate;
                asset.ExpiryDate = updateAssetDTO.ExpiryDate;
                asset.AssetValue = updateAssetDTO.AssetValue;
                asset.CategoryId = updateAssetDTO.CategoryId;
                asset.Status = updateAssetDTO.Status;

                await _context.SaveChangesAsync();

                return await GetAssetById(asset.AssetId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteAsset(int id)
        {
            try
            {
                var asset = await _context.Assets.FindAsync(id);

                if (asset == null)
                    throw new Exception("Asset not found.");

                _context.Assets.Remove(asset);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<AssetResponseDTO>> SearchAssets(string? keyword, int? categoryId)
        {
            try
            {
                var query = _context.Assets
                    .Include(a => a.Category)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(keyword))
                    query = query.Where(a => a.AssetName.Contains(keyword) ||
                                             a.AssetNo.Contains(keyword));

                if (categoryId.HasValue)
                    query = query.Where(a => a.CategoryId == categoryId.Value);

                return await query.Select(a => new AssetResponseDTO
                {
                    AssetId = a.AssetId,
                    AssetNo = a.AssetNo,
                    AssetName = a.AssetName,
                    AssetModel = a.AssetModel,
                    ManufacturingDate = a.ManufacturingDate,
                    ExpiryDate = a.ExpiryDate,
                    AssetValue = a.AssetValue,
                    Status = a.Status,
                    CategoryName = a.Category.CategoryName
                }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<PagedResponse<AssetResponseDTO>> GetAssetsPaged(PaginationParams paginationParams)
        {
            try
            {
                var query = _context.Assets
                    .Include(a => a.Category)
                    .AsQueryable();

                var totalCount = await query.CountAsync();

                var assets = await query
                    .OrderBy(a => a.AssetId)
                    .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                    .Take(paginationParams.PageSize)
                    .Select(a => new AssetResponseDTO
                    {
                        AssetId = a.AssetId,
                        AssetNo = a.AssetNo,
                        AssetName = a.AssetName,
                        AssetModel = a.AssetModel,
                        ManufacturingDate = a.ManufacturingDate,
                        ExpiryDate = a.ExpiryDate,
                        AssetValue = a.AssetValue,
                        Status = a.Status,
                        CategoryName = a.Category.CategoryName
                    }).ToListAsync();

                var totalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize);

                return new PagedResponse<AssetResponseDTO>
                {
                    Data = assets,
                    PageNumber = paginationParams.PageNumber,
                    PageSize = paginationParams.PageSize,
                    TotalCount = totalCount,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}