# Architecture Review Guide

Architecture design review guide to help evaluate whether code architecture is reasonable and design is appropriate.

## SOLID Principles Checklist

### S - Single Responsibility Principle (SRP)

**Checkpoints:**
- Does this class/module have only one reason to change?
- Do all methods in the class serve the same purpose?
- If describing this class to non-technical people, can it be explained clearly in one sentence?

**Review Signals:**
```
⚠️ Class name contains generic words like "And", "Manager", "Handler", "Processor"
⚠️ A single class exceeds 200-300 lines of code
⚠️ Class has more than 5-7 public methods
⚠️ Different methods operate on completely different data
```

**Review Questions:**
- "What is this class responsible for? Can it be split?"
- "If requirement X changes, which methods need modifying? What if requirement Y changes?"

### O - Open/Closed Principle (OCP)

**Checkpoints:**
- When adding new features, does existing code need modification?
- Can new behavior be added through extension (inheritance, composition)?
- Are there large if/else or switch statements handling different types?

**Review Signals:**
```
⚠️ switch/if-else chains handling different types
⚠️ Adding new features requires modifying core classes
⚠️ Type checks (instanceof, typeof) scattered across code
```

**Review Questions:**
- "If we need to add a new type X, which files need modification?"
- "Will this switch statement grow as new types are added?"

### L - Liskov Substitution Principle (LSP)

**Checkpoints:**
- Can subclasses completely substitute their base class?
- Do subclasses alter the expected behavior of base class methods?
- Are subclasses throwing exceptions not declared by the base class?

**Review Signals:**
```
⚠️ Explicit type casting
⚠️ Subclass method throws NotImplementedException
⚠️ Subclass method has empty implementation or return-only body
⚠️ Code using base class needs to check for concrete types
```

**Review Questions:**
- "If we replace the base class with a subclass, does calling code need modification?"
- "Does the subclass behavior in this method honor the base class contract?"

### I - Interface Segregation Principle (ISP)

**Checkpoints:**
- Is the interface small and focused enough?
- Are implementation classes forced to implement methods they don't need?
- Do clients depend on methods they do not use?

**Review Signals:**
```
⚠️ Interface exceeds 5-7 methods
⚠️ Implementation class has empty methods or throws NotImplementedException
⚠️ Interface name is too generic (IManager, IService)
⚠️ Different clients use only a subset of interface methods
```

**Review Questions:**
- "Are all methods of this interface used by every implementation class?"
- "Can this large interface be split into smaller, dedicated interfaces?"

### D - Dependency Inversion Principle (DIP)

**Checkpoints:**
- Do high-level modules depend on abstractions rather than concrete implementations?
- Is dependency injection used instead of direct `new` instantiation?
- Are abstractions defined by high-level modules rather than low-level ones?

**Review Signals:**
```
⚠️ High-level module directly instantiates concrete classes of low-level modules
⚠️ Imports concrete implementation classes instead of interfaces/abstract classes
⚠️ Configuration and connection strings hardcoded in business logic
⚠️ Difficult to write unit tests for a class
```

**Review Questions:**
- "Can dependencies of this class be mocked during testing?"
- "If we swap the database/API implementation, how many places need modification?"

---

## Architecture Anti-Pattern Identification

### Fatal Anti-Patterns

| Anti-Pattern | Review Signals | Impact |
|--------|----------|------|
| **Big Ball of Mud** | No clear module boundaries; any code can call any other code | Difficult to understand, modify, and test |
| **God Object** | Single class assumes too many responsibilities, knows too much, does too much | High coupling, difficult to reuse and test |
| **Spaghetti Code** | Tangled control flow, goto or deep nesting, hard to trace execution path | Difficult to understand and maintain |
| **Lava Flow** | Ancient code nobody dares touch, lacking documentation and tests | Accumulates technical debt |

### Design Anti-Patterns

| Anti-Pattern | Review Signals | Recommendation |
|--------|----------|------|
| **Golden Hammer** | Using the same technology/pattern for all problems | Select appropriate solution based on problem |
| **Over-Engineering (Gas Factory)** | Solving simple problems with overly complex solutions, abusing design patterns | YAGNI principle, simple first |
| **Boat Anchor** | Unused code written for "might need in the future" | Delete unused code, write when needed |
| **Copy-Paste Programming** | Identical logic appears in multiple places | Extract common methods or modules |

### Review Comments

```markdown
🔴 [blocking] "This class has 2000 lines of code; suggest splitting into focused classes"
🟡 [important] "This logic is duplicated in 3 places; consider extracting a shared method?"
💡 [suggestion] "This switch statement can be replaced with Strategy pattern for easier extension"
```

---

## Coupling and Cohesion Assessment

### Coupling Types (Best to Worst)

| Type | Description | Example |
|------|------|------|
| **Message Coupling** ✅ | Pass data via parameters | `calculate(price, quantity)` |
| **Data Coupling** ✅ | Share simple data structure | `processOrder(orderDTO)` |
| **Stamp Coupling** ⚠️ | Share complex data structure but use only part | Pass full User object but use name only |
| **Control Coupling** ⚠️ | Pass control flags to alter behavior | `process(data, isAdmin=true)` |
| **Common Coupling** ❌ | Share global variables | Multiple modules read/write same global state |
| **Content Coupling** ❌ | Directly access internal implementation of another module | Directly operate private property of another class |

