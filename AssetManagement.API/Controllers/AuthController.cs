using AssetManagement.API.Services;
using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using AssetManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly JwtTokenService _jwtTokenService;
        private readonly AppDbContext _context;

        public AuthController(IAuthService authService, JwtTokenService jwtTokenService, AppDbContext context)
        {
            _authService = authService;
            _jwtTokenService = jwtTokenService;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var result = await _authService.Register(registerDTO);
            return Ok(ApiResponse<AuthResponseDTO>.SuccessResponse(result, "Registration successful."));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Validation failed."));

            var result = await _authService.Login(loginDTO);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDTO.Email);

            var token = _jwtTokenService.GenerateToken(user!);
            result.Token = token;

            return Ok(ApiResponse<AuthResponseDTO>.SuccessResponse(result, "Login successful."));
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return Ok(ApiResponse<string>.SuccessResponse(string.Empty, "Logged out successfully."));
        }
    }
}