using Pokemon.Api.Common;
using Pokemon.Api.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;

namespace Pokemon.Api.Services
{
    public class PokemonService : IPokemonService
    {
        private readonly PokemonDbContext context;

        public PokemonService(PokemonDbContext context)
        {
            this.context = context;
        }

        public async Task<int> RandomizeMap(CreateMap create)
        {
            string mx = "";
            Random rnd = new Random();
            for (int i = 0; i < create.Rows; i++)//so hang
            {
                for (var j = 0; j < create.Cols; j++)//so cot
                {
                    var wall = rnd.NextDouble() > 0.25 ? true : false;
                    mx += wall ? "0" : "1";
                }
            }
            var matrixRoue = new MatrixRoute()
            {
                Rows = create.Rows,
                Cols = create.Cols,
                DataMatrix = mx,
            };
            context.MatrixRoutes.Add(matrixRoue);
            await context.SaveChangesAsync();
            return matrixRoue.Id;
        }

        public async Task<Result> GetMap(int id)
        {
            MatrixRoute mx = await context.MatrixRoutes.FindAsync(id);
            if (mx == null)
            {
                return new Result();
            }
            int[] ar = Array.ConvertAll(mx.DataMatrix.ToCharArray().Select(c => c.ToString()).ToArray(), s => int.Parse(s));
            List<PointSearch> q = new();
            for (int i = 0; i < mx.Rows; i++)//so hang
            {
                for (var j = 0; j < mx.Cols; j++)//so cot
                {
                    q.Add(new PointSearch() { X = i, Y = j, Walkable = ar[i * mx.Cols + j] == 0 ? true : false });
                }
            }
            return new()
            {
                Id = id,
                Rows = mx.Rows,
                Cols = mx.Cols,
                Points = q
            };
        }

        public List<PointSearch> GetListRoute(int id, List<PointSearch> points)
        {
            ///get map from database
            MatrixRoute mx = context.MatrixRoutes.FirstOrDefault(x => x.Id == id);
            if (mx == null)
            {
                return new List<PointSearch>();
            }
            var AStar = this.ChangeData(mx);
            //tim duong
            List<PointSearch> q = new();
            ///sap xep
            var a = points[0];
            points.Remove(a);
            do
            {
                var indexCurent = 0;
                var pointCurrent = points[indexCurent];
                var min = AStar.FindPath(new Vector2(a.X, a.Y), new Vector2(pointCurrent.X, pointCurrent.Y))?.Count;
                for (var j = indexCurent + 1; j < points.Count; j++)
                {
                    if (min > AStar.FindPath(new Vector2(a.X, a.Y), new Vector2(points[j].X, points[j].Y))?.Count)
                    {
                        min = AStar.FindPath(new Vector2(a.X, a.Y), new Vector2(points[j].X, points[j].Y))?.Count;
                        pointCurrent = points[j];
                    }
                }
                var path = AStar.FindPath(new Vector2(a.X, a.Y), new Vector2(pointCurrent.X, pointCurrent.Y));
                if (path != null)
                {
                    foreach (var j in path)
                    {
                        q.Add(new PointSearch() { X = (int)j.Position.X, Y = (int)j.Position.Y, Walkable = true });
                    }
                }
                else
                {
                    return new List<PointSearch>();
                }
                points.Remove(pointCurrent);
                a = pointCurrent;
            } while (points.Count > 0);
            if (q == null)
                return new List<PointSearch>();
            return q;
        }

        public async Task<int> UpdateMap(int id, List<PointSearch> points)
        {
            MatrixRoute route = await context.MatrixRoutes.FindAsync(id);
            if (route == null)
                return -1;
            string matrix = "";
            foreach (var point in points)
            {
                matrix += point.Walkable ? "0" : "1";
            }
            route.DataMatrix = matrix;
            context.Update(route);
            await context.SaveChangesAsync();
            return id;
        }
        private AStarSearchAlgorithm ChangeData(MatrixRoute route)
        {
            int[] ar = Array.ConvertAll(route.DataMatrix.ToCharArray().Select(c => c.ToString()).ToArray(), s => int.Parse(s));
            List<List<Node>> matrix = new();
            for (int i = 0; i < route.Rows; i++)//so hang
            {
                var node = new List<Node>();
                for (var j = 0; j < route.Cols; j++)//so cot
                {
                    node.Add(new Node(new Vector2(i, j), ar[i * route.Cols + j] == 0 ? true : false, 1));
                }
                matrix.Add(node);
            }
            return new AStarSearchAlgorithm(matrix);
        }
    }
}
