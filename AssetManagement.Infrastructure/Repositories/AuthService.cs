using AssetManagement.Core.DTOs;
using AssetManagement.Core.Interfaces;
using AssetManagement.Core.Models;
using AssetManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AuthResponseDTO> Register(RegisterDTO registerDTO)
        {
            try
            {
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == registerDTO.Email);

                if (existingUser != null)
                    throw new Exception("Email already registered.");

                var user = new User
                {
                    Name = registerDTO.Name,
                    Email = registerDTO.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password),
                    Gender = registerDTO.Gender,
                    ContactNumber = registerDTO.ContactNumber,
                    Address = registerDTO.Address,
                    Role = "Employee",
                    CreatedAt = DateTime.Now
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return new AuthResponseDTO
                {
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    Token = string.Empty
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AuthResponseDTO> Login(LoginDTO loginDTO)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDTO.Email);

                if (user == null)
                    throw new Exception("Invalid email or password.");

                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.PasswordHash);

                if (!isPasswordValid)
                    throw new Exception("Invalid email or password.");

                return new AuthResponseDTO
                {
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    Token = string.Empty
                };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}