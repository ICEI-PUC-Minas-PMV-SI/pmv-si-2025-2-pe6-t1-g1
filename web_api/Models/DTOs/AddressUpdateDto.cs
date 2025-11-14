namespace web_api.Models.DTOs
{
    public class AddressUpdateDto
    {
        public string? Street { get; set; }
        public string? Number { get; set; }
        public string? ZipCode { get; set; }
        public string? Complement { get; set; }
        public string? City { get; set; }

        // Seus models também têm Bairro e Estado, 
        // podemos adicioná-los aqui caso o frontend os envie no futuro.
        public string? Neighborhood { get; set; }
        public string? State { get; set; }
    }
}

