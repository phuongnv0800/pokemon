using Microsoft.AspNetCore.Mvc;
using Pokemon.Api.Common;
using Pokemon.Api.Data;
using Pokemon.Api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;

namespace Pokemon.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PokemonsController : ControllerBase
    {
        private readonly IPokemonService service;

        public PokemonsController(IPokemonService service)
        {
            this.service = service;
        }

        [HttpPost]
        public async Task<IActionResult> RandomizeMap([FromBody] CreateMap create )
        {
            var result = await service.RandomizeMap(create);
            if(result > 0)
            {
                return Ok(new Response() 
                { 
                    Result = true, 
                    Data = result,
                    Message = "Tạo Map Thành công!!!",
                });
            }
            return BadRequest();
            
        }
        
        [HttpGet("map/{id}")]
        public async Task<IActionResult> GetMap(int id)
        {
            var result = await service.GetMap(id);
            if (result != null)
            {
                return Ok(new Response()
                {
                    Result = true,
                    Data = result,
                    Message = "Thành công",
                });
            }
            return BadRequest();
        }

        [HttpPost("list/{id}")]
        public IActionResult GetListRoute(int id, [FromBody]List<PointSearch> points)
        {
            var result = service.GetListRoute(id, points);
            if(result != null)
            {
                return Ok(new Response() { Result = true, Data = result, Message = "Thành công" });
            }
            return Ok(new Response() { Result = false, Data = null, Message = "Gặp vật cản" });
        }
       
        [HttpPut("map/{id}")]
        public async Task<IActionResult> UpdateMap(int id, [FromBody]List<PointSearch> points)
        {
            var result = await service.UpdateMap(id, points);
            if(result > 0)
            {
                return Ok(new Response() 
                { 
                    Result = true, 
                    Data = result,
                    Message = "Update Thành công!!"
                });
            }
            return BadRequest();
        }
    }
}
