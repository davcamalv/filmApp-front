import { Selectable } from "./selectable";

export interface Message {
    sender?: string;
    message: string;
    specialKeyboard: boolean;
    selectable?: Selectable;
    fullWidth: boolean;
  }
