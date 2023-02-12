import { blackout, output, showFaderButtons, wing } from "./main";
import { lights } from "./types/types";

import { userInterface } from "./therminal";
export const ui = new userInterface();

export let ledmatrix = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 5, 5, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
  0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 5, 0, 0, 0, 0, 0,
  0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

export function updateLights() {
  if (wing == 0) {
    output.send("noteon", { note: 117, velocity: lights.OFF, channel: 0 });
    output.send("noteon", { note: 118, velocity: lights.ON, channel: 0 });
  } else if (wing == 1) {
    output.send("noteon", { note: 117, velocity: lights.ON, channel: 0 });
    output.send("noteon", { note: 118, velocity: lights.OFF, channel: 0 });
  }

  if (!showFaderButtons) {
    output.send("noteon", { note: 119, velocity: lights.OFF, channel: 0 });
  } else {
    output.send("noteon", { note: 119, velocity: lights.ON, channel: 0 });
  }
}

export function wsUpdateLights(obj: any) {
  //update button lights (upper 8x6)
  var iterations: number[];
  if (obj.responseSubType == 3) {
    var j = 63;
    iterations = [0, 8];
    if (wing == 1) {
      iterations = [8, 16];
    }

    if (wing == 0) {
      for (let k = 0; k < 6; k++) {
        for (let i = 0; i < 8; i++) {
          var m = lights.Red;
          var n = lights.Normal;
          if (obj.itemGroups[k].items[i][0].isRun == 1) {
            if (blackout) {
              m = lights.Green_Blink;
              n = lights.Blink;
            } else {
              m = lights.Green;
              n = lights.Normal;
            }
          } else if (obj.itemGroups[k].items[i][0].i.c == "#000000") {
            m = lights.OFF;
          } else {
            m = lights.Yellow;
          }

          if (ledmatrix[j] != m) {
            ledmatrix[j] = m;
            output.send("noteon", { note: j, velocity: m, channel: n });
          }
          j = j - 1;
        }
      }
    } else if (wing == 1) {
      for (let k = 0; k < 6; k++) {
        for (let i = 8; i < 16; i++) {
          var m = lights.Red;
          if (obj.itemGroups[k].items[i][0].isRun == 1) {
            if (blackout) {
              m = lights.Green_Blink;
            } else {
              m = lights.Green;
            }
          } else if (obj.itemGroups[k].items[i][0].i.c == "#000000") {
            m = lights.OFF;
          } else {
            m = lights.Yellow;
          }

          if (ledmatrix[j] != m) {
            ledmatrix[j] = m;
            output.send("noteon", { note: j, velocity: m, channel: 6 });
          }
          j = j - 1;
        }
      }
    }
  }

  if (obj.responseSubType == 2) {
    const itemNR = Object.keys(obj.itemGroups[0].items).length;
    var iterations = [6];
    var jIndex: number[] = [71, 15, 7];

    if (itemNR == 8) {
      iterations = [2];
      jIndex = [65, 9, 1];
    }

    //core buttons
    j = jIndex[0];
    for (let i = 0; i < iterations[0]; i++) {
      //faders dots
      m = lights.OFF;
      var n = lights.Normal;
      if (obj.itemGroups[0].items[i][0].isRun == 1) {
        if (blackout) {
          m = lights.Green_Blink;
          n = lights.Blink;
        } else {
          m = lights.Green;
          n = lights.Normal;
        }
      } else if (obj.itemGroups[0].items[i][0].i.c == "#000000") {
        m = 0;
      } else {
        m = 1;
      }
      if (ledmatrix[j] != m) {
        ledmatrix[j] = m;
        var jx = j + 36;
        output.send("noteon", { note: jx, velocity: m, channel: 0 });
      }

      if (showFaderButtons) {
        //display faders lower buttons
        if (obj.itemGroups[0].items[i][0].isRun == 1) {
          if (blackout) {
            m = lights.Green_Blink;
            n = lights.Blink;
          } else {
            m = lights.Green;
            n = lights.Normal;
          }
        } else if (obj.itemGroups[0].items[i][0].i.c == "#000000") {
          m = lights.OFF;
        } else {
          m = lights.Red;
        }

        if (ledmatrix[j - 64] != m) {
          ledmatrix[j - 64] = m;
          output.send("noteon", { note: j - 64, velocity: m, channel: n });
        }

        if (m == lights.Green || m == lights.Green_Blink) m = lights.Red;

        if (ledmatrix[j - 56] != m) {
          ledmatrix[j - 56] = m;
          output.send("noteon", { note: j - 56, velocity: m, channel: 6 });
        }
      }

      j = j - 1;
    }

    //executor buttons
    if (!showFaderButtons) {
      j = jIndex[1];
      var n = lights.Normal;
      //display fader upper buttons 101 - 106
      for (let i = 0; i < iterations[0]; i++) {
        if (obj.itemGroups[1].items[i][0].isRun == 1) {
          if (blackout) {
            m = lights.Green_Blink;
            n = lights.Blink;
          } else {
            m = lights.Green;
            n = lights.Normal;
          }
        } else if (obj.itemGroups[1].items[i][0].i.c == "#000000") {
          m = lights.OFF;
        } else {
          m = lights.Yellow;
        }
        if (ledmatrix[j] != m) {
          ledmatrix[j] = m;
          output.send("noteon", { note: j, velocity: m, channel: n });
        }
        j = j - 1;
      }
      //display faders lower buttons (201 - 206)
      j = jIndex[2];
      for (let i = 0; i < iterations[0]; i++) {
        if (obj.itemGroups[2].items[i][0].isRun == 1) {
          if (blackout) {
            m = lights.Green_Blink;
            n = lights.Blink;
          } else {
            m = lights.Green;
            n = lights.Normal;
          }
        } else if (obj.itemGroups[2].items[i][0].i.c == "#000000") {
          m = lights.OFF;
        } else {
          m = lights.Yellow;
        }
        if (ledmatrix[j] != m) {
          ledmatrix[j] = m;
          output.send("noteon", { note: j, velocity: m, channel: n });
        }
        j = j - 1;
      }
    }
  }
}
