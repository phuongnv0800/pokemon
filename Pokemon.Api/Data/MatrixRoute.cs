using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Pokemon.Api.Data
{
    public class MatrixRoute
    {
        [Key]
        public int Id { get; set; }
        public int Rows { get; set; }
        public int Cols { get; set; }
        public string DataMatrix { get; set; }
    }
}
