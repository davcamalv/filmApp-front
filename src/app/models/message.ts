import { Selectable } from "./Selectable";

export interface Message {
    sender?: string;
    message: string;
    specialKeyboard: boolean;
    selectable?: Selectable;
  }
