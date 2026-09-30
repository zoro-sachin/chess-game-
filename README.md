# ♞ Zoro Club Chess

A modern, responsive **local two-player chess game** built with HTML, CSS, and JavaScript.

Zoro Club reimagines the classic chess experience with a clean dark interface, interactive board, chess clocks, move history, piece promotion, and responsive layouts for desktop and mobile devices.

---

## ✨ Features

- ♟️ Full interactive chess board
- 👥 Local two-player gameplay
- ⏱️ 10-minute chess clock for each player
- 🎯 Legal move highlighting
- ⚔️ Capture move indication
- 👑 Pawn promotion
- ♔ Check and checkmate detection
- 🤝 Stalemate and draw detection
- 🔄 Undo previous move
- 🔃 Flip chess board
- ♻️ Start a new game
- 📜 Complete move history
- 🔢 Move counter
- 🚨 Low-time warning
- 🎨 Modern dark-themed UI
- 📱 Responsive design for desktop, tablet, and mobile
- ♿ Keyboard navigation and accessible labels
- 🌓 Reduced-motion support

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic UI |
| CSS3 | Styling, animations and responsive design |
| JavaScript | Game logic and user interaction |
| chess.js | Chess rules and legal move validation |
| Google Fonts | Manrope and DM Mono typography |

The project loads `chess.js` version `1.4.0` through jsDelivr.

---

## 📂 Project Structure

```text
zoro-club-chess/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

### `index.html`

Contains the main application structure, including:

- Zoro Club branding
- Player information
- Chess clocks
- Chess board
- Promotion dialog
- Board controls
- Move history
- Game status
- Footer information

 

### `style.css`

Controls the visual design of the application, including:

- Dark theme
- Chess board colors
- Player cards
- Animations
- Responsive layouts
- Mobile interface
- Accessibility focus states
- Low-time clock styling

The stylesheet defines the project's main color system, typography, board colors, and responsive behavior. 

### `script.js`

Contains the main chess application logic.

It handles:

- Board rendering
- Piece selection
- Legal moves
- Move execution
- Chess clocks
- Move history
- Promotion
- Check/checkmate
- Draw conditions
- Undo
- Board flipping
- Game reset

 

---

## 🎮 How to Play

1. Open the application.
2. White moves first.
3. Click a chess piece.
4. Available legal moves are highlighted.
5. Click the destination square.
6. Continue alternating between White and Black.
7. The player's clock runs during their turn.
8. The game ends when a player is checkmated, runs out of time, or a draw condition occurs.

The interface also provides a visual status message such as **"White to move"**, check notifications, checkmate results, and time-out results.

---

## ⏱️ Chess Clock

Each player starts with:

```text
10:00
```

The starting time is configured in JavaScript as:

```javascript
const START_TIME = 10 * 60;
```

The active player's clock decreases every second. When either clock reaches zero, the opposing player wins on time. 

---

## ♙ Pawn Promotion

When a pawn reaches the final rank, the application opens a promotion dialog.

Players can choose:

- Queen
- Rook
- Bishop
- Knight

The promotion interface is generated dynamically by JavaScript.

---

## 🎛️ Controls

| Control | Function |
|---|---|
| ↶ | Undo the previous move |
| ◒ | Flip the chess board |
| ↻ | Start a new game |
| `Click` | Select a piece and destination |
| Arrow Keys | Navigate between board squares |

The application also supports keyboard navigation across the chessboard.

---

## 📱 Responsive Design

Zoro Club is designed for different screen sizes.

### Desktop

The interface uses a three-section layout:

```text
Game Information | Chess Board | Move History
```

### Tablet

The layout changes to place the move history underneath the main game area.

### Mobile

The application switches to a vertically stacked layout:

```text
Player Information
        ↓
Chess Board
        ↓
Move History
```

These layouts are implemented through CSS media queries for screens below 1050px and 650px.

---

## 🎨 Design

The interface uses a dark green aesthetic with a lime accent.

Main design characteristics include:

- Minimal interface
- Dark background
- Green accent color
- Rounded controls
- Animated interactions
- Large readable chess pieces
- Responsive board
- Modern typography

The project uses **Manrope** for the primary interface font and **DM Mono** for technical/game information.

---

## 🚀 Running the Project

### Option 1 — VS Code Live Server

1. Clone or download the repository.
2. Open the project folder in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html`.
5. Select **Open with Live Server**.
6. Start playing.

### Option 2 — Local Web Server

Because the JavaScript imports `chess.js` as an ES module, using a local web server is recommended rather than opening the HTML file directly.

For example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## 📦 Dependencies

The project currently uses:

```text
chess.js 1.4.0
```

loaded from:

```text
jsDelivr CDN
```

No backend or database is required for the current local game implementation.

---

## 🔐 Privacy

Zoro Club is designed as a local browser-based chess game.

There is currently:

- No user account system
- No database
- No backend server
- No online multiplayer
- No game synchronization

Game state is handled in the browser using JavaScript.

---

## 🔮 Future Improvements

Possible future versions could include:

- 🤖 AI opponent
- 🌐 Online multiplayer
- 👤 Player profiles
- 🏆 Chess ratings
- 💾 Save and load games
- 📤 PGN export/import
- ⏱️ Multiple time controls
- 🔊 Move sounds
- 🎨 Multiple board themes
- 🌍 Online matchmaking
- 📊 Game statistics
- 📱 PWA/mobile installation
- 🧠 Chess analysis engine
- 🔗 Shareable game links

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/new-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add new feature"
```

5. Push the branch.

```bash
git push origin feature/new-feature
```

6. Open a Pull Request.

---

## 📄 License

This project does not currently specify a license.

If you plan to make the repository public, consider adding an appropriate open-source license such as MIT.

---

## ❤️ About

**Zoro Club Chess**

> Take your time. Find your line.

A simple local chess experience focused on clean design, responsive interaction, and the classic game of chess.

---

⭐ If you like the project, consider giving the repository a star.
