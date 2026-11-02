/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";



// ---------- SETTINGS ------------------------------------------------------------------------------------------------------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.

// melody
const melody = [  "E4", "E4", "E4",
  "E4", "E4", "E4",
  "E4", "G4", "C4", "D4", "E4",
  "F4", "F4", "F4", "F4",
  "F4", "E4", "E4", "E4",
  "E4", "D4", "D4", "E4", "D4", "G4"];



// ---------- STATE -----------------------------------------------------------------------------------------------------------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

//VARIABLES
//Shapes
let redOrn; // effect
let goldOrn; // song
let star;

//song state
let songPlaying = false;
let scheduledNotes = [];  // Stores the IDs of scheduled note timers.
            
//pointer state
let previousX = 0;
let previousY = 0;
let previousTime = null;

//star state
let starRotation = 0;

// ---------- SOUND -------------------------------------------------------------------------------------------------------------
// Make the instruments and plug them into the speakers.

// reverb effect. starts at 0
const reverb = new Tone.Reverb({
  decay: 2,  // fading of reverb
  wet: 0     // how much reverb
}).toDestination();

//new synthesiser, creates instrument, connect instrument to reverb instead of note, in variable synth
const synth = new Tone.Synth().connect(reverb);

synth.volume.value = 20;


// ---------- UPDATE ------------------------------------------------------------------------------------------------------------
// Repeats every 100ms. Reserved for updating the instrument's state.

function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}


// ---------- USE ----------------------------------------------------------------------------------------------------------------
// Repeats every 100ms. Reserved for using the state to control sound and visuals.

function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}


// ---------- CONTROLS (Event Handlers) -------------------------------------------------------------------------------------------
// Runs every time the pointer goes down: a click, a tap or a pen touch.

// Starts or stops the melody when the song shape is clicked.
function pointerDown() {
 Tone.start();

  if (songPlaying === false) {
    playSong();
  } else {
    stopSong();
  }
}

// Plays the melody by scheduling each note with a delay.
function playSong() {
  songPlaying = true;
  scheduledNotes = [];

  synth.volume.value = 20;
  reverb.wet.value = 0;

  goldOrn.setColour(0, 0, 100);

  // Schedule each note with a 500ms delay between notes.
  for (let i = 0; i < melody.length; i++) {
    const timer = setTimeout(function() {
      // Play the current note in the melody.
      synth.triggerAttackRelease(melody[i], "8n");

      // Reset the song state after the final note.
      if (i === melody.length - 1) {
        songPlaying = false;
        scheduledNotes = [];
        resetColours();
      }
    }, i * 500);

    scheduledNotes.push(timer);   // Store the timer ID so playback can be cancelled.
  }

}

// Cancels scheduled notes and stops the current melody.
function stopSong() {
  for (let i = 0; i < scheduledNotes.length; i++) {
    clearTimeout(scheduledNotes[i]);
  }

  scheduledNotes = [];
  songPlaying = false;
  synth.triggerRelease();

  resetColours();
}

// Restores the original colours of the interactive shapes.
function resetColours() {
  goldOrn.setColour(45, 100, 50);
  redOrn.setColour(0, 100, 38);
}

// Activates the reverb effect when the pointer enters the effect shape.
function pointerEnter() {
  if (songPlaying === true) {
    reverb.wet.value = 1;
    redOrn.setColour(170, 200, 26); // green while effect is active
  }
}

// Turns off the reverb effect when the pointer leaves the effect shape.
function pointerLeave() {
  reverb.wet.value = 0.0;
  redOrn.setColour(0, 100, 38); // red again
  //synth.volume.value = 30; // gets song back to same volume
}

// Calculates pointer speed and movement distance.
function pointerMove(event) {
  const currentX = event.clientX;
  const currentY = event.clientY;
  const currentTime = event.timeStamp;

  if (previousTime !== null) {

    const distanceX = currentX - previousX;
    const distanceY = currentY - previousY;

    const distance = Math.sqrt(
      distanceX * distanceX + distanceY * distanceY   // calculates distance between 2 positions
    );

    const timeDifference = currentTime - previousTime;  // calculates time difference

    if (timeDifference > 0) {

      const speed = distance / timeDifference;

      if (Number.isFinite(speed)) {

        synth.detune.value = speed * 200;

        starRotation = starRotation + distance * 0.5;

        star.setRotation(starRotation);
      }
    }
  }

  previousX = currentX;
  previousY = currentY;
  previousTime = currentTime;
}

// Resets pointer history when the pointer leaves the window or the window loses focus.
function resetPointerTracking() {  // to make the pointer still work outside screen. By forgetting previous pointer.
  previousTime = null;
  previousX = 0;
  previousY = 0;
}

// ---------- SETUP ------------------------------------------------------------------------------------------------------------------
// Setup is run once, at the start of the program. It sets everything up for us!

function setup() {
  update(); // start the update loop
  use(); // start the use loop

//-------------Decorative Shapes----------------
// triangle bottom
  const triangleBo = createShape("triangle");
  //triangleBo.setPosition(0.345, 0.37);
  triangleBo.setPositionPixels(515.84, 250.12);
  triangleBo.setSize(350);
  triangleBo.setColour(140, 80, 26);  // green

// triangle middle
  const triangleMi = createShape("triangle");
  //triangleMi.setPosition(0.385, 0.3);
  triangleMi.setPositionPixels(566.72, 202.80);
  triangleMi.setSize(250);
  triangleMi.setColour(140, 80, 26);  // green

// triangle top
  const triangleTop = createShape("triangle");
  //triangleTop.setPosition(0.405, 0.2);
  triangleTop.setPositionPixels(596.16, 135.20);
  triangleTop.setSize(200);
  triangleTop.setColour(140, 80, 26);  // green

  //-------------Interactive Shapes----------------
// song: gold originally
  goldOrn = createShape("goldOrn");
  //goldOrn.setPosition(0.359, 0.485);
  goldOrn.setPositionPixels(528.45, 327.86);
  goldOrn.setColour(45, 100, 50);  // gold
  goldOrn.setSize(100)

// effect: red originally
  redOrn = createShape("redOrn");
  //shape.setPosition(0.57, 0.66);
  redOrn.setPositionPixels(790.04, 440.16);
  redOrn.setColour(0, 100, 38);  // red
  redOrn.setSize(100)

//rotating star
  star = createShape("star");
  //star.setPosition(0.436, 0.12);
  star.setPositionPixels(641.79, 81.12);
  star.setSize(120);
  star.setColour(45, 100, 50);
  star.setRotation(0);

// ---------- Pointer event listeners ----------
  redOrn.element.addEventListener("pointerenter", pointerEnter);
  redOrn.element.addEventListener("pointerleave", pointerLeave);

  // i only want sound coming from an interaction with an shape
  //window.addEventListener("pointerdown", pointerDown);
  //window.addEventListener("pointerup", pointerUp);

  goldOrn.element.addEventListener("pointerdown", pointerDown);

  window.addEventListener("pointermove", pointerMove);

  // Reset pointer tracking when the pointer leaves the document.
  document.addEventListener("pointerout", function(event) { // setup for resetPointerTracking
  if (event.relatedTarget === null) {
    resetPointerTracking();
  }
  });

  window.addEventListener("blur", resetPointerTracking);
}


setup(); // Always remember to call setup()!
