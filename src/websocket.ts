import easymidi from "easymidi";
import { wsUpdateLights } from "./lighting";
import WebSocket from "ws";

import { pageIndex, pageIndex2, ui } from "./main";
import { clearLights } from "./utils";

export let session: number = 0;

let request: number = 0;

export const client: WebSocket = new WebSocket("ws://localhost:80/");

//connect function also for reconnect
export function connect() {
  client.on("error", (error) => {
    ui.error(error.message);
  });

  client.on("open", () => {
    ui.log("WebSocket Client Connected");
  });

  client.on("close", (reason) => {
    ui.error(reason.toString());
  });

  client.on("message", (data_buffer: WebSocket.RawData) => {
    handleMessage(data_buffer, client);
  });
}

function handleMessage(data_buffer: WebSocket.RawData, client: WebSocket) {
  request = request + 1;
  if (request >= 9) {
    client.send('{"session":' + session + "}");
    client.send(
      '{"requestType":"getdata","data":"set","session":' +
        session +
        ',"maxRequests":1}'
    );
    request = 0;
  }

  let data = data_buffer.toString();

  if (typeof data === "string") {
    let obj = JSON.parse(data);

    if (obj.status == "server ready") {
      ui.log("dot2 endpoint redy");
      client.send('{"session":0}');
    }
    if (obj.forceLogin == true) {
      ui.log("try to login...");
      session = obj.session;
      client.send(
        '{"requestType":"login","username":"remote","password":"2c18e486683a3db1e645ad8523223b72","session":' +
          obj.session +
          ',"maxRequests":10}'
      );
    }

    if (obj.session == 0) {
      ui.error("CONNECTION ERROR");
      client.send('{"session":' + session + "}");
    }

    if (obj.session) {
      if (obj.session == -1) {
        clearLights();
        ui.log('Please enable Web Remote, and set password to "remote"');

        //reconnect after one second
        setTimeout(function () {
          connect();
        }, 1000);
      } else {
        session = obj.session;
      }
    }

    if (obj.text) {
      ui.log(obj.text);
      let text = obj.text;
    }

    if (obj.responseType == "login" && obj.result == true) {
      setInterval(interval, 100);
      ui.log("logged in!");
      ui.log("session: " + session);
    }

    if (obj.responseType == "presetTypeList") {
      ui.log("Preset Type List");
    }

    if (obj.responseType == "presetTypes") {
      ui.log("Preset Types");
    }

    if (obj.responseType == "getdata") {
      //ui.log("Get Data");
    }

    if (obj.responseType == "playbacks") {
      wsUpdateLights(obj);
    }
  }
}

//interval function requests data from dot2 endpoint
function interval() {
  if (session > 0) {
    client.send(
      '{"requestType":"playbacks","startIndex":[300,400,500,600,700,800],"itemsCount":[16,16,16,16,16,16],"pageIndex":' +
        pageIndex +
        ',"itemsType":[3,3,3,3,3,3],"view":3,"execButtonViewMode":2,"buttonsViewMode":0,"session":' +
        session +
        ',"maxRequests":1}'
    );
    client.send(
      '{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":' +
        pageIndex2 +
        ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' +
        session +
        ',"maxRequests":1}'
    );
    client.send(
      '{"requestType":"playbacks","startIndex":[0,100,200],"itemsCount":[6,6,6],"pageIndex":' +
        pageIndex +
        ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' +
        session +
        ',"maxRequests":1}'
    );
  }
}
