using System.Text.RegularExpressions;
using JobPortal.Application.DTOs.Resume;
using JobPortal.Application.Interfaces.Files;
using UglyToad.PdfPig;

namespace JobPortal.Infrastructure.Services.Files
{
    public class ResumeReaderService : IResumeReaderService
    {
        private readonly List<string> _knownSkills = new()
        {
            "C#",
            ".NET",
            "ASP.NET",
            "React",
            "React Native",
            "SQL",
            "JavaScript",
            "TypeScript",
            "Python",
            "Java",
            "Node.js",
            "MongoDB",
            "Azure",
            "AWS",
            "Docker",
            "HTML",
            "CSS",
            "Git"
        };

        public async Task<ResumeDataDto> ReadResumeAsync(
            byte[] fileBytes,
            string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLower();

            string extractedText = "";

            if (extension == ".pdf")
            {
                extractedText = ReadPdf(fileBytes);
            }
            else
            {
                throw new Exception("Unsupported file format");
            }

            var result = new ResumeDataDto
            {
                FullText = extractedText,
                CandidateName = ExtractName(extractedText),
                Email = ExtractEmail(extractedText),
                PhoneNumber = ExtractPhone(extractedText),
                Skills = ExtractSkills(extractedText)
            };

            return await Task.FromResult(result);
        }

        private string ReadPdf(byte[] fileBytes)
        {
            using var stream = new MemoryStream(fileBytes);

            using var document = PdfDocument.Open(stream);

            string text = "";

            foreach (var page in document.GetPages())
            {
                text += page.Text + " ";
            }

            return text;
        }

        private string? ExtractEmail(string text)
        {
            var regex =
                @"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}";

            var match = Regex.Match(text, regex);

            return match.Success ? match.Value : null;
        }

        private string? ExtractPhone(string text)
        {
            var regex =
                @"(\+\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,15}";

            var match = Regex.Match(text, regex);

            return match.Success ? match.Value : null;
        }

        private string? ExtractName(string text)
        {
            // Normalize whitespace
            text = Regex.Replace(text, @"\s+", " ");

            // Try first 100 characters only
            var beginning =
                text.Length > 100
                ? text.Substring(0, 100)
                : text;

            // Match probable full name
            var match = Regex.Match(
                beginning,
                @"\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b");

            if (match.Success)
            {
                var name = match.Value.Trim();

                // Remove common location words
                var invalidWords = new[]
                {
            "Kathmandu",
            "Nepal",
            "India"
        };

                var parts = name.Split(' ')
                                .Where(x => !invalidWords.Contains(x))
                                .ToList();

                return string.Join(" ", parts.Take(2));
            }

            return null;
        }

        private List<string> ExtractSkills(string text)
        {
            var foundSkills = new List<string>();

            foreach (var skill in _knownSkills)
            {
                if (text.Contains(skill,
                    StringComparison.OrdinalIgnoreCase))
                {
                    foundSkills.Add(skill);
                }
            }

            return foundSkills.Distinct().ToList();
        }
    }
}