using AssetManagement.Core.DTOs;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace AssetManagement.Tests.Services
{
    [TestFixture]
    public class EmployeeServiceTests
    {
        private AppDbContext _context;
        private EmployeeService _employeeService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _employeeService = new EmployeeService(_context);

            // Seed employee
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
        public async Task GetAllEmployees_ReturnsListOfEmployees()
        {
            // Act
            var result = await _employeeService.GetAllEmployees();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(1));
        }

        [Test]
        public async Task GetEmployeeById_ValidId_ReturnsEmployeeResponseDTO()
        {
            // Act
            var result = await _employeeService.GetEmployeeById(1);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo("John Doe"));
        }

        [Test]
        public async Task GetEmployeeById_InvalidId_ThrowsException()
        {
            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _employeeService.GetEmployeeById(999));

            Assert.That(ex.Message, Is.EqualTo("Employee not found."));
        }

        [Test]
        public async Task DeleteEmployee_ValidId_ReturnsTrue()
        {
            // Act
            var result = await _employeeService.DeleteEmployee(1);

            // Assert
            Assert.That(result, Is.True);
        }

        [Test]
        public async Task DeleteEmployee_InvalidId_ThrowsException()
        {
            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _employeeService.DeleteEmployee(999));

            Assert.That(ex.Message, Is.EqualTo("Employee not found."));
        }
    }
}