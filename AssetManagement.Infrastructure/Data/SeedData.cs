using AssetManagement.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Data
{
    public static class SeedData
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            // Seed Categories
            modelBuilder.Entity<AssetCategory>().HasData(
                new AssetCategory { CategoryId = 1, CategoryName = "Laptop" },
                new AssetCategory { CategoryId = 2, CategoryName = "Furniture" },
                new AssetCategory { CategoryId = 3, CategoryName = "Car" },
                new AssetCategory { CategoryId = 4, CategoryName = "Gadgets" }
            );

            // Seed Departments
            modelBuilder.Entity<Department>().HasData(
                new Department { DepartmentId = 1, DepartmentName = "IT", Location = "Chennai" },
                new Department { DepartmentId = 2, DepartmentName = "HR", Location = "Mumbai" },
                new Department { DepartmentId = 3, DepartmentName = "Finance", Location = "Bangalore" }
            );
        }
    }
}