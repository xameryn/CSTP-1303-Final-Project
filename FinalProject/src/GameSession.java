import java.io.*;
import java.net.*;

public class GameSession implements Runnable {
    private Socket socket;
    private JavaGame game;
    private PrintWriter out;
    private BufferedReader in;

    public GameSession(Socket socket) {
        this.socket = socket;
        this.game = new JavaGame();
    }

    @Override
    public void run() {
        try {
            out = new PrintWriter(socket.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            String input;
            while ((input = in.readLine()) != null) {
                handleClientInput(input);
                System.out.println("REQUESTED: " + input);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void handleClientInput(String input) {
        String switchInput = input.contains(" ") ? input.split(" ")[0] : input;
        switch (switchInput) {
            case "NEW_GAME" ->       resetGame();
            case "GET_GAME_STATE" -> sendGameState();
        }
    }

    private void resetGame() {
        game.resetGame();
        out.println("GAME_RESET");
    }

    private void sendGameState() {
        out.println("GAME_STATE " + 0);
    }
}
