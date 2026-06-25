using AssetManagement.Core.DTOs;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace AssetManagement.Tests.Services
{
    [TestFixture]
    public class ReturnRequestServiceTests
    {
        private AppDbContext _context;
        private ReturnRequestService _returnRequestService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _returnRequestService = new ReturnRequestService(_context);

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
                Status = "Allocated",
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
            _context.AssetAllocations.Add(new AssetAllocation
            {
                AllocationId = 1,
                AssetId = 1,
                UserId = 1,
                AllocatedDate = DateTime.Now,
                Status = "Active"
            });
            _context.SaveChanges();
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task CreateReturnRequest_ValidRequest_ReturnsReturnRequestResponseDTO()
        {
            // Arrange
            var dto = new CreateReturnRequestDTO
            {
                AssetId = 1,
                Reason = "No longer needed"
            };

            // Act
            var result = await _returnRequestService.CreateReturnRequest(1, dto);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Status, Is.EqualTo("Pending"));
        }

        [Test]
        public async Task CreateReturnRequest_InvalidAssetId_ThrowsException()
        {
            // Arrange
            var dto = new CreateReturnRequestDTO
            {
                AssetId = 999,
                Reason = "No longer needed"
            };

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _returnRequestService.CreateReturnRequest(1, dto));

            Assert.That(ex.Message, Is.EqualTo("Asset not found."));
        }

        [Test]
        public async Task GetAllReturnRequests_ReturnsListOfReturnRequests()
        {
            // Arrange
            await _returnRequestService.CreateReturnRequest(1, new CreateReturnRequestDTO
            {
                AssetId = 1,
                Reason = "No longer needed"
            });

            // Act
            var result = await _returnRequestService.GetAllReturnRequests();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
        }

        [Test]
        public async Task UpdateReturnRequestStatus_Approved_AssetBecomesAvailable()
        {
            // Arrange
            var created = await _returnRequestService.CreateReturnRequest(1, new CreateReturnRequestDTO
            {
                AssetId = 1,
                Reason = "No longer needed"
            });

            // Act
            var result = await _returnRequestService.UpdateReturnRequestStatus(created.ReturnRequestId, "Approved");

            // Assert
            Assert.That(result.Status, Is.EqualTo("Approved"));

            var asset = await _context.Assets.FindAsync(1);
            Assert.That(asset!.Status, Is.EqualTo("Available"));
        }
    }
}