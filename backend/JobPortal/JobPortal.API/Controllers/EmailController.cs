using Microsoft.AspNetCore.Mvc;
using JobPortal.Application.Interfaces;
using JobPortal.Application.DTOs.Verification;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IVerificationService _verificationService;

        public EmailController(IVerificationService verificationService)
        {
            _verificationService = verificationService;
        }

        // ✅ Send OTP
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendCodeDTO request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("Email is required");

            await _verificationService.SendCodeAsync(request.Email);

            return Ok("OTP sent successfully");
        }

        // ✅ Verify OTP
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyCodeDTO request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Code))
                return BadRequest("Email and OTP are required");

            var result = await _verificationService.VerifyCodeAsync(request.Email, request.Code);

            if (!result)
                return BadRequest("Invalid or expired OTP");

            return Ok("Email verified successfully");
        }
    }
}