import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

public class ServerMain {
    public static void main(String[] args) {
        int port = 25566;
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Server Started - " + port);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("Client Connected!");

                GameSession gameSession = new GameSession(clientSocket);
                new Thread(gameSession).start();  // Multi-threaded server handling
            }
        } catch (IOException e) {
            System.out.println("IOException: " + e.getMessage());
        }
    }
}
