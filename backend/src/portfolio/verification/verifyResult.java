package portfolio.verification;

public class verifyResult
{
    public String skillName;
    public double confidenceScore;

    public verifyResult(String name, double score)
    {
        this.skillName = name;
        this.confidenceScore = score;
    }
}
