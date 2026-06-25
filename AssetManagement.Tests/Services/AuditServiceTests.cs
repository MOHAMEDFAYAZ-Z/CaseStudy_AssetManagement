using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace AssetManagement.Tests.Services
{
    [TestFixture]
    public class AuditServiceTests
    {
        private AppDbContext _context;
        private AuditService _auditService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _auditService = new AuditService(_context);

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
        public async Task SendAuditToAll_ReturnsAuditList()
        {
            // Act
            var result = await _auditService.SendAuditToAll();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
        }

        [Test]
        public async Task GetAllAudits_ReturnsAuditList()
        {
            // Arrange
            await _auditService.SendAuditToAll();

            // Act
            var result = await _auditService.GetAllAudits();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
        }

        [Test]
        public async Task RespondToAudit_ValidId_ReturnsUpdatedAudit()
        {
            // Arrange
            await _auditService.SendAuditToAll();
            var audits = await _auditService.GetAllAudits();
            var auditId = audits[0].AuditId;

            // Act
            var result = await _auditService.RespondToAudit(auditId, "Verified");

            // Assert
            Assert.That(result.Status, Is.EqualTo("Verified"));
        }

        [Test]
        public async Task RespondToAudit_InvalidId_ThrowsException()
        {
            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _auditService.RespondToAudit(999, "Verified"));

            Assert.That(ex.Message, Is.EqualTo("Audit request not found."));
        }
    }
}