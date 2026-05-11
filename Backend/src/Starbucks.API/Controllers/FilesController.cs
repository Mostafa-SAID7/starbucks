using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starbucks.Application.Common.Interfaces.Services;

namespace Starbucks.API.Controllers;

[Authorize(Roles = "Admin,SuperAdmin")]
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class FilesController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;

    public FilesController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }

    /// <summary>
    /// Upload a file (Admin only).
    /// </summary>
    [HttpPost("upload")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string folder = "general")
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        using (var stream = file.OpenReadStream())
        {
            var url = await _fileStorageService.UploadFileAsync(stream, file.FileName, folder);
            return Ok(new { url });
        }
    }
}
