import easymidi from "easymidi";
import { client, session } from "./websocket";
import { pageIndex2, blackout, ui } from "./main";

//variables
export let asignValue = [
  0, 0, 0, 0.008, 0.01, 0.012, 0.014, 0.018, 0.022, 0.026, 0.03, 0.034, 0.038,
  0.042, 0.046, 0.05, 0.053, 0.057, 0.061, 0.065, 0.069, 0.073, 0.077, 0.081,
  0.085, 0.089, 0.093, 0.097, 0.1, 0.104, 0.108, 0.112, 0.116, 0.12, 0.124,
  0.128, 0.132, 0.136, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.22,
  0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.3, 0.31, 0.32, 0.33, 0.34, 0.35,
  0.36, 0.37, 0.38, 0.39, 0.4, 0.41, 0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48,
  0.49, 0.5, 0.51, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59, 0.6, 0.61,
  0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73, 0.74,
  0.75, 0.76, 0.77, 0.78, 0.79, 0.8, 0.81, 0.82, 0.83, 0.84, 0.85, 0.86, 0.87,
  0.88, 0.89, 0.9, 0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1, 1,
  1, 1,
];

export let exec = {
  index: [[7, 6, 5, 4, 3, 2, 1, 0]],
};

export let faderValueMem = [0, 0, 0];
export let faderTime: Array<[number, number]> = [];
export const NS_PER_SEC = 1e9;

for (let i = 0; i < 8; i++) {
  //fader time set
  faderTime[i] = process.hrtime();
}

export function handleFaderInput(msg: easymidi.ControlChange) {
  let diff = process.hrtime(faderTime[msg.controller]);
  if (
    diff[0] * NS_PER_SEC + diff[1] >= 50000000 ||
    msg.value == 0 ||
    msg.value == 127
  ) {
    faderTime[msg.controller] = process.hrtime();

    faderValueMem[msg.controller] = asignValue[msg.value];

    if (msg.controller == 56) {
      if (!blackout) {
        client.send(
          '{"command":"SpecialMaster 2.1 At ' +
            asignValue[msg.value] * 100 +
            '","session":' +
            session +
            ',"requestType":"command","maxRequests":0}'
        );
      }
    } else {
      client.send(
        '{"requestType":"playbacks_userInput","execIndex":' +
          exec.index[0][msg.controller - 48] +
          ',"pageIndex":' +
          pageIndex2 +
          ',"faderValue":' +
          asignValue[msg.value] +
          ',"type":1,"session":' +
          session +
          ',"maxRequests":0}'
      );
    }
  }
}
