import { MediaContent } from "./mediaContent";
import { Genre } from "./genre";

export interface NewUser {
  name: string;
  username: string;
  email: string;
  password: string;
  authorities?: string[];
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserProfile {
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  birthDate?: string;
  genres: Genre[];
}

export interface ProfileDetails {
  name: string;
  email: string;
  birthDate?: Date;
}