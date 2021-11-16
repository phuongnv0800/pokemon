using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pokemon.Api.Data
{
    public class PokemonDbContext : DbContext
    {
        public PokemonDbContext(DbContextOptions<PokemonDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<MatrixRoute>(op => {
                op.HasKey(x => x.Id);
                op.Property(x => x.Id).UseIdentityColumn();
            });
            base.OnModelCreating(builder);
        }
        public DbSet<MatrixRoute> MatrixRoutes{ get; set; }
    }
}
