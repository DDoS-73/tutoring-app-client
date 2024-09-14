import { User } from './user.model';

export interface SignUpRequest extends User {
    password: string;
}
