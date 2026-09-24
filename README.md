# El Pollo Loco

El Pollo Loco is a browser-based 2D platform game built with vanilla HTML, CSS, and JavaScript. Guide Pepe through a desert level, collect coins and salsa bottles, defeat chicken enemies, and face the end boss. The game uses an HTML5 canvas with responsive styling and includes keyboard and mobile touch controls. It also provides sound effects, background music, fullscreen mode, and start, victory, and game-over screens.

## Quickstart

### Prerequisites

- A modern web browser
- A local static web server

There are no package manifests, dependencies, or build steps in this project.

### Setup

Clone the repository and serve its root directory:

```bash
git clone git@github.com:AnneManthey/Pollo-Loco.git
cd Pollo-Loco
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) and select **Play**. The project can also be opened through `index.html` directly, although a local server is recommended.

## Usage

From the landing page, open **Play**, **Controls**, or **Story**. During the game, use these controls:

| Action | Key |
| --- | --- |
| Move left | Left Arrow |
| Move right | Right Arrow |
| Jump / attack enemies | Spacebar or Up Arrow |
| Throw a salsa bottle | D |

Throwing requires collected salsa bottles. On supported mobile layouts, use the displayed touch buttons. The game page also includes controls for sound effects, music, and fullscreen mode.

## Project Structure

```text
.
├── index.html              # Landing page
├── game.html               # Game page and script loading order
├── controls.html           # Controls page
├── story.html              # Game story
├── legal-notice.html       # Legal notice and credits
├── js/
│   ├── game.js             # Game initialization and main game logic
│   ├── levels/             # Level definitions
│   └── models/             # Entities, world, rendering, and collision classes
├── styles/                 # Font, responsive, and fullscreen styles
├── assets/                 # Icons, fonts, and audio files
└── img/                    # Sprites, backgrounds, and UI images
```

## Author

Anne Manthey
