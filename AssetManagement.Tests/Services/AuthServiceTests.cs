using AssetManagement.Core.DTOs;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace AssetManagement.Tests.Services
{
    [TestFixture]
    public class AuthServiceTests
    {
        private AppDbContext _context;
        private AuthService _authService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _authService = new AuthService(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task Register_ValidUser_ReturnsAuthResponseDTO()
        {
            // Arrange
            var registerDTO = new RegisterDTO
            {
                Name = "John Doe",
                Email = "john@hexaware.com",
                Password = "John@123",
                Gender = "Male",
                ContactNumber = "9876543210",
                Address = "Chennai"
            };

            // Act
            var result = await _authService.Register(registerDTO);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Email, Is.EqualTo("john@hexaware.com"));
            Assert.That(result.Role, Is.EqualTo("Employee"));
        }

        [Test]
        public async Task Register_DuplicateEmail_ThrowsException()
        {
            // Arrange
            var registerDTO = new RegisterDTO
            {
                Name = "John Doe",
                Email = "john@hexaware.com",
                Password = "John@123",
                Gender = "Male",
                ContactNumber = "9876543210",
                Address = "Chennai"
            };

            await _authService.Register(registerDTO);

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _authService.Register(registerDTO));

            Assert.That(ex.Message, Is.EqualTo("Email already registered."));
        }

        [Test]
        public async Task Login_ValidCredentials_ReturnsAuthResponseDTO()
        {
            // Arrange
            var registerDTO = new RegisterDTO
            {
                Name = "John Doe",
                Email = "john@hexaware.com",
                Password = "John@123",
                Gender = "Male",
                ContactNumber = "9876543210",
                Address = "Chennai"
            };

            await _authService.Register(registerDTO);

            var loginDTO = new LoginDTO
            {
                Email = "john@hexaware.com",
                Password = "John@123"
            };

            // Act
            var result = await _authService.Login(loginDTO);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Email, Is.EqualTo("john@hexaware.com"));
        }

        [Test]
        public async Task Login_InvalidEmail_ThrowsException()
        {
            // Arrange
            var loginDTO = new LoginDTO
            {
                Email = "wrong@hexaware.com",
                Password = "John@123"
            };

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _authService.Login(loginDTO));

            Assert.That(ex.Message, Is.EqualTo("Invalid email or password."));
        }

        [Test]
        public async Task Login_InvalidPassword_ThrowsException()
        {
            // Arrange
            var registerDTO = new RegisterDTO
            {
                Name = "John Doe",
                Email = "john@hexaware.com",
                Password = "John@123",
                Gender = "Male",
                ContactNumber = "9876543210",
                Address = "Chennai"
            };

            await _authService.Register(registerDTO);

            var loginDTO = new LoginDTO
            {
                Email = "john@hexaware.com",
                Password = "WrongPassword"
            };

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _authService.Login(loginDTO));

            Assert.That(ex.Message, Is.EqualTo("Invalid email or password."));
        }
    }
}