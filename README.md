# Recipe Book

My personal recipe catalogue: a static site hosted on GitHub Pages.

**Live site:** https://ashfakhali.github.io/personal_recipes/

## Features
- Search, plus filters by cuisine, effort (Quick ≤30 min / Moderate ≤75 / Project) and tags
- A servings control that rescales every quantity (grams and cups/tbsp/tsp, never oz)
- Ingredients in recipe order or grouped by grocery aisle; tap an item to tick it off
- A share link for each recipe (`…/#/r/<slug>`) and a print layout (Print / PDF → "Save as PDF")
- An add/edit form and quick notes. Saving commits straight to this repo.
- No photos needed: recipes are text cards. Illustrations are used only as site decoration (category tiles and footer).
- Optional source link on each recipe.
- Approximate macros per serving (calories, protein, carbs, fat), editable in the form.

## One-time setup
1. **Enable Pages:** Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
2. **Edit access (once per device):** create a [fine-grained token](https://github.com/settings/personal-access-tokens/new)
   with *Only select repositories → personal_recipes* and *Contents: Read and write*. Paste it into the site's ⚙ Settings page.
   The token is stored only in that browser. Visitors without a token get a read-only view.

## Data
Each recipe is `recipes/<slug>.json`, and `recipes/index.json` lists the slugs.

```json
{
  "slug": "omurice", "title": "Omurice", "description": "…",
  "cuisine": "Japanese", "effort": "Quick", "tags": ["rice", "eggs"],
  "servings": 2, "prepMin": 10, "cookMin": 20,
  "macros": { "kcal": 645, "protein": 34, "carbs": 67, "fat": 26 },
  "ingredients": [{ "qty": 2, "unit": "cup", "item": "cooked rice", "aisle": "Grains & Pasta" }],
  "steps": ["…"], "notes": "", "source": ""
}
```
`unit` is one of `g`, `cup`, `tbsp`, `tsp`, `pinch`, or `""` for counted items. `qty` may be `null` for amounts like "to taste".
