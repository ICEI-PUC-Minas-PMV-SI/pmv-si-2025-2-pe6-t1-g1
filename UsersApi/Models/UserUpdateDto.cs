using System.ComponentModel.DataAnnotations;

namespace web_api.Models
{
    public class UserUpdateDto
    {
        [StringLength(100)]
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }

        [MinLength(6)]
        public string Password { get; set; }
    }
}
