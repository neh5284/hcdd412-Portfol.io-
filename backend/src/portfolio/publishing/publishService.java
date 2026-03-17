package portfolio.publishing;

public class publishService
{
    public String createShareLink(String portfolioId, String visibility)
    {
        System.out.println("[STUB] PublishService: Generating " + visibility + " link.");
        return "https://portfol.io/share/" + portfolioId;
    }
}
