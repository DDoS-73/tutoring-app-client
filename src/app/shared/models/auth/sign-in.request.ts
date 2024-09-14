import { SignUpRequest } from './sign-up.request';

export interface SignInRequest
    extends Pick<SignUpRequest, 'email' | 'password'> {}
