using System;
using System.IO;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;

namespace JobPortal.Infrastructure.Services
{
    public class FileService : IFileService
    {
        public async Task<string> SaveResumeAsync(byte[] fileBytes, string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLower();

            if (extension != ".pdf")
                throw new Exception("Only PDF allowed");

            var newFileName = Guid.NewGuid() + extension;
            var folderPath = Path.Combine("wwwroot", "resumes");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, newFileName);

            await File.WriteAllBytesAsync(filePath, fileBytes);

            return $"/resumes/{newFileName}";
        }

        public async Task<byte[]> GetFileBytesAsync(string relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
                throw new ArgumentException("Path required", nameof(relativePath));

            // Accept values like "/resumes/abc.pdf" or "resumes/abc.pdf"
            var trimmed = relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var filePath = Path.Combine("wwwroot", trimmed);

            if (!File.Exists(filePath))
                throw new FileNotFoundException("File not found", filePath);

            return await File.ReadAllBytesAsync(filePath);
        }

    }
}
    