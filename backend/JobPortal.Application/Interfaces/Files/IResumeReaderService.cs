using JobPortal.Application.DTOs.Resume;

namespace JobPortal.Application.Interfaces.Files
{
    public interface IResumeReaderService
    {
        Task<ResumeDataDto> ReadResumeAsync(byte[] fileBytes, string fileName);
    }
}