using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Domain.Entities
{
    public class Application
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int SeekerId {  get; set; }
        public string Status { get; set; } = "Applied";
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        //Navigation
        public Job Job { get; set; }
        public User Seeker { get; set; }
    }

}
