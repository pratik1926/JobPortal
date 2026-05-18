using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Application.DTOs.Moderation
{
    public class ModerationAnalyticsDto
    {
        public int TotalReports { get; set; }
        public int PendingReports { get; set; }
        public int RejectedReport { get; set; }
        public int ActionTaken { get; set; }
    }
}
