using AssetManagement.Core.DTOs;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace AssetManagement.Tests.Services
{
    [TestFixture]
    public class ServiceRequestServiceTests
    {
        private AppDbContext _context;
        private ServiceRequestService _serviceRequestService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _serviceRequestService = new ServiceRequestService(_context);

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
        public async Task CreateServiceRequest_ValidRequest_ReturnsServiceRequestResponseDTO()
        {
            // Arrange
            var dto = new CreateServiceRequestDTO
            {
                AssetNo = "ASSET001",
                Description = "Screen flickering",
                IssueType = "Malfunction"
            };

            // Act
            var result = await _serviceRequestService.CreateServiceRequest(1, dto);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Status, Is.EqualTo("Pending"));
            Assert.That(result.IssueType, Is.EqualTo("Malfunction"));
        }

        [Test]
        public async Task CreateServiceRequest_InvalidAssetNo_ThrowsException()
        {
            // Arrange
            var dto = new CreateServiceRequestDTO
            {
                AssetNo = "INVALID",
                Description = "Screen flickering",
                IssueType = "Malfunction"
            };

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _serviceRequestService.CreateServiceRequest(1, dto));

            Assert.That(ex.Message, Is.EqualTo("Asset not found."));
        }

        [Test]
        public async Task GetAllServiceRequests_ReturnsListOfServiceRequests()
        {
            // Arrange
            await _serviceRequestService.CreateServiceRequest(1, new CreateServiceRequestDTO
            {
                AssetNo = "ASSET001",
                Description = "Screen flickering",
                IssueType = "Malfunction"
            });

            // Act
            var result = await _serviceRequestService.GetAllServiceRequests();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
        }

        [Test]
        public async Task UpdateServiceRequestStatus_ValidId_ReturnsUpdatedRequest()
        {
            // Arrange
            var created = await _serviceRequestService.CreateServiceRequest(1, new CreateServiceRequestDTO
            {
                AssetNo = "ASSET001",
                Description = "Screen flickering",
                IssueType = "Malfunction"
            });

            // Act
            var result = await _serviceRequestService.UpdateServiceRequestStatus(created.ServiceId, "Resolved");

            // Assert
            Assert.That(result.Status, Is.EqualTo("Resolved"));
        }
    }
}