namespace Starbucks.Application.Common.Interfaces.Services;

public interface IFileStorageService
{
    /// <summary>
    /// Upload a file and return the public URL.
    /// </summary>
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string folder = "general", CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete a file by its URL.
    /// </summary>
    Task DeleteFileAsync(string fileUrl, CancellationToken cancellationToken = default);
}
