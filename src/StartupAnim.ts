import { sleep } from "./utils";
import { Output } from "easymidi";
import { ledmatrix } from "./lighting";
//clear led matrix and led status - show startup animation

export function startupAnimation(output: Output, show: boolean = false) {
  //clear screen
  for (let i = 0; i < 90; i++) {
    output.send("noteon", { note: i, velocity: 0, channel: 6 });
  }

  if (show) {
    //fill screen yellow top to botom
    var colNR = 56;
    for (let i = 0; i < 8; i++) {
      for (let k = 0; k < 8; k++) {
        output.send("noteon", { note: colNR + k, velocity: 5, channel: 6 });
      }
      colNR = colNR - 8;
      sleep(50);
    }
    sleep(500);

    //logo change negative
    for (let i = 0; i < 2; i++) {
      //normal logo
      for (let k = 0; k < 64; k++) {
        output.send("noteon", { note: k, velocity: ledmatrix[k], channel: 6 });
      }
      sleep(500);

      //negative logo
      for (let k = 0; k < 64; k++) {
        if (ledmatrix[k] == 0) {
          output.send("noteon", { note: k, velocity: 5, channel: 6 });
        } else if (ledmatrix[k] == 5) {
          output.send("noteon", { note: k, velocity: 0, channel: 6 });
        } else {
          output.send("noteon", { note: k, velocity: 0, channel: 6 });
        }
      }
      sleep(500);
    }
    //normal logo
    for (let k = 0; k < 64; k++) {
      output.send("noteon", { note: k, velocity: ledmatrix[k], channel: 6 });
    }
    sleep(500);

    //fill screen yellow instant
    for (let i = 0; i < 64; i++) {
      output.send("noteon", { note: i, velocity: 5, channel: 6 });
    }
    sleep(1000);

    //clear screen random
    let clearedPixels: number[] = [];
    let activated = true;
    while (activated) {
      if (clearedPixels.length == 64) {
        activated = false;
      }

      //generates random number from 1 to 64
      let randomNR = Math.floor(Math.random() * 64);
      if (!clearedPixels.includes(randomNR)) {
        clearedPixels.push(randomNR);
        output.send("noteon", { note: randomNR, velocity: 0, channel: 6 });
        sleep(25);
      }
    }
    sleep(2000);
  }
}
