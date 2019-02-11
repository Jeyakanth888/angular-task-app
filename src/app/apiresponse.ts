import { User } from './models/user';
export class Response {
    data: User;
    status: string;
    message: string;
    error: boolean;
  }
