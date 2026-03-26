# Gallery Section — Integration Guide

A glassmorphism gallery section with 3D tilt, shine sweep, filter buttons, and dots navigation.
Sits directly below the Projects section and seamlessly continues the dark red/black theme.

---

## Files Added

| File | Purpose |
|---|---|
| `assets/css/gallery.css` | All gallery styles (scoped with `.gallery-` prefix) |
| `assets/js/gallery-data.js` | Your image config — edit this to add photos |
| `assets/js/gallery.js` | Gallery logic (filtering, tilt, animation, dots) |
| `gallery/` | Drop your image files here |

---

## Step-by-Step Integration (already done)

The following changes were made to `index.html`:

1. **CSS link** — added in `<head>` after `style.css`:
   ```html
   <link rel="stylesheet" href="assets/css/gallery.css">
   ```

2. **Navbar link** — added between Projects and Reviews:
   ```html
   <a href="#gallery" class="hover:text-red-400 transition">Gallery</a>
   ```

3. **Gallery section** — pasted directly after the Projects `</section>`:
   ```html
   <div class="gallery-section-divider"></div>
   <section id="gallery" ...> ... </section>
   ```

4. **Scripts** — added before `</body>` (after script.js):
   ```html
   <script src="assets/js/gallery-data.js"></script>
   <script src="assets/js/gallery.js"></script>
   ```

---

## How to Add a New Photo

**Step 1 — Add the image file**

Drop the image into the `/gallery/` folder.
Recommended size: **800 × 500 px** (16:10 ratio) · Format: `.jpg` or `.webp`

```
port/
└── gallery/
    ├── my-new-project.jpg   ← put it here
    └── ...
```

**Step 2 — Register it in `gallery-data.js`**

Open `assets/js/gallery-data.js` and add a new object to the array:

```js
{
  title:       "My New Project",
  category:    "web-app",           // "web-app" | "design" | "mobile"
  description: "Short description shown on card hover. Keep it under ~120 characters.",
  imagePath:   "./gallery/my-new-project.jpg"
},
```

Save the file — done. No other changes needed.

---

## Categories

| Key | Filter label |
|---|---|
| `"web-app"` | Web App |
| `"design"` | Design |
| `"mobile"` | Mobile |

To add a custom category, add its entry to `CATEGORY_LABELS` in `gallery.js` and add a matching filter button in the `#galleryFilters` div in `index.html`.

---

## Pagination

When `GALLERY_DATA` has more than **6 items**, dot navigation appears automatically below the grid.
Each dot represents one page of 6 cards. Clicking a dot scrolls back to the gallery top.

To change items per page, edit `ITEMS_PER_PAGE` at the top of `gallery.js`:

```js
var ITEMS_PER_PAGE = 6;  // change to any number
```

---

## Customisation Quick-Reference

| What | Where | What to change |
|---|---|---|
| Active filter colour | `gallery.css` | `#c23232` (search for it) |
| Card blur strength | `gallery.css` | `.gallery-card { backdrop-filter: blur(16px) }` |
| Max tilt angle | `gallery.js` | `rotX = -dy * 9` — change `9` |
| Stagger delay | `gallery.js` | `i * 70` — change `70` (ms per card) |
| Items per page | `gallery.js` | `var ITEMS_PER_PAGE = 6` |
