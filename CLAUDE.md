# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — dev server at `http://localhost:4200/` (proxies to backend `http://localhost:5137` configured in [environment.ts](src/environments/environment.ts)).
- `npm run build` — production build to `dist/tutoring-app/`. Uses `fileReplacements` to swap [environment.ts](src/environments/environment.ts) → [environment.prod.ts](src/environments/environment.prod.ts).
- `npm run watch` — incremental development build.
- `npm test` — Karma + Jasmine. No `*.spec.ts` files exist yet (`skipTests: true` schematic default in [angular.json](angular.json)). Run a single spec via `ng test --include='**/path/to/file.spec.ts'`.
- `npm run format` — Prettier writes over `src/**/*.{ts,html,scss}`.
- No `lint` script is wired in `package.json`; ESLint config exists ([eslint.config.js](eslint.config.js)) and is invoked via `npx eslint .` if needed.

## Deployment

Pushes to `develop` trigger [.github/workflows/main.yml](.github/workflows/main.yml): builds Angular, then commits the `dist/tutoring-app/browser/*` output into the `wwwroot/` of the sibling [`DDoS-73/aspnet`](https://github.com/DDoS-73/aspnet) repo (the ASP.NET host serves the SPA as static files). The Angular project does not run independently in production — it is consumed by that ASP.NET server. The production [environment.prod.ts](src/environments/environment.prod.ts) leaves `backendApi: ''` because requests are same-origin against the ASP.NET host.

## Architecture

Angular 20 standalone-components SPA. **No NgModules** — bootstrap and providers live in [main.ts](src/main.ts).

### Layered structure under `src/app/`

- `core/` — singletons: API endpoint constants, HTTP interceptors, `AuthService`, `authGuard`, ng-zorro config.
- `features/` — route-level feature areas (`auth/`, `calendar/`). Lazy-loaded via `loadComponent` / `loadChildren` in [app-routes.ts](src/app/app-routes.ts).
- `shared/` — cross-feature primitives: reusable components, models (incl. the `MainPages` / `AuthPages` route enums in [pages.ts](src/app/shared/models/pages.ts)), date utils.

### HTTP pipeline ([main.ts](src/main.ts))

Three interceptors run in this order: `authInterceptor` → `ErrorInterceptor` → `refreshTokenInterceptor`.

- [auth.interceptor.ts](src/app/core/interceptors/auth.interceptor.ts) attaches `Bearer <accessToken>` from `localStorage`. The `/auth/refresh` request gets the **refresh token** instead; other `/auth/*` endpoints get no token.
- [refresh-token.interceptor.ts](src/app/core/interceptors/refresh-token.interceptor.ts) catches `401`s on non-auth requests, calls `AuthService.refreshToken()`, and replays the original request. `AuthService` serializes concurrent refreshes via `_isRefreshing` + `_refreshTokenSubject` so a burst of 401s only triggers one refresh.
- [auth.service.ts](src/app/core/services/auth.service.ts) reads/writes tokens via `StorageKeys` ([storage.keys.ts](src/app/shared/models/storage.keys.ts)). On refresh failure it calls `logout()` and routes to `/auth`.
- All HTTP URLs are built from `environment.backendApi` + constants in [endpoints.ts](src/app/core/api/endpoints.ts) — add new routes there rather than inlining strings.

### Route guarding

[`authGuard`](src/app/core/guards/auth.guard.ts) is a `CanMatchFn` that pings `GET /user/me`. On 401 the refresh interceptor transparently rotates tokens; if both fail, the guard navigates to `/auth/login`.

### State / data: TanStack Query

The app uses `@tanstack/angular-query-experimental` (provided in [main.ts](src/main.ts)) — there is **no NgRx / RxJS store layer**. Pattern is encapsulated in [event.service.ts](src/app/features/calendar/services/event.service.ts):

- `injectQuery` for reads, `injectMutation` for writes; mutations call `queryClient.invalidateQueries({ queryKey: [...] })` in `onSuccess`.
- Default query options set `staleTime: Infinity`, `gcTime: Infinity`, and disable refetch-on-focus/reconnect/mount. Cache busting is done **explicitly via invalidation** after mutations, not via stale-while-revalidate. Follow this pattern when adding new server state.
- Query keys are tuples like `['events', fromIso, toIso]` so the events query refetches automatically when the visible week changes.

### Calendar feature ([features/calendar/](src/app/features/calendar/))

- Provides its own `DateService` and `EventService` at the component level (`providers: [...]` in [calendar.component.ts](src/app/features/calendar/calendar.component.ts)) — they are **not root-level singletons**.
- [`DateService`](src/app/features/calendar/services/date.service.ts) holds three signals (`previousWeekDays`, `currentWeekDays`, `nextWeekDays`). Week starts on Monday. The 7th day's time is set to `23:59:59.999` — the events query relies on this to bound its `to` parameter.
- The horizontal swipe gesture in `CalendarComponent` uses three side-by-side rendered weeks and CSS `translateX`. After a swipe past `SWIPE_THRESHOLD`, `DateService.updateAllWeeksDays` shifts the window and the transform snaps back to the middle pane. Touchmove/end are RxJS streams via `fromEvent` + `takeUntilDestroyed(DestroyRef)`.

### Conventions

- Components are standalone with `changeDetection: OnPush` and SCSS styles (schematic defaults in [angular.json](angular.json)). Selector prefix is `app-` (kebab-case).
- Prefer Angular signals (`signal`, `computed`, `viewChild.required`) and `inject()` over constructor DI — already the dominant pattern.
- Locale is hard-pinned to Ukrainian (`uk` / `uk_UA`) via `LOCALE_ID` and `provideNzI18n` in [main.ts](src/main.ts); ng-zorro week starts on Monday ([nz-config.ts](src/app/core/config/nz-config.ts)).
- UI library is **ng-zorro-antd** (its global stylesheet is loaded in [angular.json](angular.json)).
- Prettier: `singleQuote: true`, `printWidth: 120`, `trailingComma: 'es5'`. SCSS uses double quotes (override in [.prettierrc.json](.prettierrc.json)).
