using System.ComponentModel.DataAnnotations;

namespace web_api.Models
{
    public class UserRegisterDto
    {
        [Required, StringLength(100)]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }

        [Required, MinLength(6)]
        public string Password { get; set; }
    }
}
