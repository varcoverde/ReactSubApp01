using LeadApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace LeadApi.Data;

public class LeadContext : DbContext
{
    public LeadContext(DbContextOptions<LeadContext> options) : base(options)
    {
    }

    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<LeadComment> Comentarios => Set<LeadComment>();
    public DbSet<LeadTimelineEntry> Historico => Set<LeadTimelineEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Lead>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.Property(e => e.Nome).IsRequired();

            entity.Property(e => e.Email).IsRequired();

            entity.HasMany(e => e.Comentarios)
                .WithOne()
                .HasForeignKey(c => c.LeadId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Historico)
                .WithOne()
                .HasForeignKey(h => h.LeadId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<LeadComment>().HasKey(e => e.Id);
        modelBuilder.Entity<LeadComment>().Property(e => e.Id).ValueGeneratedNever();

        modelBuilder.Entity<LeadTimelineEntry>().HasKey(e => e.Id);
        modelBuilder.Entity<LeadTimelineEntry>().Property(e => e.Id).ValueGeneratedNever();

        if (Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            // SQLite does not have proper support for DateTimeOffset via Entity Framework Core, see the limitations
            // here: https://docs.microsoft.com/en-us/ef/core/providers/sqlite/limitations#query-limitations
            // To work around this, when the Sqlite database provider is used, all model properties of type DateTimeOffset
            // use the DateTimeOffsetToBinaryConverter
            // Based on: https://github.com/aspnet/EntityFrameworkCore/issues/10784#issuecomment-415769754
            // This only supports millisecond precision, but should be sufficient for most use cases.
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(DateTimeOffset)
                                                                            || p.PropertyType == typeof(DateTimeOffset?));
                foreach (var property in properties)
                {
                    modelBuilder
                        .Entity(entityType.Name)
                        .Property(property.Name)
                        .HasConversion(new DateTimeOffsetToBinaryConverter());
                }
            }
        }
    }
}
