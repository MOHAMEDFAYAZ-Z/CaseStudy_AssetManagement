using AssetManagement.Core.DTOs;

namespace AssetManagement.Core.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<EmployeeResponseDTO>> GetAllEmployees();
        Task<EmployeeResponseDTO> GetEmployeeById(int id);
        Task<EmployeeResponseDTO> UpdateEmployee(int id, UpdateEmployeeDTO updateEmployeeDTO);
        Task<bool> DeleteEmployee(int id);
    }
}