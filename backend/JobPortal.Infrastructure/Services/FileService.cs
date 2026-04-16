
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
}