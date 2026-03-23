package portfolio.identity;
import java.util.Base64;

public class authService {
    public String login(String email, String password) {
        // Create a fake JWT to show real data flow
        String token = Base64.getEncoder().encodeToString((email + ":session").getBytes());
        System.out.println("[API] Supabase Auth: Authenticating user " + email);
        return "JWT_" + token;
    }

    public void logout(String sessionId) {
        System.out.println("[API] Session " + sessionId + " invalidated.");
    }
}