### Cohesion Types (Best to Worst)

| Type | Description | Quality |
|------|------|------|
| **Functional Cohesion** | All elements complete a single task | ✅ Best |
| **Sequential Cohesion** | Output serves as next step input | ✅ Good |
| **Communicational Cohesion** | Operate on same data | ⚠️ Acceptable |
| **Temporal Cohesion** | Tasks executed at same time | ⚠️ Poor |
| **Logical Cohesion** | Logically related but functionally distinct | ❌ Poor |
| **Coincidental Cohesion** | No apparent relationship | ❌ Worst |

### Metrics Reference

```yaml
Coupling Metrics:
  CBO (Coupling Between Objects):
    Good: < 5
    Warning: 5-10
    Danger: > 10

  Ce (Efferent Coupling):
    Description: Number of external classes depended on
    Good: < 7

  Ca (Afferent Coupling):
    Description: Number of classes depending on this class
    High value implies: Modification has high impact, requires stability

Cohesion Metrics:
  LCOM4 (Lack of Cohesion in Methods):
    1: Single Responsibility ✅
    2-3: May need splitting ⚠️
    >3: Should be split ❌
```

### Review Questions

- "How many other modules does this module depend on? Can it be reduced?"
- "How many other places will be affected if this class is modified?"
- "Do all methods of this class operate on the same data?"

---

## Layered Architecture Review

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│         Frameworks & Drivers        │ ← Outermost: Web, DB, UI
├─────────────────────────────────────┤
│         Interface Adapters          │ ← Controllers, Gateways, Presenters
├─────────────────────────────────────┤
│          Application Layer          │ ← Use Cases, Application Services
├─────────────────────────────────────┤
│            Domain Layer             │ ← Entities, Domain Services
└─────────────────────────────────────┘
          ↑ Dependency direction points inward ONLY ↑
```

### Dependency Rule Check

**Core Rule: Source code dependencies must point inward only**

```typescript
// ❌ Violates dependency rule: Domain layer depends on Infrastructure
// domain/User.ts
import { MySQLConnection } from '../infrastructure/database';

// ✅ Correct: Domain layer defines interface, Infrastructure implements it
// domain/UserRepository.ts (Interface)
interface UserRepository {
  findById(id: string): Promise<User>;
}

// infrastructure/MySQLUserRepository.ts (Implementation)
class MySQLUserRepository implements UserRepository {
  findById(id: string): Promise<User> { /* ... */ }
}
```

### Review Checklist

**Layer Boundary Check:**
- [ ] Does Domain layer have external dependencies (database, HTTP, filesystem)?
- [ ] Does Application layer directly operate database or call external APIs?
- [ ] Does Controller contain business logic?
- [ ] Are there cross-layer calls (UI directly calling Repository)?

**Separation of Concerns Check:**
- [ ] Is business logic separated from presentation logic?
- [ ] Is data access encapsulated in a dedicated layer?
- [ ] Are configuration and environment-specific code managed centrally?

### Review Comments

```markdown
🔴 [blocking] "Domain entity directly imports database connection, violating dependency rule"
🟡 [important] "Controller contains business calculation logic; suggest moving to Service layer"
💡 [suggestion] "Consider using dependency injection to decouple these components"
```

---

## Design Pattern Usage Evaluation

### When to Use Design Patterns

| Pattern | Applicable Scenarios | Inapplicable Scenarios |
|------|----------|------------|
| **Factory** | Need to create different object types determined at runtime | Only one type exists, or type is fixed |
| **Strategy** | Algorithms need to switch at runtime, multiple interchangeable behaviors | Only one algorithm exists, or algorithm will not change |
| **Observer** | One-to-many dependency, state changes notify multiple objects | Simple direct calls meet requirements |
| **Singleton** | Truly requires a globally unique instance (e.g. config management) | Objects that can be passed via dependency injection |
| **Decorator** | Need to dynamically add responsibilities, avoiding inheritance explosion | Responsibilities fixed, dynamic composition not needed |

### Over-Engineering Warning Signals

```
⚠️ Patternitis Warning Signals:

1. Simple if/else replaced with Strategy + Factory + Registry
2. Interfaces with only a single implementation
3. Abstract layers added for "might need in the future"
4. Line count inflates significantly due to pattern application
5. Onboarding devs take extensive time to understand code structure
```

### Review Principles

```markdown
✅ Proper Pattern Usage:
- Solves actual extensibility problems
- Code is easier to understand and test
- Adding new features becomes simpler

