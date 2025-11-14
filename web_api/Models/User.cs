using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace web_api.Models
{
    public class User
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
        [JsonIgnore]
        public string PasswordHash { get; set; }

        [MaxLength(20)]
        public string Phone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } // EMPLOYER, ADMIN, USER

        // Navigation properties
        public virtual ICollection<UserAddress> Addresses { get; set; }
        public virtual ICollection<UserCart> CartItems { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }

    public enum UserRole
    {
        EMPLOYER,
        ADMIN,
        USER
    }
}