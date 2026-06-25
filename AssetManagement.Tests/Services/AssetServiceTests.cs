using AssetManagement.Core.DTOs;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace AssetManagement.Tests.Services
{
    [TestFixture]
    public class AssetServiceTests
    {
        private AppDbContext _context;
        private AssetService _assetService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _assetService = new AssetService(_context);

            _context.AssetCategories.Add(new AssetCategory
            {
                CategoryId = 1,
                CategoryName = "Laptop"
            });
            _context.SaveChanges();
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task CreateAsset_ValidAsset_ReturnsAssetResponseDTO()
        {
            var createAssetDTO = new CreateAssetDTO
            {
                AssetNo = "ASSET001",
                AssetName = "Dell Laptop",
                AssetModel = "Dell Inspiron 15",
                ManufacturingDate = new DateTime(2023, 1, 1),
                ExpiryDate = new DateTime(2026, 1, 1),
                AssetValue = 75000,
                CategoryId = 1
            };

            var result = await _assetService.CreateAsset(createAssetDTO);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.AssetNo, Is.EqualTo("ASSET001"));
            Assert.That(result.Status, Is.EqualTo("Available"));
        }

        [Test]
        public async Task CreateAsset_DuplicateAssetNo_ThrowsException()
        {
            var createAssetDTO = new CreateAssetDTO
            {
                AssetNo = "ASSET001",
                AssetName = "Dell Laptop",
                AssetModel = "Dell Inspiron 15",
                ManufacturingDate = new DateTime(2023, 1, 1),
                ExpiryDate = new DateTime(2026, 1, 1),
                AssetValue = 75000,
                CategoryId = 1
            };

            await _assetService.CreateAsset(createAssetDTO);

            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _assetService.CreateAsset(createAssetDTO));

            Assert.That(ex.Message, Is.EqualTo("Asset number already exists."));
        }

        [Test]
        public async Task GetAssetById_ValidId_ReturnsAssetResponseDTO()
        {
            var createAssetDTO = new CreateAssetDTO
            {
                AssetNo = "ASSET001",
                AssetName = "Dell Laptop",
                AssetModel = "Dell Inspiron 15",
                ManufacturingDate = new DateTime(2023, 1, 1),
                ExpiryDate = new DateTime(2026, 1, 1),
                AssetValue = 75000,
                CategoryId = 1
            };

            var created = await _assetService.CreateAsset(createAssetDTO);

            var result = await _assetService.GetAssetById(created.AssetId);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.AssetId, Is.EqualTo(created.AssetId));
        }

        [Test]
        public async Task GetAssetById_InvalidId_ThrowsException()
        {
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _assetService.GetAssetById(999));

            Assert.That(ex.Message, Is.EqualTo("Asset not found."));
        }

        [Test]
        public async Task DeleteAsset_ValidId_ReturnsTrue()
        {
            var createAssetDTO = new CreateAssetDTO
            {
                AssetNo = "ASSET001",
                AssetName = "Dell Laptop",
                AssetModel = "Dell Inspiron 15",
                ManufacturingDate = new DateTime(2023, 1, 1),
                ExpiryDate = new DateTime(2026, 1, 1),
                AssetValue = 75000,
                CategoryId = 1
            };

            var created = await _assetService.CreateAsset(createAssetDTO);

            var result = await _assetService.DeleteAsset(created.AssetId);

            Assert.That(result, Is.True);
        }

        [Test]
        public async Task DeleteAsset_InvalidId_ThrowsException()
        {
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _assetService.DeleteAsset(999));

            Assert.That(ex.Message, Is.EqualTo("Asset not found."));
        }

        [Test]
        public async Task GetAllAssets_ReturnsListOfAssets()
        {
            var createAssetDTO = new CreateAssetDTO
            {
                AssetNo = "ASSET001",
                AssetName = "Dell Laptop",
                AssetModel = "Dell Inspiron 15",
                ManufacturingDate = new DateTime(2023, 1, 1),
                ExpiryDate = new DateTime(2026, 1, 1),
                AssetValue = 75000,
                CategoryId = 1
            };

            await _assetService.CreateAsset(createAssetDTO);

            // Act
            var result = await _assetService.GetAllAssets();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
        }

        [Test]
        public async Task SearchAssets_ByKeyword_ReturnsMatchingAssets()
        {
            // Arrange
            var createAssetDTO = new CreateAssetDTO
            {
                AssetNo = "ASSET001",
                AssetName = "Dell Laptop",
                AssetModel = "Dell Inspiron 15",
                ManufacturingDate = new DateTime(2023, 1, 1),
                ExpiryDate = new DateTime(2026, 1, 1),
                AssetValue = 75000,
                CategoryId = 1
            };

            await _assetService.CreateAsset(createAssetDTO);

            // Act
            var result = await _assetService.SearchAssets("Dell", null);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
        }
    }
}