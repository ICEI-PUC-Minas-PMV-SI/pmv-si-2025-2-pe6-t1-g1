using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using test.Models;
using web_api.Models;
namespace web_api.Controllers
{
    [Authorize(Roles = "ADMIN")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminsController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        
        public async Task<ActionResult> GetAll()
        {
            var model = await _context.Users.ToListAsync();
            return Ok(model);
        }


        [HttpPost]
        
        public async Task<ActionResult> CreateAdmin(UserUpdateDto createDto)
        {
           
            var newUser = new User
            {
                Name = createDto.Name,
                Email = createDto.Email,
                Phone = createDto.Phone,
                Role = createDto.Role,

            
                
            };

            
            newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(createDto.PasswordHash);

            
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            
            var userResponse = new
            {
                Id = newUser.Id,
                Name = newUser.Name,
                Email = newUser.Email,
                Phone = newUser.Phone,
                Role = newUser.Role,
               
            };

           
            return Ok(userResponse);
        }



        [HttpPut("{id}")]
       

        public async Task<ActionResult> UpdateUser(int id, UserUpdateDto updatedUserDto)
        {
            var userToUpdate = await _context.Users.FindAsync(id);
            if (userToUpdate == null)
            {
                return NotFound("Usuário não encontrado");
            }
            userToUpdate.Name = updatedUserDto.Name;
            userToUpdate.Email = updatedUserDto.Email;
            userToUpdate.Phone = updatedUserDto.Phone;

            if (!string.IsNullOrEmpty(updatedUserDto.Role))
            {
                userToUpdate.Role = updatedUserDto.Role;
            }
           

            await _context.SaveChangesAsync();
            return Ok(userToUpdate);
        }


        [HttpDelete("{id}")]
      
        public async Task<ActionResult> Delete(int id)
        {
            var model = await _context.Users.FindAsync(id);
            if (model == null) 
                return NotFound();

            _context.Users.Remove(model);
            await _context.SaveChangesAsync();

            return NoContent();
        }
       

[AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult> Authenticate(AuthenticateDto model)
    {
           
           var User = await _context.Users.FindAsync(model.Id);


            
            if (User == null || !BCrypt.Net.BCrypt.Verify(model.Password, User.PasswordHash))
        {
           
            return BadRequest("Email ou senha inválidos.");
        }

       
        var jwt = GenerateJwtToken(User);

        return Ok(new { jwtToken = jwt, user = new { User.Id, User.Name, User.Email, User.Role } });
    }

        
    private string GenerateJwtToken(User user) 
    {
        var tokenHandler = new JwtSecurityTokenHandler();

       
        var key = Encoding.ASCII.GetBytes("WD2LGFQOD8JR3MSSW8GAIPZ0GE5SNQZ");

        var claims = new ClaimsIdentity(new Claim[]
        {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
        });

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = claims,
            Expires = DateTime.UtcNow.AddHours(8),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
    
}
    }

