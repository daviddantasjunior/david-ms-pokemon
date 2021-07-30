import { User } from 'src/user/user.schema';

export interface AuthType {
  user: User;
  token: string;
}
