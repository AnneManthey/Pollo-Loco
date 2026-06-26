
Desk

(script.js wieder entfernen?)

- Bars (HP, Ammo, Score) fixen/optimieren
    - dyn. Zahl einfügen
- Bosskampf Bewegungen und range optimieren
    - läuft erst rein, bevor er angreift?
    


- Landing Page
    - Verknüpfung zu game.html
    - Erklärung Steuerung
- Loading Spinner (game.html)
    - Storyerklärung, während es läd?

- Steuerung WASD hinzufügen


1. Funktionalität
- Coins 
    - Erhöhen den Score (+1)
    - Leiste füllt sich
    - [optional] Sowohl besiegte Gegner als auch Coins füllen Score, Leiste durch Score-Zahl ersetzen
- Flaschen
    - Munition
    - Leiste füllt sich
- Flaschen nur werfen, wenn vorhanden
    - Sound/Meldung wenn leer?


- Charakter:
    - 3 x Char Statusbar:
        - Leben
        - Munition
        - Score
    - Animationen
        - Dead

- Gegner:
    - Besiegen erhöht den Score
        - klein: 1 Flaschenwurf / draufspringen (+1)
        - mittel: 2 Flaschen / 2x Draufspringen (+2) / Aggro
        - Entgegner: 5 Flaschen (+10)
    - Animationen
        - Angriff
        - Verletzt
        - Besiegt
- Endgegner
    - Moves / Angriffe: Fernkampf Spucken/Sprungangriff o.ä.?
    - Lebensleiste
    - nach Tod Endscreen anzeigen

- UI:
    - Einblendung Steuerung [optional]
    - Sounds & Musik an/ausschalten
    - Fullscreen Button
    - Pause/Weiter/Beenden Button
    

- [raussuchen] Hintergrundmusik & Soundelemente:
    - Start
    - Hintergrundmusik
    - Laufen
    - Springen
    - Coins einsammeln
    - Flaschen einsammeln
    - Flaschen Treffer
    - Flaschen werfen
    - Keine Ammo
    - Draufspringen/treffer
    - Char: Schnarchen, get Hit, 
    - Gegner: Angriff/Fauchen o.ä.
    - Entgegner: gackern bei Schaden erleiden o.ä.
    - Besiegt/Game Over

- [raussuchen] Grafiken/IMG
    - Landing Page Hintergrund
    - Favicon
    - Musik an/aus (zu sound)



2. Anpassen & Gestalten

- passende Schriftart raussuchen/einbinden
- Favicon, Buttons cursor:pointer
- responsive / Mobile(Querformat)
    - mobile buttons für steuerung
    - Screen 'pls turn your device to play'

- Landing Page:
    - Hintergrundbild
    - Schriftart passend
    - Steuerung/Tastenbelegung
    - Story-Erklärung
    - Start Button
    - Button für Fullscreen [optional] (make canvas/div fullscreen, request fullscreen)
    - Sounds & Musik an/ausschalten (Speichern im Local Storage)
    - Impressum (Anbieter, rechtliche Hinweise etc.)

- Loading Spinner, während Spiel läd
- Endscreen
    - Win/Lose Bild
    - Highscore[optional]
    - Button Try Again
    - Verlassen / Zurück zur Landing Page


Anforderungen Projekt:
- Start Screen
- Coins einsammeln
- Flaschen einsammeln
- Endgegner besiegen
- Game-Over Screen / Endscreen mit Play again & verlassen option
- Fullscreen
- Erklärung der Steuerung (zb. dialog auf landing page)
- Sound/Musik
- Responsive
- Mobile Version / Mobile touch Buttons
- Impressum


3. Optional:
- Gegner drehen sich um, wenn Char in Reichweite?
- Character austauschen, zb: Känguru? Cowboy? Sith? Sprites mit KI generieren?
- Gegner austauschen, zb.: Stachelschwein/Igel (nicht draufspringen!)
- Eigenes Gamedesign - angelehnt an Stormlight/Roshar oder Star Wars?
    - from zero to radiant / Sith Lord
    - mehrere level, jeweils am ende aufleveln
    - Moves freischalten, char entwickelt sich optisch weiter
    - kleine Story - cutszenes mit Antwortmöglichkeiten?