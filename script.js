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

let shape; // song
let shape2; // effect
let triangle

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
const note = "C4";// the note played when the pointer goes down
const note2 = [  "C5", "E5", "G5", "B5", "G5", "E5", "A5", "G5",
  "E5", "C5", "D5", "F5", "A5", "F5", "D5", "G5",
  "B5", "D6", "B5", "G5", "A5", "G5", "E5", "D5",
  "C5", "E5", "G5", "E5", "A5", "G5", "E5", "C5",
  "D5", "F5", "A5", "F5", "D5", "C5", "G4", "C5"];


// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

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
//function startSound(event) {
//  Tone.start(); // sound is allowed after a click
//}
function pointerDown(event) {
  Tone.start();

  console.log("Pointer down at", event.clientX, event.clientY);

  const startTime = Tone.now();

  for (let i = 0; i < note2.length; i++) {
    synth.triggerAttackRelease(
      note2[i],
      "8n",
      startTime + i * 0.3
    );
  }

  shape2.setColour(50, 100, 60);
}


function pointerEnter(event) {
  Tone.start();
  synth.triggerAttack("C4"); // starts effect
  shape.setColour(50, 100, 60);
}

function pointerLeave(event) {
  synth.triggerRelease("C4"); // stops effect
  shape.setColour(200, 80, 50);
}



// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!



function setup() {
  update(); // start the update loop
  use(); // start the use loop


// effect
  shape = createShape("effect");
  shape.setPosition(0.6, 0.4);
  shape.setColour(50, 100, 60);

//song
  shape2 = createShape("song");
  shape2.setPosition(0.0, 0.4);
  shape2.setColour(150, 100, 20);

// triangle
  triangle = createShape("triangle");
  triangle.setPosition(0.0, 0.0);
  triangle.setSize();
  triangle.setColour(200, 100, 60);

  shape.element.addEventListener("pointerenter", pointerEnter);
  shape.element.addEventListener("pointerleave", pointerLeave);

  // Also add pointerdown for whole window


  // i only want sound coming from an interaction with an shape
  //window.addEventListener("pointerdown", pointerDown);
  //window.addEventListener("pointerup", pointerUp);

  shape2.element.addEventListener("pointerdown", pointerDown);
  shape2.element.addEventListener("pointerup", pointerUp);
}



setup(); // Always remember to call setup()!
