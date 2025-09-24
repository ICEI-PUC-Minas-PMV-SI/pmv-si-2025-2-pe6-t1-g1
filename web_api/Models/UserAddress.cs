using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace test.Models
{
    public class UserAddress
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Street { get; set; }

        [MaxLength(20)]
        public string Number { get; set; }

        [MaxLength(100)]
        public string Neighborhood { get; set; }

        [MaxLength(100)]
        public string City { get; set; }

        [MaxLength(100)]
        public string State { get; set; }

        [MaxLength(20)]
        public string ZipCode { get; set; }

        [MaxLength(255)]
        public string Complement { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public virtual ICollection<Order> OrdersWithThisAddress { get; set; }
    }
}