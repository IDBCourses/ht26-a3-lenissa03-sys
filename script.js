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



// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.

// MELODY
const note2 = [  "E4", "E4", "E4",
  "E4", "E4", "E4",
  "E4", "G4", "C4", "D4", "E4",
  "F4", "F4", "F4", "F4",
  "F4", "E4", "E4", "E4",
  "E4", "D4", "D4", "E4", "D4", "G4"];


// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

//VARIABLES
let shape; // song
let shape2; // effect
let star;
let songPlaying = false;
let scheduledNotes = [];  // stores timers ID+-*

let previousX = 0;
let previousY = 0;
let previousTime = null;
let starRotation = 0;

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.

const reverb = new Tone.Reverb({
  decay: 2,
  wet: 0.3
}).toDestination();

const synth = new Tone.Synth().connect(reverb);

// ---------- Update ----------
// Update the state. This is called every 100ms.

function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.

function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.


function pointerDown() {
  Tone.start();

  if (songPlaying === false) {
    playSong();
  } else {
    stopSong();
  }
}

function playSong() {
  songPlaying = true;
  scheduledNotes = [];

  shape2.setColour(0, 0, 100);

  for (let i = 0; i < note2.length; i++) {
    const timer = setTimeout(function() {
      synth.triggerAttackRelease(note2[i], "8n");

      if (i === note2.length - 1) {
        songPlaying = false;
        scheduledNotes = [];
        resetColours();
      }
    }, i * 500);

    scheduledNotes.push(timer);
  }
}

function stopSong() {
  for (let i = 0; i < scheduledNotes.length; i++) {
    clearTimeout(scheduledNotes[i]);
  }

  scheduledNotes = [];
  songPlaying = false;
  synth.triggerRelease();

  resetColours();
}

function resetColours() {
  shape2.setColour(45, 100, 50);
  reverb.wet.value = 0.3;
  shape.setColour(0, 100, 38);
}



function pointerEnter() {     // starts the effect
  if (songPlaying === true) {
    reverb.wet.value = 0.8;
    shape.setColour(170, 200, 26); // green while effect is active
  }
}

function pointerLeave() {  // stops the effect
  reverb.wet.value = 0.3;
  shape.setColour(0, 100, 38); // red again
}


function pointerMove(event) {
  const currentX = event.clientX;
  const currentY = event.clientY;
  const currentTime = event.timeStamp;

  if (previousTime !== null) {
    const distanceX = currentX - previousX;
    const distanceY = currentY - previousY;

    const distance = Math.sqrt(
      distanceX * distanceX + distanceY * distanceY
    );

    const timeDifference = currentTime - previousTime;
    const speed = distance / timeDifference;

    synth.detune.value = speed * 200;

    starRotation = starRotation + speed * timeDifference * 0.5;
    star.setRotation(starRotation);
  }

  previousX = currentX;
  previousY = currentY;
  previousTime = currentTime;
}


// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!



function setup() {
  update(); // start the update loop
  use(); // start the use loop

// triangle bottom
  const triangle = createShape("triangle");
  triangle.setPosition(0.345, 0.37);
  triangle.setSize(350);
  triangle.setColour(140, 80, 26);  // green

// triangle middle
  const triangle2 = createShape("triangle");
  triangle2.setPosition(0.385, 0.3);
  triangle2.setSize(250);
  triangle2.setColour(140, 80, 26);  // green

// triangle top
  const triangle3 = createShape("triangle");
  triangle3.setPosition(0.405, 0.2);
  triangle3.setSize(200);
  triangle3.setColour(140, 80, 26);  // green

// song: gold originally
  shape2 = createShape("shape2");
  shape2.setPosition(0.359, 0.485);
  shape2.setColour(45, 100, 50);  // gold
  shape2.setSize(100)

// effect: red originally
  shape = createShape("shape");
  shape.setPosition(0.57, 0.66);
  shape.setColour(0, 100, 38);  // red
  shape.setSize(100)

//star on top
  star = createShape("star");
  star.setPosition(0.436, 0.12);
  star.setSize(120);
  star.setColour(45, 100, 50);
  star.setRotation(0);


  shape.element.addEventListener("pointerenter", pointerEnter);
  shape.element.addEventListener("pointerleave", pointerLeave);

  // Also add pointerdown for whole window


  // i only want sound coming from an interaction with an shape
  //window.addEventListener("pointerdown", pointerDown);
  //window.addEventListener("pointerup", pointerUp);

  shape2.element.addEventListener("pointerdown", pointerDown);

  window.addEventListener("pointermove", pointerMove);
}



setup(); // Always remember to call setup()!
