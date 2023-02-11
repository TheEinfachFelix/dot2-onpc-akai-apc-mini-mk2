import tk from "terminal-kit";

const term: any = tk.terminal();
export class userInterface {
  constructor() {
    term.reset();
    term.windowTitle("Akai-APCmini to dot2");
  }

  log(message: string | string[]): void {
    term.yellow("log: ");
    if (typeof message == "object") {
      term.white("[").green(message).white("]", "\n");
    } else {
      term.white(message, "\n");
    }
  }

  error(message: string): void {
    term.red("error: ");
    term.white(message, "\n");
  }

  info(message: string) {
    term.magenta("info: ");
    term.white(message, "\n");
  }
}
