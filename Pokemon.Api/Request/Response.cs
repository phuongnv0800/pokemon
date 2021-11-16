using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pokemon.Api.Common
{
    public class Response
    {
        public object Data { get; set; }
        public bool Result { get; set; }

        public string Message { get; set; }
    }
}
