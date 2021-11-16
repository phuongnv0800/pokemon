using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pokemon.Api.Common
{
    public class UpdateMap
    {
        public List<PointSearch> Points { get; set; }
        public int Rows { get; set; }
        public int Cols { get; set; }
    }
}
