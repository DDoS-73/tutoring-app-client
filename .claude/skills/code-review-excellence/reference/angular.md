# Angular Code Review Guide

> Angular 17+ code review guide covering Signals, Standalone components, RxJS anti-patterns, Zoneless change detection, template best practices, and performance optimization.

## Table of Contents

- [Signals & Change Detection](#signals--change-detection)
- [Standalone Component Migration](#standalone-component-migration)
- [RxJS Anti-Patterns](#rxjs-anti-patterns)
- [Zoneless Change Detection](#zoneless-change-detection)
- [Template Best Practices](#template-best-practices)
- [Performance Optimization](#performance-optimization)
- [Review Checklist](#review-checklist)

---

## Signals & Change Detection

### Signal + OnPush Automatic Change Detection Triggering

```typescript
// ❌ Mutable state + OnPush = UI does not update
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ data.name }}</p>`,
})
export class UserProfile {
  data = { name: 'Alice' };
  changeName() { this.data.name = 'Bob'; } // UI will not update!
}

// ✅ Signal + OnPush = Automatic change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ name() }}</p>`,
})
export class UserProfile {
  name = signal('Alice');
  changeName() { this.name.set('Bob'); } // Automatically triggers CD
}
```

### @Input() Object Mutation Is Not Detected by OnPush

```typescript
// ❌ Mutating Input object - reference unchanged, OnPush skips check
@Input() config!: Config;
updateConfig() { this.config.theme = 'dark'; }

// ✅ Create a new reference
updateConfig() { this.config = { ...this.config, theme: 'dark' }; }
```

### Use computed() for Derived State

```typescript
// ❌ effect for state synchronization - anti-pattern, can trigger extra CD cycles
export class CartComponent {
  total = signal(0);
  discounted = signal(0);

  constructor() {
    effect(() => this.discounted.set(this.total() * 0.9));
  }
}

// ✅ computed for derived state - lazy evaluation, no side effects
export class CartComponent {
  total = signal(0);
  discounted = computed(() => this.total() * 0.9);
}
```

### Signal Reads After await in effect() Are Not Tracked

```typescript
// ❌ Signal read after await - dependency is untracked
effect(async () => {
  const data = await fetchUserData();
  console.log(`Theme: ${theme()}`); // theme() is untracked!
});

// ✅ Read synchronously before await
effect(async () => {
  const currentTheme = theme(); // Synchronous read, tracked
  const data = await fetchUserData();
  console.log(`Theme: ${currentTheme}`);
});
```

### Use effect Only in Specific Scenarios

```typescript
// ❌ Using effect to sync two Signals - always use computed instead
effect(() => { this.filtered.set(this.items().filter(i => i.active)); });

// ✅ Appropriate use cases for effect: DOM operations, analytics logging, subscribing to external sources
effect(() => {
  const canvas = this.canvasRef.nativeElement;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = this.color();
  ctx.fillRect(0, 0, this.size(), this.size());
});

// 💡 "There are no situations where effect is good,
//    only situations where it is appropriate."
```

---

## Standalone Component Migration

### Standalone is Default in Angular 19+

```typescript
// ❌ Legacy NgModule component
@Component({
  selector: 'old-component',
  standalone: false,
})
export class OldComponent {}

// ✅ Modern Standalone component (standalone is default in Angular 19+)
@Component({
  selector: 'user-profile',
  imports: [ProfilePhoto, RouterLink],
  template: `<profile-photo /><a routerLink="/edit">Edit</a>`,
})
export class UserProfile {}
```

### Review Flags

```typescript
// ⚠️ Signals indicating migration needed:
// 1. standalone: false
// 2. @NgModule declarations
// 3. Components imported via NgModule instead of directly

// ✅ Migration path:
// 1. Remove standalone: false
// 2. Add dependencies to component's imports array
// 3. Delete NgModule if declarations become empty
```

---

## RxJS Anti-Patterns

### subscribe() Must Pair with takeUntilDestroyed

```typescript
// ❌ Bare subscribe - memory leak! Continues receiving data after component destruction
@Component({ /* ... */ })
export class UserProfile implements OnInit {
  ngOnInit() {
    this.data$.subscribe(data => this.processData(data));
  }
}

// ✅ takeUntilDestroyed - automatically unsubscribes on destruction (must be called in constructor or injection context)
@Component({ /* ... */ })
export class UserProfile {
  constructor() {
    this.data$.pipe(takeUntilDestroyed()).subscribe(data => {
      this.processData(data);
    });
  }
}

// ✅ Outside constructor - pass DestroyRef
@Component({ /* ... */ })
export class UserProfile {
  private destroyRef = inject(DestroyRef);

  startListening() {
    this.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(/* ... */);
  }
}
```

### Prefer toSignal over AsyncPipe

```typescript
// ❌ AsyncPipe - requires import, template clutter with | async
@Component({
  imports: [AsyncPipe],
  template: `{{ data$ | async }}`,
})

// ✅ toSignal - automatic unsubscription, can be used anywhere
export class UserProfile {
  data = toSignal(this.data$, { initialValue: null });
  // Template accesses data() directly
}
```

### Avoid Repeated toSignal Calls

```typescript
// ❌ toSignal creates a new subscription on every call
getData() {
  return toSignal(this.http.get('/api/data'));
}

// ✅ Store result in property
data = toSignal(this.http.get('/api/data'), { initialValue: null });
```

---

## Zoneless Change Detection

### Primitive/Object Property Mutation Is Not Detected (Angular 21+)

```typescript
// ❌ Property assignment does not trigger CD in Zoneless mode
export class UserService {
  user: User | null = null;
  loadUser() { this.user = fetchResult; } // Does not trigger CD!
}

// ✅ Signal automatically triggers CD
export class UserService {
  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  loadUser() { this._user.set(fetchResult); }
}
```

### NgZone APIs Are Ineffective in Zoneless Mode

```typescript
// ❌ NgZone.onStable never fires in zoneless mode
ngZone.onStable.subscribe(() => { /* Never fires */ });

// ✅ Use afterNextRender
afterNextRender({ write: () => { /* Executes after CD */ } });
```

### Reactive Forms Mutations Require markForCheck

```typescript
// ❌ Reactive Forms setValue/patchValue does not automatically schedule CD in zoneless
this.form.patchValue({ name: 'Alice' }); // UI may not update

// ✅ Manually mark or reflect via Signal
this.form.patchValue({ name: 'Alice' });
this.cdr.markForCheck();
```

### Valid CD Triggers in Zoneless Mode

| Trigger | Description |
|--------|------|
| `signal.set()` / `.update()` | Signal update automatically triggers CD |
| `ChangeDetectorRef.markForCheck()` | Manual marking |
| `ComponentRef.setInput()` | Input binding |
| Template event listener callbacks | User interaction |

---

## Template Best Practices

### Extract Complex Logic to computed Signal

```typescript
// ❌ Complex expressions in template
template: `<div *ngIf="items.filter(i => i.active).length > 0 && user.role === 'admin'">`

// ✅ Extract to computed
filteredItems = computed(() => this.items().filter(i => i.active));
shouldShow = computed(() => this.filteredItems().length > 0 && this.user().role === 'admin');
template: `@if (shouldShow()) { <div>...</div> }`
```

### Native Bindings Preferred Over NgClass / NgStyle

```typescript
// ❌ NgClass/NgStyle - extra directive overhead
template: `<div [ngClass]="{active: isActive}" [ngStyle]="{'color': textColor}">`

// ✅ Native class/style bindings - better performance
template: `<div [class.active]="isActive" [style.color]="textColor">`
```

### Mark Template-Only Members as protected

```typescript
// ❌ Template-only method exposed as public
export class UserProfile {
  formatName(name: string) { return name.trim(); }
}

// ✅ Template-only members marked as protected
export class UserProfile {
  protected formatName(name: string) { return name.trim(); }
}
```

### Mark Angular-Managed Properties as readonly

```typescript
// ❌ input/output/model can be overwritten accidentally
userId = input<string>();
userSaved = output<void>();

// ✅ readonly prevents accidental assignment
readonly userId = input<string>();
readonly userSaved = output<void>();
readonly userName = model<string>();
```

### Naming Conventions: Action Names Instead of Event Names

```typescript
// ❌ Named after event
template: `<button (click)="handleClick()">Save</button>`

// ✅ Named after action
template: `<button (click)="saveUserData()">Save</button>`
```

---

## Performance Optimization

### effect Is a Last Resort - Prefer computed

```typescript
// ❌ effect used for state sync - triggers extra CD, potential infinite loops
effect(() => {
  this.filteredItems.set(this.items().filter(i => i.active));
});

// ✅ computed - lazy evaluation, no side effects, no extra CD
filteredItems = computed(() => this.items().filter(i => i.active));
```

### afterRenderEffect Separate Read and Write Phases

```typescript
// ❌ No phase specified = mixedReadWrite = extra DOM reflow
afterRenderEffect(() => {
  const height = el.offsetHeight; // Read
  el.style.height = height + 10 + 'px'; // Write
});

// ✅ Separate phases to reduce reflow
afterRenderEffect({
  earlyRead: () => el.offsetHeight,
  write: (height) => { el.style.height = height() + 10 + 'px'; },
  read: () => verifyLayout(),
});
```

### Prefer inject() over Constructor Injection

```typescript
// ❌ Constructor injection - hard to read with multiple dependencies
export class UserService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
  ) {}
}

// ✅ inject() - better type inference and readability
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
}
```

---

## Review Checklist

### Signals & Change Detection

- [ ] Signal + OnPush used for template state (immutable objects)
- [ ] `@Input()` objects updated via new reference (not mutated)
- [ ] Derived state uses `computed()`, not `effect()`
- [ ] Signal reads inside `effect()` occur before `await`
- [ ] `effect()` used only for DOM operations, logging, external source subscriptions

### Standalone Components

- [ ] No `standalone: false` (Angular 19+)
- [ ] Components import dependencies via `imports` array
- [ ] No unnecessary `@NgModule`

### RxJS

- [ ] `.subscribe()` paired with `takeUntilDestroyed` or `async` pipe
- [ ] Prefer `toSignal` over `AsyncPipe`
- [ ] No repeated `toSignal` calls

### Zoneless

- [ ] Template state managed via Signals (not standard properties)
- [ ] No `NgZone.onStable` / `NgZone.onMicrotaskEmpty`
- [ ] Reactive Forms mutations followed by `markForCheck()`

### Templates

- [ ] Complex logic extracted to `computed` Signal
- [ ] Uses native `[class]`/`[style]` instead of `NgClass`/`NgStyle`
- [ ] Template-only members marked `protected`
- [ ] `input`/`output`/`model` properties marked `readonly`
- [ ] Event handlers named after actions (`saveData` instead of `handleClick`)

### Performance

- [ ] `effect()` not used for state sync
- [ ] `afterRenderEffect` separates read/write phases
- [ ] `inject()` used for dependency injection
