# CSS / Less / Sass Review Guide

CSS and preprocessor code review guide covering performance, maintainability, responsive design, and browser compatibility.

## CSS Variables vs Hardcoding

### Scenarios Where Variables Should Be Used

```css
/* ❌ Hardcoded - difficult to maintain */
.button {
  background: #3b82f6;
  border-radius: 8px;
}
.card {
  border: 1px solid #3b82f6;
  border-radius: 8px;
}

/* ✅ Using CSS variables */
:root {
  --color-primary: #3b82f6;
  --radius-md: 8px;
}
.button {
  background: var(--color-primary);
  border-radius: var(--radius-md);
}
.card {
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
}
```

### Variable Naming Conventions

```css
/* Recommended variable categories */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-text: #1f2937;
  --color-text-muted: #6b7280;
  --color-bg: #ffffff;
  --color-border: #e5e7eb;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Typography */
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-weight-normal: 400;
  --font-weight-bold: 700;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}
```

### Variable Scope Recommendations

```css
/* ✅ Component-level variables - reduce global scope pollution */
.card {
  --card-padding: var(--spacing-md);
  --card-radius: var(--radius-md);

  padding: var(--card-padding);
  border-radius: var(--card-radius);
}

/* ⚠️ Avoid frequently modifying variables dynamically via JS - impacts performance */
```

### Review Checklist

- [ ] Are color values using variables?
- [ ] Does spacing originate from design system tokens?
- [ ] Are repeated values extracted as variables?
- [ ] Is variable naming semantic?

---

## !important Usage Conventions

### When Allowed

```css
/* ✅ Utility classes - explicitly requiring override */
.hidden { display: none !important; }
.sr-only { position: absolute !important; }

/* ✅ Overriding third-party library styles (when source cannot be modified) */
.third-party-modal {
  z-index: 9999 !important;
}

/* ✅ Print styles */
@media print {
  .no-print { display: none !important; }
}
```

### When Prohibited

```css
/* ❌ Resolving specificity issues - selector should be refactored instead */
.button {
  background: blue !important;  /* Why is !important needed? */
}

/* ❌ Overriding self-authored styles */
.card { padding: 20px; }
.card { padding: 30px !important; }  /* Modify original rule directly */

/* ❌ Inside component styles */
.my-component .title {
  font-size: 24px !important;  /* Breaks component encapsulation */
}
```

### Alternatives

```css
/* Issue: Need to override .btn style */

/* ❌ Using !important */
.my-btn {
  background: red !important;
}

/* ✅ Increasing specificity */
button.my-btn {
  background: red;
}

/* ✅ Using more specific selector */
.container .my-btn {
  background: red;
}

/* ✅ Using :where() to lower specificity of overridden style */
:where(.btn) {
  background: blue;  /* Specificity is 0 */
}
.my-btn {
  background: red;   /* Can override normally */
}
```

### Review Feedback Examples

```markdown
🔴 [blocking] "Found 15 instances of !important; please justify necessity for each"
🟡 [important] "This !important can be resolved by adjusting selector specificity"
💡 [suggestion] "Consider using CSS Layers (@layer) to manage style priority"
```

---

## Performance Considerations

### 🔴 High-Risk Performance Issues

#### 1. transition: all Issue

```css
/* ❌ Performance killer - browser checks all animatable properties */
.button {
  transition: all 0.3s ease;
}

/* ✅ Explicitly specify properties */
.button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* ✅ Use variables for multiple properties */
.button {
  --transition-duration: 0.3s;
  transition:
    background-color var(--transition-duration) ease,
    box-shadow var(--transition-duration) ease,
    transform var(--transition-duration) ease;
}
```

#### 2. box-shadow Animation

```css
/* ❌ Triggers repaint per frame - severely impacts performance */
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
}
.card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

/* ✅ Use pseudo-element + opacity */
.card {
  position: relative;
}
.card::after {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: inherit;
}
.card:hover::after {
  opacity: 1;
}
```

#### 3. Properties Triggering Layout (Reflow)

