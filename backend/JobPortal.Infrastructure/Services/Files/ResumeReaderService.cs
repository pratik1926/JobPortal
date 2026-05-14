//using System.Text.RegularExpressions;
//using JobPortal.Application.DTOs.Resume;
//using JobPortal.Application.Interfaces.Files;
//using UglyToad.PdfPig;

//namespace JobPortal.Infrastructure.Services.Files
//{
//    public class ResumeReaderService : IResumeReaderService
//    {
//        private readonly List<string> _knownSkills = new()
//        {
//            "C#",
//            ".NET",
//            "ASP.NET",
//            "React",
//            "React Native",
//            "SQL",
//            "JavaScript",
//            "TypeScript",
//            "Python",
//            "Java",
//            "Node.js",
//            "MongoDB",
//            "Azure",
//            "AWS",
//            "Docker",
//            "HTML",
//            "CSS",
//            "Git"
//        };

//        public async Task<ResumeDataDto> ReadResumeAsync(
//            byte[] fileBytes,
//            string fileName)
//        {
//            var extension = Path.GetExtension(fileName).ToLower();

//            string extractedText = "";

//            if (extension == ".pdf")
//            {
//                extractedText = ReadPdf(fileBytes);
//            }
//            else
//            {
//                throw new Exception("Unsupported file format");
//            }

//            var result = new ResumeDataDto
//            {
//                FullText = extractedText,
//                CandidateName = ExtractName(extractedText),
//                Email = ExtractEmail(extractedText),
//                PhoneNumber = ExtractPhone(extractedText),
//                Skills = ExtractSkills(extractedText),
//                Education = ExtractEducation(extractedText),
//                Experience = ExtractExperience(extractedText)
//            };

//            return await Task.FromResult(result);
//        }

//        private string ReadPdf(byte[] fileBytes)
//        {
//            using var stream = new MemoryStream(fileBytes);

//            using var document = PdfDocument.Open(stream);

//            string text = "";

//            foreach (var page in document.GetPages())
//            {
//                text += page.Text + "\n";
//            }

//            return text;
//        }

//        private string? ExtractEmail(string text)
//        {
//            var regex =
//                @"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}";

//            var match = Regex.Match(text, regex);

//            return match.Success ? match.Value : null;
//        }

//        private string? ExtractPhone(string text)
//        {
//            var regex =
//                @"(\+\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,15}";

//            var match = Regex.Match(text, regex);

//            return match.Success ? match.Value : null;
//        }

//        private string? ExtractName(string text)
//        {
//            // Normalize whitespace
//            text = Regex.Replace(text, @"\s+", " ");

//            // Try first 100 characters only
//            var beginning =
//                text.Length > 100
//                ? text.Substring(0, 100)
//                : text;

//            // Match probable full name
//            var match = Regex.Match(
//                beginning,
//                @"\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b");

//            if (match.Success)
//            {
//                var name = match.Value.Trim();

//                // Remove common location words
//                var invalidWords = new[]
//                {
//            "Kathmandu",
//            "Nepal",
//            "India"
//        };

//                var parts = name.Split(' ')
//                                .Where(x => !invalidWords.Contains(x))
//                                .ToList();

//                return string.Join(" ", parts.Take(2));
//            }

//            return null;
//        }

//        private List<string> ExtractSkills(string text)
//        {
//            var foundSkills = new List<string>();

//            foreach (var skill in _knownSkills)
//            {
//                if (text.Contains(skill,
//                    StringComparison.OrdinalIgnoreCase))
//                {
//                    foundSkills.Add(skill);
//                }
//            }

//            return foundSkills.Distinct().ToList();
//        }

//        private List<string> ExtractEducation(string text)
//        {
//            var education = new List<string>();

//            var lines = text.Split('\n');

//            bool inEducation = false;

//            foreach (var line in lines)
//            {
//                var clean = line.Trim();

//                if (clean.Contains("education",
//                    StringComparison.OrdinalIgnoreCase))
//                {
//                    inEducation = true;
//                    continue;
//                }

//                if (inEducation)
//                {
//                    if (string.IsNullOrWhiteSpace(clean))
//                        break;

//                    education.Add(clean);
//                }
//            }

//            return education.Distinct().ToList();
//        }

//        private List<string> ExtractExperience(string text)
//        {
//            var experience = new List<string>();

//            var lines = text.Split('\n');

//            bool inExperience = false;

//            foreach (var line in lines)
//            {
//                var clean = line.Trim();

//                if (clean.Contains("experience",
//                    StringComparison.OrdinalIgnoreCase))
//                {
//                    inExperience = true;
//                    continue;
//                }

//                if (inExperience)
//                {
//                    if (string.IsNullOrWhiteSpace(clean))
//                        break;

//                    experience.Add(clean);
//                }
//            }

