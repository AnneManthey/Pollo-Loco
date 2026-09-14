# El Pollo Loco

**El Pollo Loco** is a browser-based 2D platform game built with vanilla HTML, CSS, and JavaScript. Guide Pepe through the desert, collect coins and salsa bottles, defeat chickens, and face the Chicken King.

## Features

- Animated canvas-based gameplay
- Collectable coins and salsa bottles
- Normal and small chicken enemies, plus an end boss
- Jump attacks and throwable salsa bottles
- Health, score, bottle, and boss status bars
- Sound effects and background music controls
- Fullscreen mode
- Keyboard controls and mobile touch buttons
- Responsive layout with landscape guidance for mobile devices
- Start, game-over, and victory screens

## Controls

| Action | Key |
| --- | --- |
| Move left | Left Arrow |
| Move right | Right Arrow |
| Jump / attack enemies | Spacebar or Up Arrow |
| Throw a salsa bottle | D |

> Throwing requires collected salsa bottles.

## Getting Started

No installation or build step is required. Clone the repository and serve its root directory with any local static web server:

```bash
git clone git@github.com:AnneManthey/Pollo-Loco.git
cd Pollo-Loco
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser and select **Play**.

You can also open `index.html` directly, but a local web server is recommended for consistent browser behaviour.

## Project Structure

```text
.
├── index.html              # Landing page
├── game.html               # Game page and script loading order
├── controls.html           # Controls page
├── story.html              # Game story
├── js/
│   ├── game.js             # Game initialisation and main game logic
│   ├── levels/             # Level definitions
│   └── models/             # Entities, world, rendering, and collision classes
├── styles/                 # Shared fonts, responsive, and fullscreen styles
├── assets/                 # Icons, font, and audio files
└── img/                    # Sprite sheets, backgrounds, and UI images
```

## Technologies

- HTML5 Canvas
- CSS3, including responsive and fullscreen styling
- Vanilla JavaScript (ES6 classes)
- Web Audio via HTML audio elements

## Author

Created by Anne Manthey (2026).
