using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Application.DTOs.Jobs
{
    public class JobResponseDto
    {
        public int Id { get; set; }
        public string Title {  get; set; }
        public decimal Budget { get; set; }
        public string Location { get; set; } = string.Empty;
    }
}