//            return experience.Distinct().ToList();
//        }
//    }
//}

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

        private readonly List<string> _educationHeaders = new()
        {
            "education",
            "academic background",
            "qualification",
            "qualifications",
            "studies",
            "academic history"
        };

        private readonly List<string> _experienceHeaders = new()
        {
            "experience",
            "work experience",
            "employment",
            "professional experience",
            "career history"
        };

        // ALL possible section headers
        private readonly List<string> _allHeaders = new()
        {
            "education",
            "experience",
            "projects",
            "technical skills",
            "skills",
            "languages",
            "certifications",
            "summary",
            "objective",
            "about me",
            "profile",
            "work experience",
            "employment",
            "professional experience",
            "career history",
            "academic background",
            "qualification",
            "qualifications"
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

                // Normalize extracted text
                extractedText = NormalizeText(extractedText);
            }
            else
            {
                throw new Exception("Unsupported file format");
            }

            var result = new ResumeDataDto
            {
                FullText = extractedText,

                CandidateName =
                    ExtractName(extractedText),

                Email =
                    ExtractEmail(extractedText),

                PhoneNumber =
                    ExtractPhone(extractedText),

                Skills =
                    ExtractSkills(extractedText),

                Education =
                    ExtractSection(
                        extractedText,
                        _educationHeaders),

                Experience =
                    ExtractSection(
                        extractedText,
                        _experienceHeaders)
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
                // preserve line structure
                text += page.Text + "\n";
            }

            return text;
        }

        private string NormalizeText(string text)
        {
            text = text.Replace("\r", "\n");

            // Normalize bullets
            text = text.Replace("•", "\n•");
            text = text.Replace("●", "\n●");
            text = text.Replace("▪", "\n▪");
            text = text.Replace("", "\n");

            // Add spacing around common section headers
            text = Regex.Replace(
                text,
                @"\b(EDUCATION|EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE|PROJECTS|SKILLS|TECHNICAL SKILLS|CERTIFICATIONS|LANGUAGES|ABOUT ME|SUMMARY|OBJECTIVE)\b",
                "\n$1\n",
                RegexOptions.IgnoreCase);

            // Remove excessive blank lines
            text = Regex.Replace(text, @"\n{2,}", "\n");

            return text;
        }

        private string? ExtractEmail(string text)
        {
            var regex =
                @"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}";

            var match = Regex.Match(text, regex);

            return match.Success
                ? match.Value.Trim()
                : null;
        }

        private string? ExtractPhone(string text)
        {
            var regex =
                @"(\+\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,15}";

            var match = Regex.Match(text, regex);

            return match.Success
                ? match.Value.Trim()
                : null;
        }

        private string? ExtractName(string text)
        {
            // Normalize whitespace
            text = Regex.Replace(text, @"\s+", " ");

            // Use only first part of resume
            var beginning =
                text.Length > 120
                ? text.Substring(0, 120)
                : text;

            // Match probable full name
            var match = Regex.Match(
                beginning,
                @"\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b");

            if (match.Success)
            {
                var name = match.Value.Trim();

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
                if (Regex.IsMatch(
                    text,
                    $@"\b{Regex.Escape(skill)}\b",
                    RegexOptions.IgnoreCase))
                {
                    foundSkills.Add(skill);
                }
            }

            return foundSkills
                .Distinct()
                .OrderBy(x => x)
                .ToList();
        }

        private List<string> ExtractSection(
            string text,
            List<string> sectionHeaders)
        {
            // Split into clean lines
            var lines = text.Split('\n')
                            .Select(x => x.Trim())
                            .Where(x => !string.IsNullOrWhiteSpace(x))
                            .ToList();

            int startIndex = -1;
            int endIndex = lines.Count;

            // Find section start
            for (int i = 0; i < lines.Count; i++)
            {
                if (sectionHeaders.Any(header =>
                    IsSectionHeader(lines[i], header)))
                {
                    startIndex = i + 1;
                    break;
                }
            }

            // Section not found
            if (startIndex == -1)
            {
                return new List<string>();
            }

            // Find next section header
            for (int i = startIndex; i < lines.Count; i++)
            {
                if (_allHeaders.Any(header =>
    IsSectionHeader(lines[i], header)))
                {
                    endIndex = i;
                    break;
                }
            }

            // Extract section content
            var sectionLines = lines
                .Skip(startIndex)
                .Take(endIndex - startIndex)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToList();

            // Remove bullet symbols
            sectionLines = sectionLines
                .Select(x => x.Replace("", "")
                              .Replace("•", "")
                              .Trim())
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToList();

            return sectionLines
                .Distinct()
                .ToList();
        }

        private bool IsSectionHeader(
    string line,
    string header)
        {
            line = line.Trim();

            // Exact match
            if (line.Equals(
                header,
                StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            // Header followed by colon
            if (line.Equals(
                $"{header}:",
                StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            // Ignore long sentences
            if (line.Split(' ').Length > 4)
            {
                return false;
            }

            // Match uppercase headings
            if (line.ToUpper() == line &&
                line.Contains(
                    header,
                    StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return false;
        }
    }
}