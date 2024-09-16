import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        map(user => !!user),
        tap(isAuthenticated => {
            if (!isAuthenticated) {
                router.navigate(['/auth/sign-in']);
            }
        })
    );
};
