using System.ComponentModel.DataAnnotations;

namespace web_api.Models.DTOs
{
    public class CreateAddressDto
    {
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
    }
}