// 3rd Party imports
import easymidi from "easymidi";

//local imports
import { handleFaderInput } from "./fader";
import { handleNoteOff, handleNoteON } from "./button";
import { startupAnimation } from "./StartupAnim";
import { connect } from "./websocket";
import { userInterface } from "./therminal";

//config
const midiDevice = "APC mini mk2";

//global variables
export let wing: number = 0; //0 = Core Wing + B-Wing 1; 1 = F-Wing 1 + B-Wing 2
export let showFaderButtons: Boolean = false;
export let blackout: Boolean = false;
export let pageIndex2: number = 0;
export let pageIndex: number = 0;

export const ui = new userInterface();

//display info
ui.log("Akai APC mini .2 WING " + 1);
ui.log(" ");

//display all midi devices and selected midi device
ui.log("Midi IN");
ui.log(easymidi.getInputs());
ui.log("Midi OUT");
ui.log(easymidi.getOutputs());
ui.log(" ");
ui.log("Connecting to midi device " + midiDevice);

//open midi device
export let input = new easymidi.Input(midiDevice);
export let output = new easymidi.Output(midiDevice);

ui.log("Connecting to dot2 ...");

// startup animation
// startupAnimation(output, true);

//turn on led buttons
output.send("noteon", { note: 118, velocity: 1, channel: 0 });
output.send("noteon", { note: 119, velocity: 0, channel: 0 });

//handle midi stuff
input.on("noteon", function (msg) {
  handleNoteON(msg);
});

input.on("noteoff", function (msg) {
  handleNoteOff(msg);
});

//handles fader input
input.on("cc", function (msg) {
  handleFaderInput(msg);
});

connect();

//setter
export function setWing(value: number) {
  wing = value;
}

export function setShowFaderButtons(value: Boolean) {
  showFaderButtons = value;
}

export function setBlackout(value: Boolean) {
  blackout = value;
}
