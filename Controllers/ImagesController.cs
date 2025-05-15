using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using FFCE.DTOs;   

namespace FFCE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly string _imagesPath;

        public ImagesController(IWebHostEnvironment env)
        {
            _env = env;
            _imagesPath = Path.Combine(_env.WebRootPath, "images");
            if (!Directory.Exists(_imagesPath))
                Directory.CreateDirectory(_imagesPath);
        }

        [HttpGet]
        public IActionResult List()
        {
            var files = Directory
                .EnumerateFiles(_imagesPath)
                .Select(Path.GetFileName)
                .ToList();
            return Ok(files);
        }

        
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Arquivo inválido.");

            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowed.Contains(ext))
                return BadRequest("Tipo de arquivo não permitido.");

            var savePath = Path.Combine(_imagesPath, file.FileName);
            if (System.IO.File.Exists(savePath))
                return Conflict("Arquivo já existe.");

            using var stream = System.IO.File.Create(savePath);
            await file.CopyToAsync(stream);

            return Ok("Upload realizado com sucesso.");
        }

        
        [HttpPut("rename/{oldName}")]
        public IActionResult Rename(string oldName, [FromBody] RenameDTO dto)
        {
            var oldPath = Path.Combine(_imagesPath, oldName);
            if (!System.IO.File.Exists(oldPath))
                return NotFound("Arquivo original não encontrado.");

            var newPath = Path.Combine(_imagesPath, dto.NewName);
            if (System.IO.File.Exists(newPath))
                return Conflict("Já existe um arquivo com o novo nome.");

            System.IO.File.Move(oldPath, newPath);
            return Ok("Arquivo renomeado com sucesso.");
        }

        [HttpDelete("{name}")]
        public IActionResult Delete(string name)
        {
            var path = Path.Combine(_imagesPath, name);
            if (!System.IO.File.Exists(path))
                return NotFound("Arquivo não encontrado.");

            System.IO.File.Delete(path);
            return Ok("Arquivo deletado com sucesso.");
        }
    } 
}
