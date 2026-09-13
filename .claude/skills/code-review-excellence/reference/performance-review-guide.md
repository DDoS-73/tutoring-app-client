# Performance Review Guide

Performance review guide covering frontend, backend, database, algorithm complexity, and API performance.

## Table of Contents

- [Frontend Performance (Core Web Vitals)](#frontend-performance-core-web-vitals)
- [JavaScript Performance](#javascript-performance)
- [Memory Management](#memory-management)
- [Database Performance](#database-performance)
- [API Performance](#api-performance)
- [Algorithm Complexity](#algorithm-complexity)
- [Performance Review Checklist](#performance-review-checklist)

---

## Frontend Performance (Core Web Vitals)

### 2024 Core Metrics

| Metric | Full Name | Target | Description |
|------|------|--------|------|
| **LCP** | Largest Contentful Paint | ≤ 2.5s | Time until largest content element is rendered |
| **INP** | Interaction to Next Paint | ≤ 200ms | Interaction response latency (Replaced FID in 2024) |
| **CLS** | Cumulative Layout Shift | ≤ 0.1 | Cumulative layout instability score |
| **FCP** | First Contentful Paint | ≤ 1.8s | Time until first content element is rendered |
| **TBT** | Total Blocking Time | ≤ 200ms | Total main thread blocking time |

### LCP Optimization Check

```javascript
// ❌ LCP image lazy loading - delays critical content
<img src="hero.jpg" loading="lazy" />

// ✅ LCP image eager loading
<img src="hero.jpg" fetchpriority="high" />

// ❌ Unoptimized image format
<img src="hero.png" />  // PNG file size is too large

// ✅ Modern image format + responsive
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero" />
</picture>
```

**Review Points:**
- [ ] Is `fetchpriority="high"` set on LCP elements?
- [ ] Are WebP/AVIF formats used?
- [ ] Is server-side rendering or static generation utilized?
- [ ] Is CDN configured properly?

### FCP Optimization Check

```html
<!-- ❌ Render-blocking CSS -->
<link rel="stylesheet" href="all-styles.css" />

<!-- ✅ Inline critical CSS + async load remaining -->
<style>/* Above-the-fold critical styles */</style>
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />

<!-- ❌ Render-blocking font -->
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2');
}

<!-- ✅ Font display optimization -->
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2');
  font-display: swap;  /* Use fallback font first, swap after loaded */
}
```

### INP Optimization Check

```javascript
// ❌ Long task blocking main thread
button.addEventListener('click', () => {
  // Synchronous operation taking 500ms
  processLargeData(data);
  updateUI();
});

// ✅ Break up long tasks
button.addEventListener('click', async () => {
  // Yield main thread
  await scheduler.yield?.() ?? new Promise(r => setTimeout(r, 0));

  // Process in chunks
  for (const chunk of chunks) {
    processChunk(chunk);
    await scheduler.yield?.();
  }
  updateUI();
});

// ✅ Use Web Worker for heavy computations
const worker = new Worker('heavy-computation.js');
worker.postMessage(data);
worker.onmessage = (e) => updateUI(e.data);
```

### CLS Optimization Check

```css
/* ❌ Media without specified dimensions */
img { width: 100%; }

/* ✅ Reserve space */
img {
  width: 100%;
  aspect-ratio: 16 / 9;
}

/* ❌ Dynamically inserted content causes layout shift */
.ad-container { }

/* ✅ Reserve fixed height */
.ad-container {
  min-height: 250px;
}
```

**CLS Review Checklist:**
- [ ] Do images/videos have `width`/`height` or `aspect-ratio`?
- [ ] Is font loading using `font-display: swap`?
- [ ] Is space reserved for dynamic content?
- [ ] Is inserting content above existing content avoided?

---

## JavaScript Performance

### Code Splitting and Lazy Loading

```javascript
// ❌ Load all code at once
import { HeavyChart } from './charts';
import { PDFExporter } from './pdf';
import { AdminPanel } from './admin';

// ✅ Load on demand
const HeavyChart = lazy(() => import('./charts'));
const PDFExporter = lazy(() => import('./pdf'));

// ✅ Route-level code splitting
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard')),
  },
  {
    path: '/admin',
    component: lazy(() => import('./pages/Admin')),
  },
];
```

### Bundle Size Optimization

```javascript
// ❌ Import entire library
import _ from 'lodash';
import moment from 'moment';

// ✅ Import on demand
import debounce from 'lodash/debounce';
import { format } from 'date-fns';

// ❌ Tree Shaking not utilized
export default {
  fn1() {},
  fn2() {},  // Unused but bundled
};

// ✅ Named exports support Tree Shaking
export function fn1() {}
export function fn2() {}
```

**Bundle Review Checklist:**
- [ ] Is dynamic `import()` used for code splitting?
- [ ] Are large libraries imported on demand?
- [ ] Has bundle size been analyzed? (e.g. `webpack-bundle-analyzer`)
- [ ] Are there unused dependencies?

### List Rendering Optimization

```javascript
// ❌ Render large list
function List({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );  // 10,000 items = 10,000 DOM nodes
}

// ✅ Virtual list - render visible items only
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={35}
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

**Big Data Review Points:**
- [ ] Do lists over 100 items use virtual scrolling?
- [ ] Do tables support pagination or virtualization?
- [ ] Are unneeded full re-renders avoided?

---

## Memory Management

### Common Memory Leaks

#### 1. Uncleaned Event Listeners

```javascript
// ❌ Event listener persists after component unmounts
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ Clean up event listener
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

#### 2. Uncleaned Timers

```javascript
// ❌ Timer uncleaned
useEffect(() => {
  setInterval(fetchData, 5000);
}, []);

// ✅ Clean up timer
useEffect(() => {
  const timer = setInterval(fetchData, 5000);
  return () => clearInterval(timer);
}, []);
```

#### 3. Closure References

```javascript
// ❌ Closure holds reference to large object
function createHandler() {
  const largeData = new Array(1000000).fill('x');

  return function handler() {
    // largeData retained by closure, cannot be GC'd
    console.log(largeData.length);
  };
}

// ✅ Retain only necessary data
function createHandler() {
  const largeData = new Array(1000000).fill('x');
  const length = largeData.length;  // Retain scalar value only

  return function handler() {
    console.log(length);
  };
}
```

#### 4. Uncleaned Subscriptions

```javascript
// ❌ WebSocket/EventSource unclosed
useEffect(() => {
  const ws = new WebSocket('wss://...');
  ws.onmessage = handleMessage;
}, []);

// ✅ Clean up connection
useEffect(() => {
  const ws = new WebSocket('wss://...');
  ws.onmessage = handleMessage;
  return () => ws.close();
}, []);
```

### Memory Review Checklist

```markdown
- [ ] Do useEffect hooks include cleanup functions?
- [ ] Are event listeners removed when components unmount?
- [ ] Are timers cleared?
- [ ] Are WebSocket/SSE connections closed?
- [ ] Are large objects released promptly?
- [ ] Are global variables accumulating data?
```

### Detection Tools

| Tool | Purpose |
|------|------|
| Chrome DevTools Memory | Heap snapshot analysis |
| MemLab (Meta) | Automated memory leak detection |
| Performance Monitor | Real-time memory monitoring |

---

## Database Performance

### N+1 Query Problem

```python
# ❌ N+1 problem - 1 + N queries
users = User.objects.all()  # 1 query
for user in users:
    print(user.profile.bio)  # N queries (one per user)

# ✅ Eager Loading - 2 queries
users = User.objects.select_related('profile').all()
for user in users:
    print(user.profile.bio)  # No extra queries

# ✅ Many-to-many relationship using prefetch_related
posts = Post.objects.prefetch_related('tags').all()
```

```javascript
// TypeORM Example
// ❌ N+1 problem
const users = await userRepository.find();
for (const user of users) {
  const posts = await user.posts;  // Queries on every iteration
}

// ✅ Eager Loading
const users = await userRepository.find({
  relations: ['posts'],
});
```

### Index Optimization

```sql
-- ❌ Full table scan
SELECT * FROM orders WHERE status = 'pending';

-- ✅ Add index
CREATE INDEX idx_orders_status ON orders(status);

-- ❌ Index invalidated: Function operation
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ✅ Range query utilizes index
SELECT * FROM users
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- ❌ Index invalidated: LIKE prefix wildcard
SELECT * FROM products WHERE name LIKE '%phone%';

-- ✅ Prefix matching utilizes index
SELECT * FROM products WHERE name LIKE 'phone%';
```

### Query Optimization

```sql
-- ❌ SELECT * retrieves unneeded columns
SELECT * FROM users WHERE id = 1;

-- ✅ Query only needed columns
SELECT id, name, email FROM users WHERE id = 1;

-- ❌ Large table without LIMIT
SELECT * FROM logs WHERE type = 'error';

-- ✅ Paginated query
SELECT * FROM logs WHERE type = 'error' LIMIT 100 OFFSET 0;

-- ❌ Execute queries inside a loop
for id in user_ids:
    cursor.execute("SELECT * FROM users WHERE id = %s", (id,))

-- ✅ Batch query
cursor.execute("SELECT * FROM users WHERE id IN %s", (tuple(user_ids),))
```

### Database Review Checklist

```markdown
🔴 Must Check:
- [ ] Are there N+1 queries?
- [ ] Are WHERE clause columns indexed?
- [ ] Is SELECT * avoided?
- [ ] Do queries on large tables include LIMIT?

🟡 Suggested Check:
- [ ] Is EXPLAIN used to analyze query plans?
- [ ] Is composite index column order correct?
- [ ] Are there unused indexes?
- [ ] Is slow query log monitoring active?
```

---

## API Performance

### Pagination Implementation

```javascript
// ❌ Return all data
app.get('/users', async (req, res) => {
  const users = await User.findAll();  // Could return 100,000 items
  res.json(users);
});

// ✅ Pagination + limit maximum count
app.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);  // Max 100
  const offset = (page - 1) * limit;

  const { rows, count } = await User.findAndCountAll({
    limit,
    offset,
    order: [['id', 'ASC']],
  });

  res.json({
    data: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  });
});
```

### Caching Strategies

```javascript
// ✅ Redis caching example
async function getUser(id) {
  const cacheKey = `user:${id}`;

  // 1. Check cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Query database
  const user = await db.users.findById(id);

  // 3. Write to cache (set TTL)
  await redis.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}

// ✅ HTTP cache headers
app.get('/static-data', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=86400',  // 24 hours
    'ETag': 'abc123',
  });
  res.json(data);
});
```

### Response Compression

```javascript
// ✅ Enable Gzip/Brotli compression
const compression = require('compression');
app.use(compression());

// ✅ Return necessary fields only
// Request: GET /users?fields=id,name,email
app.get('/users', async (req, res) => {
  const fields = req.query.fields?.split(',') || ['id', 'name'];
  const users = await User.findAll({
    attributes: fields,
  });
  res.json(users);
});
```

### Rate Limiting

```javascript
// ✅ Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,             // Max 100 requests
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api/', limiter);
```

### API Review Checklist

```markdown
- [ ] Do list endpoints have pagination?
- [ ] Is maximum page limit restricted?
- [ ] Is hot data cached?
- [ ] Is response compression enabled?
- [ ] Is rate limiting enabled?
- [ ] Are only requested/necessary fields returned?
```

---

## Algorithm Complexity

### Common Complexity Comparison

| Complexity | Name | 10 items | 1,000 items | 1,000,000 items | Example |
|--------|------|-------|---------|----------|------|
| O(1) | Constant | 1 | 1 | 1 | Hash lookup |
| O(log n) | Logarithmic | 3 | 10 | 20 | Binary search |
| O(n) | Linear | 10 | 1,000 | 1,000,000 | Array iteration |
| O(n log n) | Linearithmic | 33 | 10,000 | 20,000,000 | Quicksort |
| O(n²) | Quadratic | 100 | 1,000,000 | 1 Trillion | Nested loops |
| O(2ⁿ) | Exponential | 1024 | ∞ | ∞ | Recursive Fibonacci |

### Identification in Code Review

```javascript
// ❌ O(n²) - Nested loops
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// ✅ O(n) - Use Set
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    }
    seen.add(item);
  }
  return [...duplicates];
}
```

```javascript
// ❌ O(n²) - Calling includes inside loop
function removeDuplicates(arr) {
  const result = [];
  for (const item of arr) {
    if (!result.includes(item)) {  // includes is O(n)
      result.push(item);
    }
  }
  return result;
}

// ✅ O(n) - Use Set
function removeDuplicates(arr) {
  return [...new Set(arr)];
}
```

```javascript
// ❌ O(n) lookup - Iterating every time
const users = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, ...];

function getUser(id) {
  return users.find(u => u.id === id);  // O(n)
}

// ✅ O(1) lookup - Use Map
const userMap = new Map(users.map(u => [u.id, u]));

function getUser(id) {
  return userMap.get(id);  // O(1)
}
```

### Space Complexity Considerations

```javascript
// ⚠️ O(n) space - Creates new array
const doubled = arr.map(x => x * 2);

// ✅ O(1) space - In-place modification (if allowed)
for (let i = 0; i < arr.length; i++) {
  arr[i] *= 2;
}

// ⚠️ Excessive recursion depth may cause stack overflow
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);  // O(n) stack space
}

// ✅ Iterative version O(1) space
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
```

### Complexity Review Questions

```markdown
💡 "This nested loop has O(n²) complexity; it will cause performance issues with large datasets"
🔴 "Using Array.includes() inside a loop makes the overall complexity O(n²); suggest using a Set"
🟡 "This recursion depth may cause stack overflow; suggest converting to iterative loop or tail recursion"
```

---

## Performance Review Checklist

### 🔴 Must Check (Blocking)

**Frontend:**
- [ ] Is LCP image lazy loaded? (It shouldn't be)
- [ ] Is `transition: all` present?
- [ ] Are width/height/top/left animated?
- [ ] Are lists >100 items virtualized?

**Backend:**
- [ ] Are there N+1 queries?
- [ ] Do list endpoints have pagination?
- [ ] Is `SELECT *` used on large tables?

**General:**
- [ ] Are there O(n²) or worse nested loops?
- [ ] Do useEffect hooks/event listeners have cleanup routines?

### 🟡 Suggested Check (Important)

**Frontend:**
- [ ] Is code splitting used?
- [ ] Are large libraries imported on demand?
- [ ] Are WebP/AVIF formats used for images?
- [ ] Are there unused dependencies?

**Backend:**
- [ ] Is hot data cached?
- [ ] Are WHERE clause columns indexed?
- [ ] Is slow query log monitoring active?

**API:**
- [ ] Is response compression enabled?
- [ ] Is rate limiting enabled?
- [ ] Are only requested/necessary fields returned?

### 🟢 Optimization Suggestions (Nice-to-have)

- [ ] Has bundle size been analyzed?
- [ ] Is a CDN used?
- [ ] Is performance monitoring in place?
- [ ] Have performance benchmarks been run?

---

## Performance Metric Thresholds

### Frontend Metrics

| Metric | Good | Needs Improvement | Poor |
|------|-----|--------|-----|
| LCP | ≤ 2.5s | 2.5-4s | > 4s |
| INP | ≤ 200ms | 200-500ms | > 500ms |
| CLS | ≤ 0.1 | 0.1-0.25 | > 0.25 |
| FCP | ≤ 1.8s | 1.8-3s | > 3s |
| Bundle Size (JS) | < 200KB | 200-500KB | > 500KB |

### Backend Metrics

| Metric | Good | Needs Improvement | Poor |
|------|-----|--------|-----|
| API Response Time | < 100ms | 100-500ms | > 500ms |
| Database Query | < 50ms | 50-200ms | > 200ms |
| Page Load | < 3s | 3-5s | > 5s |

---

## Recommended Tools

### Frontend Performance

| Tool | Purpose |
|------|------|
| [Lighthouse](https://developer.chrome.com/docs/lighthouse/) | Core Web Vitals audit |
| [WebPageTest](https://www.webpagetest.org/) | Detailed performance profiling |
| [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) | Bundle analysis |
| [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/) | Runtime performance profiling |

### Memory Detection

| Tool | Purpose |
|------|------|
| [MemLab](https://github.com/facebookincubator/memlab) | Automated memory leak detection |
| Chrome Memory Tab | Heap snapshot analysis |

### Backend Performance

| Tool | Purpose |
|------|------|
| EXPLAIN | Database query plan analysis |
| [pganalyze](https://pganalyze.com/) | PostgreSQL performance monitoring |
| [New Relic](https://newrelic.com/) / [Datadog](https://www.datadoghq.com/) | APM monitoring |

---

## Low-Level Efficiency Anti-Patterns

Code-level efficiency missteps independent of architecture-level performance issues. Complements resource management and concurrency defects covered in [common-bugs-checklist.md](common-bugs-checklist.md).

### Unnecessary Repeated Work

- [ ] Is the same function/query invoked repeatedly within the same request/render?
- [ ] Is a file/configuration repeatedly read inside a loop (loop-invariant)?
- [ ] Can computed results be cached or passed downstream?

```typescript
// ❌ Loop-invariant executed repeatedly inside loop
for (const path of paths) {
  const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
  processFile(path, config);
}

// ✅ Lift outside loop
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
for (const path of paths) processFile(path, config);
```

### Missed Concurrency Opportunities

- [ ] Are independent async operations awaited sequentially?
- [ ] Can `Promise.all` / `asyncio.gather` / `tokio::join!` be used concurrently?

```typescript
// ❌ Sequential await
const a = await fetchA();
const b = await fetchB();

// ✅ Concurrent
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

### Hot Path Bloat

- [ ] Does module-level / import-time code execute heavy operations (file I/O, network, large object construction)?
- [ ] Does the per-request path have initializations that can be deferred?
- [ ] Does startup code block the first request?

### Unbounded Data Structures

> Resource lifecycle related defects (unclosed connections, unremoved listeners, uncleared timers) can be found in [common-bugs-checklist.md → Resource Management](common-bugs-checklist.md#resource-management). This section focuses on *capacity bounds*.

- [ ] Do global dicts / lists / caches have a `max-size` or TTL?
- [ ] Do accumulating data structures (queues, logs, metrics buffers) have upper limits?
- [ ] Are per-request allocated objects persistently referenced, preventing GC?

```python
# ❌ Unbounded cache
_cache: dict[str, Any] = {}

# ✅ Bounded LRU
from functools import lru_cache

@lru_cache(maxsize=256)
def get_cached(key: str) -> Any:
    return expensive_computation(key)
```

---

## References

- [Core Web Vitals - web.dev](https://web.dev/articles/vitals)
- [Optimizing Core Web Vitals - Vercel](https://vercel.com/guides/optimizing-core-web-vitals-in-2024)
- [MemLab - Meta Engineering](https://engineering.fb.com/2022/09/12/open-source/memlab/)
- [Big O Cheat Sheet](https://www.bigocheatsheet.com/)
- [N+1 Query Problem - Stack Overflow](https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping)
- [API Performance Optimization](https://algorithmsin60days.com/blog/optimizing-api-performance/)
