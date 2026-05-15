using System.Text.RegularExpressions;
using JobPortal.Application.DTOs.Resume;
using JobPortal.Application.Interfaces.Files;
using UglyToad.PdfPig;

namespace JobPortal.Infrastructure.Services.Files
{
    public class ResumeReaderService
        : IResumeReaderService
    {
        private readonly List<string> _knownSkills =
        [
            "C#", ".NET", "ASP.NET",
            "React", "React Native",
            "SQL", "JavaScript",
            "TypeScript", "Python",
            "Java", "Node.js",
            "MongoDB", "Azure",
            "AWS", "Docker",
            "HTML", "CSS", "Git",
            "TensorFlow", "Pandas",
            "NumPy", "Machine Learning",
            "Deep Learning", "NLP",
            "Apache Spark",
            "REST API",
            "MVC",
            "SQL Server",
            "MySQL",
            "Tailwind",
            "Postman",
            "CI/CD",
            "Linux",
            "OOP",
            "Entity Framework",
            "EF Core"
        ];

        private readonly List<string> _sectionHeaders =
        [
            "education",
            "experience",
            "projects",
            "skills",
            "technical skills",
            "languages",
            "summary",
            "certifications",
            "objective",
            "profile",
            "about me",
            "additional information"
        ];

        public async Task<ResumeDataDto>
            ReadResumeAsync(
            byte[] fileBytes,
            string fileName)
        {
            var extension =
                Path.GetExtension(fileName)
                    .ToLower();

            if (extension != ".pdf")
            {
                throw new Exception(
                    "Only PDF supported");
            }

            var extractedText =
                NormalizeText(
                    ReadPdf(fileBytes));

            return await Task.FromResult(
                new ResumeDataDto
                {
                    FullText =
                        extractedText,

                    CandidateName =
                        ExtractName(
                            extractedText),

                    Email =
                        ExtractEmail(
                            extractedText),

                    PhoneNumber =
                        ExtractPhone(
                            extractedText),

                    Skills =
                        ExtractSkills(
                            extractedText),

                    Education =
                        ExtractEducation(
                            extractedText),

                    Experience =
                        new List<string>()
                });
        }

        private string ReadPdf(
            byte[] fileBytes)
        {
            using var stream =
                new MemoryStream(fileBytes);

            using var document =
                PdfDocument.Open(stream);

            string text = "";

            foreach (var page
                in document.GetPages())
            {
                text += page.Text + "\n";
            }

            return text;
        }

        private string NormalizeText(
    string text)
        {
            text =
                text.Replace("\r", "\n");

            // Fix merged section headers
            var headers = new[]
            {
        "Education",
        "Experience",
        "Projects",
        "Technical Skills",
        "Skills",
        "Languages",
        "Summary",
        "Certifications",
        "About Me",
        "Objective",
        "Profile",
        "Additional Information"
    };

            foreach (var header in headers)
            {
                text = Regex.Replace(
                    text,
                    $"(?i){Regex.Escape(header)}",
                    $"\n{header}\n");
            }

            // normalize bullets
            text = text
                .Replace("•", "\n")
                .Replace("●", "\n")
                .Replace("▪", "\n")
                .Replace("", "\n")
                .Replace("?", "\n");

            // normalize spaces
            text = Regex.Replace(
                text,
                @"[ \t]{2,}",
                " ");

            // remove repeated line breaks
            text = Regex.Replace(
                text,
                @"\n{2,}",
                "\n");

            return text.Trim();
        }

        private string? ExtractEmail(
            string text)
        {
            var match =
                Regex.Match(
                    text,
                    @"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}");

            return match.Success
                ? match.Value.Trim()
                : null;
        }

        private string? ExtractPhone(
            string text)
        {
            var matches =
                Regex.Matches(
                    text,
                    @"(\+?\d{1,3}[- ]?)?\d{8,15}");

            return matches.Count > 0
                ? matches
                    .Select(x => x.Value)
                    .OrderByDescending(
                        x => x.Length)
                    .First()
                : null;
        }

        private string? ExtractName(string text)
        {
            var lines =
                text.Split('\n')
                    .Select(x => x.Trim())
                    .Where(x =>
                        !string.IsNullOrWhiteSpace(x))
                    .Take(10)
                    .ToList();

            foreach (var line in lines)
            {
                // skip email
                if (line.Contains("@"))
                    continue;

                // skip phone
                if (Regex.IsMatch(
                    line,
                    @"\+?\d"))
                    continue;

                // remove locations
                var cleanline = line
                    .Replace("Kathmandu", "")
                    .Replace("Nepal", "")
                    .Trim(',', ' ');

                // proper human name
                var match =
                    Regex.Match(
                        cleanline,
                        @"^[A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2}$");

                if (match.Success)
                {
                    return match.Value.Trim();
                }
            }

            return null;
        }

        private List<string> ExtractSkills(
            string text)
        {
            var foundSkills =
                new List<string>();

            foreach (var skill
                in _knownSkills)
            {
                if (Regex.IsMatch(
                    text,
                    $@"\b{Regex.Escape(skill)}\b",
                    RegexOptions.IgnoreCase))
                {
                    foundSkills.Add(
                        skill);
                }
            }

            return foundSkills
                .Distinct()
                .OrderBy(x => x)
                .ToList();
        }

        private List<string> ExtractEducation(
    string text)
        {
            var lines =
                text.Split('\n')
                    .Select(x => x.Trim())
                    .Where(x =>
                        !string.IsNullOrWhiteSpace(x))
                    .ToList();

            var education =
                new List<string>();

            bool insideEducation =
                false;

            foreach (var line in lines)
            {
                // Start section
                if (line.Equals(
                    "Education",
                    StringComparison.OrdinalIgnoreCase))
                {
                    insideEducation = true;
                    continue;
                }

                // Stop section
                if (insideEducation &&
                    _sectionHeaders.Any(header =>
                        line.Equals(
                            header,
                            StringComparison.OrdinalIgnoreCase)))
                {
                    break;
                }

                // collect content
                if (insideEducation)
                {
                    education.Add(line);
                }
            }

            return education
                .Where(x => x.Length > 3)
                .Distinct()
                .ToList();
        }
    }
}