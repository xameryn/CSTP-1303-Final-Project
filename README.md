# Buddy Hop - Design Document

#### Section 1: Project Description
The main goal of this project is to have a multiplayer game with a client and server side component. Both the client-side and server side will be done via JavaScript, the visuals will be handled using HTML and CSS. Websockets will be used for communication between the clients and server, which will send the data of one client to the other for visual sync.

#### Section 2: Overview
The game will be played in browser (HTML, JavaScrip, CSS), the browser will communicate using HTTP to a JS relay run via Bun (or Node), the outputs / inputs will be sent over TCP to the Java server. If necessary I will switch to a websocket approach which would allow for direct communication between the browser game and the Java server, though this may not be necessary.
The game will be a platformer where the player can find loot. The loot will be randomly chosen from a loot-table on the server side and sent to the client.

#### Section 3: System Architecture
- Frontend: Browser (HTML/CSS) for visuals.
- Backend: Bun (JavaScript) server that manages syncing data, game logic, and physics.
- Communication: Web Sockets between client and server.

#### Section 4: Data Dictionary
- Player Character: the in-game object representing the player, controllable using WASD keys and space bar
More to follow, this current build is a test regarding cross-platform communication
- Player Role: The first user to connect is assigned `player` their job is to reach the gold objective using WASD to control the Player Character
- Helper Role: The second user to connect is assigned `helper`, they are able to place `help blocks` by dragging left-click, `danger zones` by dragging right-click, and `goal` by dragging middle-click

#### Section 5: Setup
- To run this project, use Bun (or Babel with Node, though that would require some specific imports), run `bun u` & `bun i` to import modules, run `server.js`, open the link provided to play, open the same link again for a second player to join
- To test, run `bun test` in CMD from the root of the project, this will display the test results, many tests had to be excluded due to the lack of a `document` object outside of a browser environment.

#### Section 6: User Interface Design
- A `player` that can navigate a puzzle created by the `helper`.
  - A `help blocks` can be jumped on by the `player`.
  - A `danger zone` prevents the `helper` from placing a `help block`.
  - A `goal` completes the level upon the `player character`s arrival.