```css
/* ❌ Animating these properties triggers layout recalculation */
.bad-animation {
  transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, margin 0.3s;
}

/* ✅ Animate only transform and opacity (triggers composite only) */
.good-animation {
  transition: transform 0.3s, opacity 0.3s;
}

/* Use translate instead of top/left for movement */
.move {
  transform: translateX(100px);  /* ✅ */
  /* left: 100px; */             /* ❌ */
}

/* Use scale instead of width/height for sizing */
.grow {
  transform: scale(1.1);  /* ✅ */
  /* width: 110%; */      /* ❌ */
}
```

### 🟡 Moderate Performance Issues

#### Complex Selectors

```css
/* ❌ Deep nesting - slow selector matching */
.page .container .content .article .section .paragraph span {
  color: red;
}

/* ✅ Flattened */
.article-text {
  color: red;
}

/* ❌ Universal selector */
* { box-sizing: border-box; }           /* Impacts all elements */
[class*="icon-"] { display: inline; }   /* Attribute selectors are slower */

/* ✅ Restrict scope */
.icon-box * { box-sizing: border-box; }
```

#### Excessive Shadows and Filters

```css
/* ⚠️ Complex shadows impact render performance */
.heavy-shadow {
  box-shadow:
    0 1px 2px rgba(0,0,0,0.1),
    0 2px 4px rgba(0,0,0,0.1),
    0 4px 8px rgba(0,0,0,0.1),
    0 8px 16px rgba(0,0,0,0.1),
    0 16px 32px rgba(0,0,0,0.1);  /* 5 shadow layers */
}

/* ⚠️ Filters consume GPU */
.blur-heavy {
  filter: blur(20px) brightness(1.2) contrast(1.1);
  backdrop-filter: blur(10px);  /* Even higher performance cost */
}
```

### Performance Optimization Recommendations

```css
/* Use will-change to hint browser (use with caution) */
.animated-element {
  will-change: transform, opacity;
}

/* Remove will-change after animation completes */
.animated-element.idle {
  will-change: auto;
}

/* Use contain to limit repaint scope */
.card {
  contain: layout paint;  /* Tells browser internal changes do not affect exterior */
}
```

### Performance Review Checklist

- [ ] Is `transition: all` used?
- [ ] Are width/height/top/left animated?
- [ ] Is box-shadow animated?
- [ ] Does selector nesting exceed 3 levels?
- [ ] Is there unnecessary `will-change`?

---

## Responsive Design Checkpoints

### Mobile First Principle

```css
/* ✅ Mobile First - base styles target mobile */
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

/* Progressive enhancement */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    flex-direction: row;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* ❌ Desktop First - requires overriding more styles */
.container {
  max-width: 1200px;
  padding: 32px;
  flex-direction: row;
}

@media (max-width: 1023px) {
  .container {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .container {
    padding: 16px;
    flex-direction: column;
    max-width: none;
  }
}
```

### Breakpoint Recommendations

```css
/* Recommended breakpoints (based on content break points rather than specific devices) */
:root {
  --breakpoint-sm: 640px;   /* Large phones */
  --breakpoint-md: 768px;   /* Tablet portrait */
  --breakpoint-lg: 1024px;  /* Tablet landscape / small laptops */
  --breakpoint-xl: 1280px;  /* Desktop */
  --breakpoint-2xl: 1536px; /* Large desktop */
}

/* Usage example */
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
```

### Responsive Review Checklist

- [ ] Is Mobile First adopted?
- [ ] Are breakpoints based on content break points rather than specific devices?
- [ ] Are overlapping breakpoints avoided?
- [ ] Do typography units use relative values (rem/em)?
- [ ] Are touch targets sufficiently large (≥44px)?
- [ ] Is orientation switching tested?

### Common Pitfalls

```css
/* ❌ Fixed width */
.container {
  width: 1200px;
}

/* ✅ Max width + flexible */
.container {
  width: 100%;
  max-width: 1200px;
  padding-inline: 16px;
}

/* ❌ Fixed height text container */
.text-box {
  height: 100px;  /* Text may overflow */
}

/* ✅ Minimum height */
.text-box {
  min-height: 100px;
}

/* ❌ Small touch target */
.small-button {
  padding: 4px 8px;  /* Too small, hard to click */
}

/* ✅ Sufficient touch area */
.touch-button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

---

## Browser Compatibility

### Features to Inspect

| Feature | Compatibility | Recommendation |
|------|--------|------|
| CSS Grid | Modern browsers ✅ | IE requires Autoprefixer + testing |
| Flexbox | Widely supported ✅ | Legacy requires prefixes |
| CSS Variables | Modern browsers ✅ | IE unsupported, requires fallback |
| `gap` (flexbox) | Newer ⚠️ | Safari 14.1+ |
| `:has()` | Newer ⚠️ | Firefox 121+ |
| `container queries` | Newer ⚠️ | Browsers after 2023 |
| `@layer` | Newer ⚠️ | Check target browsers |

### Fallback Strategies

```css
/* CSS variable fallback */
.button {
  background: #3b82f6;              /* Fallback value */
  background: var(--color-primary); /* Modern browsers */
}

