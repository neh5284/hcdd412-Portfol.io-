package portfolio.publishing;

/**
 * Service for managing the public visibility of portfolios.
 * Current Status: STUB (Logic for secure URL generation pending).
 */
public class publishService {

    // Helper method for the Test Harness to detect implementation status
    public boolean isStub() {
        return true;
    }

    /**
     * Generates a shareable URL for the portfolio.
     * @param portfolioId Unique identifier for the portfolio
     * @param visibility "Public", "Private", or "Unlisted"
     * @return A formatted share link
     */
    public String createShareLink(String portfolioId, String visibility) {
        System.out.println("[STUB] PublishService: Generating " + visibility + " link.");

        // The harness will flag this because it matches a known static pattern
        return "https://portfol.io/share/" + portfolioId;
    }
}