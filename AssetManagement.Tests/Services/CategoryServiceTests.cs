using AssetManagement.Core.DTOs;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace AssetManagement.Tests.Services
{
    [TestFixture]
    public class CategoryServiceTests
    {
        private AppDbContext _context;
        private CategoryService _categoryService;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _categoryService = new CategoryService(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task CreateCategory_ValidCategory_ReturnsCategoryResponseDTO()
        {
            // Arrange
            var createCategoryDTO = new CreateCategoryDTO
            {
                CategoryName = "Laptop"
            };

            // Act
            var result = await _categoryService.CreateCategory(createCategoryDTO);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.CategoryName, Is.EqualTo("Laptop"));
        }

        [Test]
        public async Task CreateCategory_DuplicateName_ThrowsException()
        {
            // Arrange
            var createCategoryDTO = new CreateCategoryDTO
            {
                CategoryName = "Laptop"
            };

            await _categoryService.CreateCategory(createCategoryDTO);

            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _categoryService.CreateCategory(createCategoryDTO));

            Assert.That(ex.Message, Is.EqualTo("Category already exists."));
        }

        [Test]
        public async Task GetCategoryById_InvalidId_ThrowsException()
        {
            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _categoryService.GetCategoryById(999));

            Assert.That(ex.Message, Is.EqualTo("Category not found."));
        }

        [Test]
        public async Task GetAllCategories_ReturnsListOfCategories()
        {
            // Arrange
            await _categoryService.CreateCategory(new CreateCategoryDTO { CategoryName = "Laptop" });
            await _categoryService.CreateCategory(new CreateCategoryDTO { CategoryName = "Furniture" });

            // Act
            var result = await _categoryService.GetAllCategories();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task DeleteCategory_ValidId_ReturnsTrue()
        {
            // Arrange
            var created = await _categoryService.CreateCategory(new CreateCategoryDTO { CategoryName = "Laptop" });

            // Act
            var result = await _categoryService.DeleteCategory(created.CategoryId);

            // Assert
            Assert.That(result, Is.True);
        }

        [Test]
        public async Task DeleteCategory_InvalidId_ThrowsException()
        {
            // Act & Assert
            var ex = Assert.ThrowsAsync<Exception>(async () =>
                await _categoryService.DeleteCategory(999));

            Assert.That(ex.Message, Is.EqualTo("Category not found."));
        }
    }
}