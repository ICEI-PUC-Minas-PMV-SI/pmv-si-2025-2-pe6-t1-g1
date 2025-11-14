using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace web_api.Models
{
    public class Item
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string NameItem { get; set; }

        public string Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Value { get; set; }

        [MaxLength(100)]
        public string Category { get; set; }

        // Navigation properties
        public virtual ICollection<UserCart> CartItems { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}