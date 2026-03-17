package portfolio.identity;

public class authService
{
    public String login(String email, String password)
    {
        System.out.println("[STUB] AuthService: Logging in user " + email);
        return "STUB_SESSION_12345"; // session ID return
    }

    public void logout(String sessionId)
    {
        System.out.println("[STUB] AuthService: Session " + sessionId + " invalidated.");
    }
}
