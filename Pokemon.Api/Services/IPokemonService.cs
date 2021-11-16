using Pokemon.Api.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pokemon.Api.Services
{
    public interface IPokemonService
    {
        List<PointSearch> GetListRoute(int id, List<PointSearch> points);
        Task<Result> GetMap(int id);
        Task<int> RandomizeMap(CreateMap create);
        Task<int> UpdateMap(int id, List<PointSearch> points);
    }
}