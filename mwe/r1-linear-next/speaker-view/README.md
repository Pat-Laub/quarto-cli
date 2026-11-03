# Speaker-view check for #3831

`deck.html` is #3831's layout: stacks [A, B, C] and [X, Y], with the notes plugin.
Put a built `reveal.js`, `reveal.css` and `plugin/notes.js` (as `notes.js`) next
to it. `tools/probe/r1-speaker.js` drives it with Playwright. It expects two copies
of the page, `deck-master.html` and `deck-fix.html`, each loading its own build as
`reveal-master.js` / `reveal-fix.js`. It opens the speaker view with `s`, steps
A → B → C → X → Y, back to C, and reports what the Upcoming pane shows:
`master` shows Y, the fix shows X.
