using LeadApi.Models;
using Microsoft.EntityFrameworkCore;

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
        modelBuilder.Entity<LeadTimelineEntry>().HasKey(e => e.Id);
    }
}
