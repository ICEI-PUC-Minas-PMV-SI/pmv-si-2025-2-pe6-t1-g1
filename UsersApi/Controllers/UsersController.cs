using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using web_api.Models;

namespace web_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public UsersController(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<UserResponseDto>> Register(UserRegisterDto dto)
        {
            var email = dto.Email.ToLower();
            if (await _context.Users.AnyAsync(u => u.Email == email))
                return Conflict(new { error = "User already exists", statusCode = 409 });

            var newUser = new User
            {
                Name = dto.Name,
                Email = email,
                Phone = dto.Phone,
                Role = "USER",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMe), new { }, newUser.ToResponseDto());
        }

        [HttpGet]
        [Authorize(Roles = "USER,ADMIN")]
        public async Task<ActionResult<UserResponseDto>> GetMe()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound(new { error = "User not found", statusCode = 404 });

            return Ok(user.ToResponseDto());
        }

        [HttpPut]
        [Authorize(Roles = "USER,ADMIN")]
        public async Task<ActionResult<UserResponseDto>> UpdateMe(UserUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound(new { error = "User not found", statusCode = 404 });

            user.Name = dto.Name ?? user.Name;
            user.Email = string.IsNullOrEmpty(dto.Email) ? user.Email : dto.Email.ToLower();
            user.Phone = dto.Phone ?? user.Phone;

            if (!string.IsNullOrEmpty(dto.Password))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _context.SaveChangesAsync();

            return Ok(user.ToResponseDto());
        }

        [HttpDelete]
        [Authorize(Roles = "USER,ADMIN")]
        public async Task<ActionResult> DeleteMe()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound(new { error = "User not found", statusCode = 404 });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult> Login(LoginDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
                return BadRequest(new { error = "Missing email or password", statusCode = 400 });

            var email = dto.Email.ToLower();
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { error = "Invalid credentials", statusCode = 401 });

            var token = _jwtService.GenerateToken(user);

            return Ok(new { token, expiresIn = 3600, user = user.ToResponseDto() });
        }
    }
}
