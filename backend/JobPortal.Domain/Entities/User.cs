using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Seeker";
        public ICollection<Job> Jobs { get; set; } = new List<Job>();
        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    }
}
