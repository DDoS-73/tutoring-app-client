import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthPages, MainPages } from '../../shared/models/pages';
import { UserService } from '../services/user.service';

export const authGuard: CanMatchFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.currentUser()) {
    return true;
  }

  router.navigate([MainPages.Auth, AuthPages.Login]);
  return false;
};
