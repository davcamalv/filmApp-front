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
