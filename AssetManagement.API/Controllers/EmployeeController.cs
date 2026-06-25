using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _employeeService.GetAllEmployees();
            return Ok(ApiResponse<List<EmployeeResponseDTO>>.SuccessResponse(employees, "Employees retrieved successfully."));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeById(id);
            return Ok(ApiResponse<EmployeeResponseDTO>.SuccessResponse(employee, "Employee retrieved successfully."));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDTO updateEmployeeDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var employee = await _employeeService.UpdateEmployee(id, updateEmployeeDTO);
            return Ok(ApiResponse<EmployeeResponseDTO>.SuccessResponse(employee, "Employee updated successfully."));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            await _employeeService.DeleteEmployee(id);
            return Ok(ApiResponse<object>.SuccessResponse(null!, "Employee deleted successfully."));
        }
    }
}