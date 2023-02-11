import { output } from "./main";
import { ledmatrix } from "./lighting";
import { lights } from "./types/types";

//sleep function
export const sleep = (time: number, callback?: () => void) => {
  var stop = new Date().getTime();
  while (new Date().getTime() < stop + time) {}
  if (callback) callback();
};

//midi clear function
export function clearLights() {
  for (let i = 0; i < 90; i++) {
    ledmatrix[i] = 0;
    output.send("noteon", { note: i, velocity: lights.OFF, channel: 0 });
    sleep(10);
  }
}
