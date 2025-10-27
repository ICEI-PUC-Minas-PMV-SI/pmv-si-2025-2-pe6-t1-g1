using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using web_api.Models;
using web_api.Models.DTOs;
using web_api.Services;
using System.Security.Claims;

namespace web_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public UserController(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // SHARED ENDPOINT: POST /user/login
        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = _jwtService.GenerateToken(user.Id, user.Email, user.Role);

            return Ok(new
            {
                token = token,
                user = new UserResponseDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Phone = user.Phone,
                    CreatedAt = user.CreatedAt,
                    Role = user.Role
                }
            });
        }

        // USER ENDPOINT: POST /user (Register)
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> Register([FromBody] UserRegisterDto registerDto)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Phone = registerDto.Phone,
                Role = "USER", // Default role
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var response = new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt,
                Role = user.Role
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, response);
        }

        // USER ENDPOINT: GET /user (Get current user info)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> GetCurrentUser()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt,
                Role = user.Role
            });
        }

        // USER ENDPOINT: PUT /user (Update current user)
        [HttpPut]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> UpdateCurrentUser([FromBody] UserUpdateDto updateDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            user.Name = updateDto.Name ?? user.Name;
            user.Phone = updateDto.Phone ?? user.Phone;

            if (!string.IsNullOrEmpty(updateDto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);
            }

            await _context.SaveChangesAsync();

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt,
                Role = user.Role
            });
        }

        // USER ENDPOINT: DELETE /user (Delete current user)
        [HttpDelete]
        [Authorize]
        public async Task<ActionResult> DeleteCurrentUser()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // ADMIN ENDPOINT: GET /alluser
        [HttpGet("all_users")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> GetAll()
        {
            var model = await _context.Users.ToListAsync();
            return Ok(model);
        }


        // ADMIN ENDPOINT: GET /user/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt,
                Role = user.Role
            });
        }
     
        //ADMIN ENDPOINT: PUT/user{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<UserResponseDto>> UpdateUser(int id, [FromBody] UserUpdateDto updateDto)
        {
           
            var user = await _context.Users
                                     .Include(u => u.Addresses) 
                                     .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

           
            user.Name = updateDto.Name ?? user.Name;
            user.Phone = updateDto.Phone ?? user.Phone;
            user.Role = updateDto.Role ?? user.Role;
            

            if (!string.IsNullOrEmpty(updateDto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);
            }

           
            if (updateDto.Address != null)
            {
                
                var existingAddress = user.Addresses.FirstOrDefault();

                if (existingAddress == null)
                {
                    
                    var newAddress = new UserAddress
                    {
                        UserId = user.Id, 
                        Street = updateDto.Address.Street,
                        Number = updateDto.Address.Number,
                        ZipCode = updateDto.Address.ZipCode,
                        Complement = updateDto.Address.Complement,
                        City = updateDto.Address.City,
                        Neighborhood = updateDto.Address.Neighborhood,
                        State = updateDto.Address.State               
                    };

                    
                    _context.UserAddresses.Add(newAddress);
                }
                else
                {
                   
                    existingAddress.Street = updateDto.Address.Street ?? existingAddress.Street;
                    existingAddress.Number = updateDto.Address.Number ?? existingAddress.Number;
                    existingAddress.ZipCode = updateDto.Address.ZipCode ?? existingAddress.ZipCode;
                    existingAddress.Complement = updateDto.Address.Complement ?? existingAddress.Complement;
                    existingAddress.City = updateDto.Address.City ?? existingAddress.City;
                    existingAddress.Neighborhood = updateDto.Address.Neighborhood ?? existingAddress.Neighborhood;
                    existingAddress.State = updateDto.Address.State ?? existingAddress.State;

                    _context.UserAddresses.Update(existingAddress);
                }
            }
           

            await _context.SaveChangesAsync();

           
            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = user.CreatedAt,
                Role = user.Role
            });
        }

        // ADMIN ENDPOINT: DELETE /user/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }



    }
}