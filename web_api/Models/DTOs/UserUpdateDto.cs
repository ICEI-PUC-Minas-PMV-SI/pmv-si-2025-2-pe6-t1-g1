using System.ComponentModel.DataAnnotations;

namespace web_api.Models.DTOs
{
    public class UserUpdateDto
    {
        [MaxLength(255)]
        public string? Name { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MinLength(6)]
        public string? Password { get; set; }

        [MaxLength(20)]
        public string? Role { get; set; }
    }
}