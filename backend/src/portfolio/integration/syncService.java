package portfolio.integration;
import java.util.*;

public class syncService
{
    public List<String> preview(String userId, String provider)
    {
        System.out.println("[STUB] SyncService: Fetching project list from " + provider);
        return Arrays.asList("Project_Alpha", "Design_Beta"); // test data
    }

    public boolean importProjects(String userId, String provider)
    {
        System.out.println("[STUB] SyncService: Data imported from " + provider);
        return true;
    }
}