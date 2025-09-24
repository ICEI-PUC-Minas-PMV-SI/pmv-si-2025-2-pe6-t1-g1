using Microsoft.EntityFrameworkCore;

namespace test.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // User configurations
            builder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            builder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            // UserCart unique constraint (user_id, item_id)
            builder.Entity<UserCart>()
                .HasIndex(uc => new { uc.UserId, uc.ItemId })
                .IsUnique();

            // OrderItem unique constraint (order_id, item_id)
            builder.Entity<OrderItem>()
                .HasIndex(oi => new { oi.OrderId, oi.ItemId })
                .IsUnique();

            // Configure relationships
            builder.Entity<UserAddress>()
                .HasOne(ua => ua.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(ua => ua.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserCart>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.CartItems)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserCart>()
                .HasOne(uc => uc.Item)
                .WithMany(i => i.CartItems)
                .HasForeignKey(uc => uc.ItemId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Order>()
                .HasOne(o => o.DeliveryAddress)
                .WithMany(ua => ua.OrdersWithThisAddress)
                .HasForeignKey(o => o.EnderecoEntregaId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<OrderItem>()
                .HasOne(oi => oi.Item)
                .WithMany(i => i.OrderItems)
                .HasForeignKey(oi => oi.ItemId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        // Restaurant DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<UserAddress> UserAddresses { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<UserCart> UserCarts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
    }
}