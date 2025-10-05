using System.ComponentModel.DataAnnotations;

namespace web_api.Models.DTOs
{
    public class UserRegisterDto
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [MaxLength(20)]
        public string Phone { get; set; }
    }
}