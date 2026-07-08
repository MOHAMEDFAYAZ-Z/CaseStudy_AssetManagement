using AssetManagement.Core.DTOs;
using AssetManagement.Core.Exceptions;
using AssetManagement.Core.Interfaces;
using AssetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<EmployeeResponseDTO>> GetAllEmployees()
        {
            try
            {
                return await _context.Users
                    .Where(u => u.Role == "Employee")
                    .Include(u => u.Department)
                    .Select(u => new EmployeeResponseDTO
                    {
                        UserId = u.UserId,
                        Name = u.Name,
                        Email = u.Email,
                        Gender = u.Gender,
                        ContactNumber = u.ContactNumber,
                        Address = u.Address,
                        Role = u.Role,
                        DepartmentName = u.Department != null ? u.Department.DepartmentName : "Not Assigned",
                        CreatedAt = u.CreatedAt
                    }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EmployeeResponseDTO> GetEmployeeById(int id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Department)
                    .FirstOrDefaultAsync(u => u.UserId == id && u.Role == "Employee");

                if (user == null)
                    throw new NotFoundException("Employee not found.");

                return new EmployeeResponseDTO
                {
                    UserId = user.UserId,
                    Name = user.Name,
                    Email = user.Email,
                    Gender = user.Gender,
                    ContactNumber = user.ContactNumber,
                    Address = user.Address,
                    Role = user.Role,
                    DepartmentName = user.Department != null ? user.Department.DepartmentName : "Not Assigned",
                    CreatedAt = user.CreatedAt
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EmployeeResponseDTO> UpdateEmployee(int id, UpdateEmployeeDTO updateEmployeeDTO)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserId == id && u.Role == "Employee");

                if (user == null)
                    throw new NotFoundException("Employee not found.");

                user.Name = updateEmployeeDTO.Name;
                user.Gender = updateEmployeeDTO.Gender;
                user.ContactNumber = updateEmployeeDTO.ContactNumber;
                user.Address = updateEmployeeDTO.Address;
                user.DepartmentId = updateEmployeeDTO.DepartmentId;

                await _context.SaveChangesAsync();

                return await GetEmployeeById(user.UserId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEmployee(int id)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserId == id && u.Role == "Employee");

                if (user == null)
                    throw new NotFoundException("Employee not found.");

                // Get all active allocations for this employee
                var activeAllocations = await _context.AssetAllocations
                    .Include(a => a.Asset)
                    .Where(a => a.UserId == id && a.Status == "Active")
                    .ToListAsync();

                // Set all allocated assets back to Available
                foreach (var allocation in activeAllocations)
                {
                    allocation.Status = "Returned";
                    allocation.ReturnedDate = DateTime.Now;
                    allocation.Asset.Status = "Available";
                }

                // Cancel pending service requests
                var pendingServiceRequests = await _context.ServiceRequests
                    .Where(s => s.UserId == id && s.Status == "Pending")
                    .ToListAsync();

                foreach (var serviceRequest in pendingServiceRequests)
                {
                    serviceRequest.Status = "Cancelled";
                }

                // Cancel pending return requests
                var pendingReturnRequests = await _context.AssetReturnRequests
                    .Where(r => r.UserId == id && r.Status == "Pending")
                    .ToListAsync();

                foreach (var returnRequest in pendingReturnRequests)
                {
                    returnRequest.Status = "Cancelled";
                }

                await _context.SaveChangesAsync();

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}