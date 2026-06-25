using AssetManagement.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<AssetCategory> AssetCategories { get; set; }
        public DbSet<AssetAllocation> AssetAllocations { get; set; }
        public DbSet<ServiceRequest> ServiceRequests { get; set; }
        public DbSet<AuditRequest> AuditRequests { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<AssetImage> AssetImages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<AssetMaintenanceLog> AssetMaintenanceLogs { get; set; }
        public DbSet<AssetReturnRequest> AssetReturnRequests { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Asset>()
                .Property(a => a.AssetValue)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<AssetMaintenanceLog>()
                .Property(a => a.MaintenanceCost)
                .HasColumnType("decimal(18,2)");

            SeedData.Seed(modelBuilder);
        }
    }
}