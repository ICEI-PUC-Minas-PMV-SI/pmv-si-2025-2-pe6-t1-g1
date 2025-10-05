using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace test.Models
{
    public class UserUpdateDto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [Required]
        [MaxLength(255)]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]       
        public string PasswordHash { get; set; }

        [MaxLength(20)]
        public string Phone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } // EMPLOYER, ADMIN, USER

    }
}