/* Flexbox gap fallback */
.flex-container {
  display: flex;
  gap: 16px;
}
/* Legacy browser fallback */
.flex-container > * + * {
  margin-left: 16px;
}

/* Grid fallback */
.grid {
  display: flex;
  flex-wrap: wrap;
}
@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
```

### Autoprefixer Configuration

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')({
      // Configured based on browserslist
      grid: 'autoplace',  // Enable Grid prefixing (IE support)
      flexbox: 'no-2009', // Use modern flexbox syntax only
    }),
  ],
};

// package.json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11"  // Based on project requirements
  ]
}
```

### Compatibility Review Checklist

- [ ] Checked [Can I Use](https://caniuse.com)?
- [ ] Are fallback solutions provided for new features?
- [ ] Is Autoprefixer configured?
- [ ] Does browserslist meet project requirements?
- [ ] Tested in target browsers?

---

## Less / Sass Specific Issues

### Nesting Depth

```scss
/* ❌ Excessive nesting - selector too long after compilation */
.page {
  .container {
    .content {
      .article {
        .title {
          color: red;  // Compiles to .page .container .content .article .title
        }
      }
    }
  }
}

/* ✅ Max 3 levels */
.article {
  &__title {
    color: red;
  }

  &__content {
    p { margin-bottom: 1em; }
  }
}
```

### Mixin vs Extend vs Variables

```scss
/* Variables - for single values */
$primary-color: #3b82f6;

/* Mixin - for configurable code blocks */
@mixin button-variant($bg, $text) {
  background: $bg;
  color: $text;
  &:hover {
    background: darken($bg, 10%);
  }
}

/* Extend - for sharing identical styles (use with caution) */
%visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.sr-only {
  @extend %visually-hidden;
}

/* ⚠️ Issues with @extend */
// May generate unexpected selector combinations
// Cannot be used inside @media
// Prefer mixins
```

### Less/Sass Review Checklist

- [ ] Does nesting exceed 3 levels?
- [ ] Is @extend abused?
- [ ] Are mixins overly complex?
- [ ] Is compiled CSS size reasonable?

---

## Quick Review Checklist

### 🔴 Must Fix

```markdown
□ transition: all
□ Animating width/height/top/left/margin
□ Excessive !important
□ Hardcoded color/spacing repeated >3 times
□ Selector nesting >4 levels
```

### 🟡 Should Fix

```markdown
□ Missing responsive handling
□ Using Desktop First
□ Complex box-shadow being animated
□ Missing browser compatibility fallback
□ CSS variable scope too broad
```

### 🟢 Optimization Suggestions

```markdown
□ Can use CSS Grid to simplify layout
□ Can use CSS variables to extract repeated values
□ Can use @layer to manage priority
□ Can add contain property for performance optimization
```

---

## Recommended Tools

| Tool | Purpose |
|------|------|
| [Stylelint](https://stylelint.io/) | CSS linting |
| [PurgeCSS](https://purgecss.com/) | Remove unused CSS |
| [Autoprefixer](https://autoprefixer.github.io/) | Add vendor prefixes automatically |
| [CSS Stats](https://cssstats.com/) | Analyze CSS statistics |
| [Can I Use](https://caniuse.com/) | Browser compatibility lookup |

---

## References

- [CSS Performance Optimization - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS)
- [What a CSS Code Review Might Look Like - CSS-Tricks](https://css-tricks.com/what-a-css-code-review-might-look-like/)
- [How to Animate Box-Shadow - Tobias Ahlin](https://tobiasahlin.com/blog/how-to-animate-box-shadow/)
- [Media Query Fundamentals - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries)
- [Autoprefixer - GitHub](https://github.com/postcss/autoprefixer)
