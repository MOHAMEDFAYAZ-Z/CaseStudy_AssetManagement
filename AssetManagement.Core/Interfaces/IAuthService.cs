using AssetManagement.Core.DTOs;

namespace AssetManagement.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> Register(RegisterDTO registerDTO);
        Task<AuthResponseDTO> Login(LoginDTO loginDTO);
    }
}