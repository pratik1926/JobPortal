public class EmailVerification
{
    public int Id { get; set; }

    public string Email { get; set; }

    public string Code { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime Expiry { get; set; }

    public bool IsVerified { get; set; } = false;
}