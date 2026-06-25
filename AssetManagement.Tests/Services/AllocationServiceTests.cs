using AssetManagement.Core.DTOs;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace AssetManagement.Tests.Services
{
    [TestFixture]
    public class AllocationServiceTests
    {
        private AppDbContext _context;
        private AllocationService _allocationService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _allocationService = new AllocationService(_context);

            
            _context.AssetCategories.Add(new AssetCategory { CategoryId = 1, CategoryName = "Laptop" });
            _context.Assets.Add(new Asset
            {
                AssetId = 1,
                AssetNo = "ASSET001",
                AssetName = "Dell Laptop",
                AssetModel = "Dell Inspiron",
                ManufacturingDate = new DateTime(2023, 1, 1),
                ExpiryDate = new DateTime(2026, 1, 1),
                AssetValue = 75000,
                Status = "Available",
                CategoryId = 1
            });
            _context.Users.Add(new User
            {
                UserId = 1,
                Name = "John Doe",
                Email = "john@hexaware.com",
                PasswordHash = "hashedpassword",
                Role = "Employee",
                Gender = "Male",
                ContactNumber = "9876543210",
                Address = "Chennai",
                CreatedAt = DateTime.Now
            });
            _context.SaveChanges();
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task RequestAsset_ValidRequest_ReturnsAllocationResponseDTO()
        {
            
            var createAllocationDTO = new CreateAllocationDTO { AssetId = 1 };

            
            var result = await _allocationService.RequestAsset(1, createAllocationDTO);

            
            Assert.That(result, Is.Not.Null);
            Assert.That(result.AssetNo, Is.EqualTo("ASSET001"));
            Assert.That(result.Status, Is.EqualTo("Active"));
        }

        [Test]
        public async Task RequestAsset_AssetNotAvailable_ThrowsException()
        {
            
            var createAllocationDTO = new CreateAllocationDTO { AssetId = 1 };
            await _allocationService.RequestAsset(1, createAllocationDTO);

            
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _allocationService.RequestAsset(1, createAllocationDTO));

            Assert.That(ex.Message, Is.EqualTo("Asset is not available for allocation."));
        }

        [Test]
        public async Task RequestAsset_InvalidAssetId_ThrowsException()
        {
            var createAllocationDTO = new CreateAllocationDTO { AssetId = 999 };

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _allocationService.RequestAsset(1, createAllocationDTO));

            Assert.That(ex.Message, Is.EqualTo("Asset not found."));
        }

        [Test]
        public async Task GetAllAllocations_ReturnsListOfAllocations()
        {
            await _allocationService.RequestAsset(1, new CreateAllocationDTO { AssetId = 1 });

            var result = await _allocationService.GetAllAllocations();

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
        }

        [Test]
        public async Task GetMyAllocations_ValidUserId_ReturnsAllocations()
        {
            await _allocationService.RequestAsset(1, new CreateAllocationDTO { AssetId = 1 });

            var result = await _allocationService.GetMyAllocations(1);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
        }
    }
}