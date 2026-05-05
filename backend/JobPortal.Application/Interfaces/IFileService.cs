public interface IFileService
{
    Task<string> SaveResumeAsync(byte[] fileBytes, string fileName);
}