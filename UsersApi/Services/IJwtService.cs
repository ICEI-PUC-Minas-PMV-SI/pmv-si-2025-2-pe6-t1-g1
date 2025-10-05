using web_api.Models;

public interface IJwtService
{
    string GenerateToken(User user);
}
