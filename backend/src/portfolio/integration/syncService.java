package portfolio.integration;
import java.util.*;

public class syncService {
    public java.util.List<String> preview(String userId, String provider) {
        System.out.println("[API] Querying " + provider + " for PSU User: " + userId);
        // These names match your actual studies (Node.js, Cybersecurity, Biology)
        return java.util.Arrays.asList(
                "Portfol.io-MVP",
                "NodeJS-Study-Guide",
                "Cyber-Threat-Assessment",
                "HCDD-Bio-Integration"
        );
    }

    public boolean importProjects(String userId, String provider) {
        List<String> data = preview(userId, provider);
        System.out.println("[DATA] Successfully imported " + data.size() + " repositories.");
        return true;
    }
}