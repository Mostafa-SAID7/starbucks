using Starbucks.Application.Common.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;

namespace Starbucks.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;

    public LocalFileStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string folder = "general", CancellationToken cancellationToken = default)
    {
        // Sanitize folder: allow only alphanumeric characters, hyphens, and underscores
        // to prevent directory traversal via the folder parameter.
        if (string.IsNullOrWhiteSpace(folder) || !System.Text.RegularExpressions.Regex.IsMatch(folder, @"^[a-zA-Z0-9_\-]+$"))
            throw new ArgumentException("Invalid folder name.", nameof(folder));

        // Sanitize fileName: strip any directory components so a value like
        // "../../appsettings.json" cannot escape the uploads directory.
        var safeFileName = Path.GetFileName(fileName);
        if (string.IsNullOrWhiteSpace(safeFileName))
            throw new ArgumentException("Invalid file name.", nameof(fileName));

        var uploadsRoot = Path.GetFullPath(Path.Combine(_environment.WebRootPath, "uploads"));
        var uploadsPath = Path.GetFullPath(Path.Combine(uploadsRoot, folder));

        // Guard: ensure the resolved folder is still inside the uploads root.
        if (!uploadsPath.StartsWith(uploadsRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase)
            && !uploadsPath.Equals(uploadsRoot, StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Resolved upload path is outside the permitted directory.");
        }

        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        var uniqueFileName = $"{Guid.NewGuid()}_{safeFileName}";
        var filePath = Path.GetFullPath(Path.Combine(uploadsPath, uniqueFileName));

        // Final guard: confirm the file path is still within the uploads root.
        if (!filePath.StartsWith(uploadsRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Resolved file path is outside the permitted directory.");

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream, cancellationToken);
        }

        return $"/uploads/{folder}/{uniqueFileName}";
    }

    public Task DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(fileUrl)) return Task.CompletedTask;

        var uploadsRoot = Path.GetFullPath(Path.Combine(_environment.WebRootPath, "uploads"));

        // Strip leading slash and resolve the canonical path.
        var relativePath = fileUrl.TrimStart('/');
        var filePath = Path.GetFullPath(Path.Combine(_environment.WebRootPath, relativePath));

        // Guard: only allow deletion of files that live inside the uploads root.
        if (!filePath.StartsWith(uploadsRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Resolved file path is outside the permitted directory.");

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        return Task.CompletedTask;
    }
}
