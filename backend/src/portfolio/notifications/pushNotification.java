package portfolio.notifications;

public class pushNotification implements notification {
    @Override
    public void send(String message, String recipientToken) {
        System.out.println("--------------------------------------------------");
        System.out.println("[FACTORY] Creating Push Object...");
        System.out.println("[FACTORY] Target Device Token: " + recipientToken);
        System.out.println("Status: Dispatching JSON payload to Push Gateway");
        System.out.println("Message: " + message);
        System.out.println("--------------------------------------------------");
    }
}