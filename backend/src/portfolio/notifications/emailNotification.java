package portfolio.notifications;

public class emailNotification implements notification {
    @Override
    public void send(String message, String recipient) {
        // simulated, need to connect with SMTP
        String sender = "neh5284@psu.edu";

        System.out.println("--------------------------------------------------");
        System.out.println("[FACTORY] Creating Email Object...");
        System.out.println("[FACTORY] Sender Identity: " + sender);
        System.out.println("[FACTORY] Target Recipient: " + recipient);
        System.out.println("Status: Simulated Dispatch via Penn State SMTP");
        System.out.println("Message: " + message);
        System.out.println("--------------------------------------------------");
    }
}