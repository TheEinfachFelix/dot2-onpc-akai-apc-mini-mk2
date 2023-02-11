import easymidi from "easymidi";
import { faderValueMem } from "./fader";
import { client, session } from "./websocket";
import {
  blackout,
  pageIndex,
  pageIndex2,
  setBlackout,
  setShowFaderButtons,
  setWing,
  showFaderButtons,
  ui,
  wing,
} from "./main";
import { updateLights } from "./lighting";
import { exec } from "./fader";

const fbuttons = [7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0];
const buttons = {
  wing: [
    [
      207, 206, 205, 204, 203, 202, 201, 200, 107, 106, 105, 104, 103, 102, 101,
      100, 807, 806, 805, 804, 803, 802, 801, 800, 707, 706, 705, 704, 703, 702,
      701, 700, 607, 606, 605, 604, 603, 602, 601, 600, 507, 506, 505, 504, 503,
      502, 501, 500, 407, 406, 405, 404, 403, 402, 401, 400, 307, 306, 305, 304,
      303, 302, 301, 300,
    ],
    [
      207, 206, 205, 204, 203, 202, 201, 200, 107, 106, 105, 104, 103, 102, 101,
      100, 815, 814, 813, 812, 811, 810, 809, 808, 715, 714, 713, 712, 711, 710,
      709, 708, 615, 614, 613, 612, 611, 610, 609, 608, 515, 514, 513, 512, 511,
      510, 509, 508, 415, 414, 413, 412, 411, 410, 409, 408, 315, 314, 313, 312,
      311, 310, 309, 308,
    ],
  ],
};

export function handleNoteOff(msg: easymidi.Note) {
  if (msg.note >= 0 && msg.note <= 15) {
    if (!showFaderButtons) {
      client.send(
        '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
          buttons.wing[wing][msg.note] +
          ',"pageIndex":' +
          pageIndex2 +
          ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' +
          session +
          ',"maxRequests":0}'
      );
    } else {
      if (msg.note < 8) {
        client.send(
          '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
            fbuttons[msg.note] +
            ',"pageIndex":' +
            pageIndex2 +
            ',"buttonId":1,"pressed":false,"released":true,"type":0,"session":' +
            session +
            ',"maxRequests":0}'
        );
      } else {
        client.send(
          '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
            fbuttons[msg.note] +
            ',"pageIndex":' +
            pageIndex2 +
            ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' +
            session +
            ',"maxRequests":0}'
        );
      }
    }
  }

  if (msg.note >= 16 && msg.note <= 63) {
    client.send(
      '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
        buttons.wing[wing][msg.note] +
        ',"pageIndex":' +
        pageIndex +
        ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' +
        session +
        ',"maxRequests":0}'
    );
  }

  if (msg.note >= 100 && msg.note <= 107) {
    client.send(
      '{"requestType":"playbacks_userInput","execIndex":' +
        exec.index[wing][msg.note - 100] +
        ',"pageIndex":' +
        pageIndex2 +
        ',"faderValue":' +
        faderValueMem[msg.note - 52] +
        ',"type":1,"session":' +
        session +
        ',"maxRequests":0}'
    );
  }
}

export function handleNoteON(msg: easymidi.Note) {
  if (msg.note >= 0 && msg.note <= 15) {
    if (!showFaderButtons) {
      client.send(
        '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
          buttons.wing[wing][msg.note] +
          ',"pageIndex":' +
          pageIndex2 +
          ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' +
          session +
          ',"maxRequests":0}'
      );
    } else {
      if (msg.note < 8) {
        client.send(
          '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
            fbuttons[msg.note] +
            ',"pageIndex":' +
            pageIndex2 +
            ',"buttonId":1,"pressed":true,"released":false,"type":0,"session":' +
            session +
            ',"maxRequests":0}'
        );
      } else {
        client.send(
          '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
            fbuttons[msg.note] +
            ',"pageIndex":' +
            pageIndex2 +
            ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' +
            session +
            ',"maxRequests":0}'
        );
      }
    }
  }

  if (msg.note >= 16 && msg.note <= 63) {
    client.send(
      '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
        buttons.wing[wing][msg.note] +
        ',"pageIndex":' +
        pageIndex +
        ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' +
        session +
        ',"maxRequests":0}'
    );
  }

  if (msg.note >= 100 && msg.note <= 107) {
    client.send(
      '{"requestType":"playbacks_userInput","execIndex":' +
        exec.index[wing][msg.note - 100] +
        ',"pageIndex":' +
        pageIndex2 +
        ',"faderValue":' +
        1 +
        ',"type":1,"session":' +
        session +
        ',"maxRequests":0}'
    );
  }

  //no function yet
  if (msg.note >= 82 && msg.note <= 86) {
    ui.info("no function yet");
  }

  //show first wing set when lower wing select button is pressed
  if (msg.note == 117) {
    setWing(1);
    updateLights();
  }

  //show second wing set when upper wing select button is pressed
  if (msg.note == 118) {
    setWing(0);
    updateLights();
  }

  //toggle show Fader Buttons
  if (msg.note == 119) {
    if (showFaderButtons) {
      setShowFaderButtons(false);
    } else {
      setShowFaderButtons(true);
    }
    updateLights();
  }

  //blackout
  if (msg.note == 122) {
    //toggle Button
    if (!blackout) {
      client.send(
        '{"command":"SpecialMaster 2.1 At 0","session":' +
          session +
          ',"requestType":"command","maxRequests":0}'
      );
      setBlackout(true);
    } else if (blackout) {
      client.send(
        '{"command":"SpecialMaster 2.1 At ' +
          faderValueMem[56] * 100 +
          '","session":' +
          session +
          ',"requestType":"command","maxRequests":0}'
      );
      setBlackout(false);
    }
  }
}