❌ Pattern Overuse:
- Using patterns for the sake of patterns
- Adds unnecessary complexity
- Violates YAGNI principle
```

### Review Questions

- "What specific problem does applying this pattern solve?"
- "What issues would exist if this pattern were omitted?"
- "Does the value of this abstraction outweigh its complexity?"

---

## Scalability Assessment

### Scalability Checklist

**Functional Scalability:**
- [ ] Does adding a new feature require modifying core code?
- [ ] Are extension points provided (hooks, plugins, events)?
- [ ] Is configuration externalized (config files, environment variables)?

**Data Scalability:**
- [ ] Does the data model support adding new fields?
- [ ] Are scenarios involving data volume growth considered?
- [ ] Do queries have appropriate indexes?

**Load Scalability:**
- [ ] Can it scale horizontally (adding more instances)?
- [ ] Are there state dependencies (session, local cache)?
- [ ] Do database connections use connection pooling?

### Extension Point Design Check

```typescript
// ✅ Good extension design: Using events/hooks
class OrderService {
  private hooks: OrderHooks;

  async createOrder(order: Order) {
    await this.hooks.beforeCreate?.(order);
    const result = await this.save(order);
    await this.hooks.afterCreate?.(result);
    return result;
  }
}

// ❌ Poor extension design: Hardcoded behaviors
class OrderService {
  async createOrder(order: Order) {
    await this.sendEmail(order);        // Hardcoded
    await this.updateInventory(order);  // Hardcoded
    await this.notifyWarehouse(order);  // Hardcoded
    return await this.save(order);
  }
}
```

### Review Comments

```markdown
💡 [suggestion] "If we need to support new payment methods in the future, is this design easy to extend?"
🟡 [important] "Logic here is hardcoded; consider using configuration or Strategy pattern?"
📚 [learning] "Event-driven architecture can make this feature easier to scale"
```

---

## Code Structure Best Practices

### Directory Organization

**Organize by Feature/Domain (Recommended):**
```
src/
├── user/
│   ├── User.ts           (Entity)
│   ├── UserService.ts    (Service)
│   ├── UserRepository.ts (Data Access)
│   └── UserController.ts (API)
├── order/
│   ├── Order.ts
│   ├── OrderService.ts
│   └── ...
└── shared/
    ├── utils/
    └── types/
```

**Organize by Tech Layer (Not Recommended):**
```
src/
├── controllers/     ← Mixed domains
│   ├── UserController.ts
│   └── OrderController.ts
├── services/
├── repositories/
└── models/
```

### Naming Conventions Check

| Type | Convention | Example |
|------|------|------|
| Class Name | PascalCase, Noun | `UserService`, `OrderRepository` |
| Method Name | camelCase, Verb | `createUser`, `findOrderById` |
| Interface Name | I prefix or no prefix | `IUserService` or `UserService` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Private Property | Underscore prefix or `#` | `_cache` or `#cache` |

### File Size Guidelines

```yaml
Recommended Limits:
  Single File: < 300 lines
  Single Function: < 50 lines
  Single Class: < 200 lines
  Function Parameters: < 4
  Nesting Depth: < 4 levels

When Exceeding Limits:
  - Consider splitting into smaller units
  - Use composition over inheritance
  - Extract helper functions or classes
```

### Review Comments

```markdown
🟢 [nit] "This 500-line file can be split by responsibility"
🟡 [important] "Suggest organizing directory structure by feature domain rather than tech layer"
💡 [suggestion] "Function name `process` is not clear; consider changing to `calculateOrderTotal`?"
```

---

## Quick Reference Checklist

### 5-Minute Architecture Quick Check

```markdown
□ Is dependency direction correct? (Outer layer depends on inner layer)
□ Are there circular dependencies?
□ Is core business logic decoupled from framework/UI/database?
□ Are SOLID principles followed?
□ Are there obvious anti-patterns?
```

### Red Flags (Must Resolve)

```markdown
🔴 God Object - Single class exceeds 1000 lines
🔴 Circular dependency - A → B → C → A
🔴 Domain layer contains framework dependencies
🔴 Hardcoded configuration and secrets
🔴 External service calls without interfaces
```

### Yellow Flags (Suggested Resolution)

```markdown
🟡 Coupling Between Objects (CBO) > 10
🟡 Method parameters > 5
🟡 Nesting depth > 4 levels
🟡 Duplicate code block > 10 lines
🟡 Interface with only 1 implementation
```

---

## Recommended Tools

| Tool | Purpose | Language Support |
|------|------|----------|
| **SonarQube** | Code quality, coupling analysis | Multi-language |
| **NDepend** | Dependency analysis, architecture rules | .NET |
| **JDepend** | Package dependency analysis | Java |
| **Madge** | Module dependency graph | JavaScript/TypeScript |
| **ESLint** | Code standards, complexity checks | JavaScript/TypeScript |
| **CodeScene** | Technical debt, hotspot analysis | Multi-language |

---

## References

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles in Code Review - JetBrains](https://blog.jetbrains.com/upsource/2015/08/31/what-to-look-for-in-a-code-review-solid-principles-2/)
- [Software Architecture Anti-Patterns](https://medium.com/@christophnissle/anti-patterns-in-software-architecture-3c8970c9c4f5)
- [Coupling and Cohesion in System Design](https://www.geeksforgeeks.org/system-design/coupling-and-cohesion-in-system-design/)
- [Design Patterns - Refactoring Guru](https://refactoring.guru/design-patterns)
