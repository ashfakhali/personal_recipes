'use strict';
const CFG = { owner: 'ashfakhali', repo: 'personal_recipes', branch: 'main' };
const AISLES = ['Produce', 'Meat & Seafood', 'Dairy & Eggs', 'Bakery', 'Grains & Pasta', 'Baking', 'Spices', 'Condiments & Sauces', 'Oils & Vinegars', 'Frozen', 'Other'];
const UNITS = ['', 'g', 'cup', 'tbsp', 'tsp', 'pinch'];
const EFFORTS = ['Quick', 'Moderate', 'Project'];
const CUISINES = ['American', 'Chinese', 'French', 'Indian', 'Italian', 'Japanese', 'Korean', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Thai', 'Vietnamese'];
const AISLE_RULES = [
  ['Frozen', 'frozen'],
  ['Baking', 'flour|sugar|baking soda|baking powder|yeast|cornstarch|corn starch|cocoa|vanilla'],
  ['Spices', 'salt|black pepper|white pepper|peppercorn|paprika|cumin|turmeric|garam masala|masala|cinnamon|cardamom|ground clove|whole clove|oregano|chil+i flake|red pepper flake|powder|seed|bay leaf|bay leave|nutmeg|spice'],
  ['Oils & Vinegars', 'oil|vinegar'],
  ['Condiments & Sauces', 'ketchup|soy sauce|sauce|mayo|mayonnaise|mustard|stock|broth|paste|sriracha|honey|jam'],
  ['Dairy & Eggs', 'milk|butter|cheese|cheddar|parmesan|mozzarella|gruyere|cream|yogurt|yoghurt|egg|paneer|ghee'],
  ['Meat & Seafood', 'chicken|beef|steak|ribeye|sirloin|pork|lamb|mutton|bacon|sausage|fish|salmon|shrimp|prawn|mince|tuna|turkey'],
  ['Grains & Pasta', 'rice|pasta|macaroni|spaghetti|penne|noodle|oat|quinoa|couscous|panko|breadcrumb'],
  ['Bakery', 'bread|bun|tortilla|pita|naan'],
  ['Produce', 'onion|garlic|potato|tomato|lettuce|carrot|celery|pepper|lemon|lime|thyme|rosemary|parsley|cilantro|coriander|basil|mint|ginger|scallion|chil+i|mushroom|spinach|cabbage|apple|banana|avocado|cucumber|zucchini|shallot|leek|pea|corn|herb'],
].map(([a, k]) => [a, new RegExp(`\\b(${k})(e?s)?\\b`, 'i')]);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uniq = a => [...new Set(a.filter(Boolean))].sort();
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
};
const token = () => store.get('gh_token');
const app = $('#app');
const S = { recipes: [], filters: new Set(), q: '', servings: {}, checked: {}, aisle: store.get('aisle') === '1' };

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------- quantities ---------- */
const UNI = { '¼': .25, '½': .5, '¾': .75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': .125, '⅜': .375, '⅝': .625, '⅞': .875 };
function num(s) {
  s = String(s).trim(); let m;
  if ((m = s.match(/^(\d+)\s*([¼½¾⅓⅔⅛⅜⅝⅞])$/))) return +m[1] + UNI[m[2]];
  if (UNI[s]) return UNI[s];
  if ((m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/))) return +m[1] + m[2] / m[3];
  if ((m = s.match(/^(\d+)\/(\d+)$/))) return m[1] / m[2];
  return /^\d*\.?\d+$/.test(s) ? parseFloat(s) : NaN;
}
const FR = [[0, ''], [1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'], [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'], [1, '']];
function frac(x) {
  let w = Math.floor(x + 1e-9);
  let [v, s] = FR.reduce((a, b) => Math.abs(b[0] - (x - w)) < Math.abs(a[0] - (x - w)) ? b : a);
  if (v === 1) { w++; s = ''; }
  return !w && !s ? '⅛' : `${w || ''}${s}`;
}
const VOL = { tsp: 1, tbsp: 3, cup: 48 };
const normVol = t => t >= 24 ? [t / 48, 'cup'] : t >= 3 ? [t / 3, 'tbsp'] : [t, 'tsp'];
function fmtQty(g, f = 1) {
  if (g.qty == null || g.qty === '' || isNaN(g.qty)) return '';
  let q = g.qty * f, u = g.unit || '';
  if (VOL[u] && f !== 1) [q, u] = normVol(q * VOL[u]);
  if (u === 'g') return `${q < 10 ? Math.round(q * 2) / 2 : q < 100 ? Math.round(q) : Math.round(q / 5) * 5} g`;
  const t = frac(q); return `${t} ${u === 'cup' && q > 1 && t !== '1' ? 'cups' : u}`.trim();
}
function qtyInput(q, u) {
  if (q == null || isNaN(q)) return '';
  if (u === 'g') return String(Math.round(q * 10) / 10);
  const w = Math.floor(q + 1e-9), hit = FR.find(([v]) => Math.abs(v - (q - w)) < 0.01);
  if (!hit) return String(+q.toFixed(2));
  if (hit[0] === 1) return String(w + 1);
  return `${w || ''}${hit[1]}` || '0';
}
const guessAisle = item => (AISLE_RULES.find(([, re]) => re.test(item)) || ['Other'])[0];
const UNIT_ALIASES = [
  [/^(cups?|c)$/i, 'cup', 1], [/^(tablespoons?|tbsps?|tbs|tbl)$/i, 'tbsp', 1], [/^(teaspoons?|tsps?)$/i, 'tsp', 1],
  [/^(grams?|g|gms?)$/i, 'g', 1], [/^(kilograms?|kgs?)$/i, 'g', 1000], [/^(ounces?|oz)$/i, 'g', 28.35],
  [/^(pounds?|lbs?)$/i, 'g', 453.6], [/^pinch(es)?$/i, 'pinch', 1], [/^(ml|millilit(er|re)s?)$/i, 'ml', 1],
  [/^(l|lit(er|re)s?)$/i, 'ml', 1000], [/^floz$/i, 'cup', 1 / 8],
];
function parseLine(line) {
  let s = line.trim().replace(/^[-*•]\s*/, '');
  if (!s) return null;
  let qty = null, unit = '';
  const m = s.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+\s*[¼½¾⅓⅔⅛⅜⅝⅞]|[¼½¾⅓⅔⅛⅜⅝⅞]|\d*\.?\d+)\s*(.*)$/);
  if (m) { qty = num(m[1]); s = m[2]; }
  s = s.replace(/^fl\.?\s*oz\.?\b/i, 'floz');
  const [w, ...rest] = s.split(/\s+/);
  const a = UNIT_ALIASES.find(([re]) => re.test((w || '').replace(/\.$/, '')));
  if (a && (qty != null || a[1] === 'pinch')) {
    unit = a[1]; qty = (qty ?? 1) * a[2]; s = rest.join(' ');
    if (unit === 'ml') [qty, unit] = normVol(qty / 4.93);
    if (unit === 'g') qty = Math.round(qty);
  }
  const item = s.replace(/^of\s+/i, '').trim();
  return { qty: qty == null ? null : +qty.toFixed(4), unit, item, aisle: guessAisle(item) };
}
const fmtMin = m => !m ? '' : m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}`;
const total = r => (+r.prepMin || 0) + (+r.cookMin || 0);
const autoEffort = r => { const t = total(r); return t <= 30 ? 'Quick' : t <= 75 ? 'Moderate' : 'Project'; };
function suggestTags(ings) {
  const txt = ings.map(g => g.item.toLowerCase()).join(' ');
  const t = [['chicken', /chicken/], ['beef', /beef|steak|ribeye|sirloin/], ['pork', /pork|bacon/], ['lamb', /lamb|mutton/],
    ['seafood', /fish|salmon|tuna|shrimp|prawn|cod\b/], ['eggs', /\beggs?\b/], ['pasta', /pasta|macaroni|spaghetti|penne|noodle/],
    ['rice', /\brice\b/], ['potatoes', /potato/], ['paneer', /paneer/], ['tofu', /tofu/]].filter(([, re]) => re.test(txt)).map(([k]) => k);
  if (!ings.some(g => g.aisle === 'Meat & Seafood') && !/fish sauce|anchov|gelatin|chicken|beef|pork/.test(txt)) t.push('vegetarian');
  return t;
}
const slugify = s => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-') || 'recipe';
function uniqueSlug(title) {
  const b = slugify(title); let s = b, i = 2;
  while (S.recipes.some(r => r.slug === s)) s = `${b}-${i++}`;
  return s;
}

/* ---------- GitHub ---------- */
const b64e = s => { let r = ''; for (const x of new TextEncoder().encode(s)) r += String.fromCharCode(x); return btoa(r); };
const b64d = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g, '')), c => c.charCodeAt(0)));
async function gh(path, opt = {}, allow404 = false) {
  const r = await fetch(`https://api.github.com/repos/${CFG.owner}/${CFG.repo}${path}`, {
    ...opt, cache: 'no-store',
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token()}`, ...(opt.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  if (!r.ok && !(allow404 && r.status === 404)) throw new Error(`GitHub ${r.status}: ${(await r.json().catch(() => ({}))).message || r.statusText}`);
  return r;
}
async function getFile(p) {
  const r = await gh(`/contents/${p}?ref=${CFG.branch}`, {}, true);
  if (r.status === 404) return null;
  const j = await r.json(); return { sha: j.sha, text: j.content ? b64d(j.content) : '' };
}
async function putFile(p, text, message) {
  const cur = await getFile(p);
  await gh(`/contents/${p}`, { method: 'PUT', body: JSON.stringify({ message, content: b64e(text), branch: CFG.branch, ...(cur && { sha: cur.sha }) }) });
}
async function delFile(p, message) {
  const cur = await getFile(p);
  if (cur) await gh(`/contents/${p}`, { method: 'DELETE', body: JSON.stringify({ message, sha: cur.sha, branch: CFG.branch }) });
}
async function readJSON(p) {
  if (token()) try { const f = await getFile(p); return f && JSON.parse(f.text); } catch (e) { console.warn(e); }
  const r = await fetch(`${p}?v=${Date.now()}`, { cache: 'no-store' });
  return r.ok ? r.json() : null;
}
async function updateIndex(fn, msg) {
  const cur = await getFile('recipes/index.json');
  const list = fn(cur ? JSON.parse(cur.text) : []).sort();
  await putFile('recipes/index.json', JSON.stringify(list, null, 2) + '\n', msg);
}
async function saveRecipe(rec, isNew, msg) {
  await putFile(`recipes/${rec.slug}.json`, JSON.stringify(rec, null, 2) + '\n', msg || `${isNew ? 'Add' : 'Update'} recipe: ${rec.title}`);
  if (isNew) await updateIndex(l => l.includes(rec.slug) ? l : [...l, rec.slug], `Index: add ${rec.slug}`);
  const i = S.recipes.findIndex(r => r.slug === rec.slug);
  i < 0 ? S.recipes.push(rec) : (S.recipes[i] = rec);
}
async function deleteRecipe(r) {
  await delFile(`recipes/${r.slug}.json`, `Delete recipe: ${r.title}`);
  await updateIndex(l => l.filter(s => s !== r.slug), `Index: remove ${r.slug}`);
  S.recipes = S.recipes.filter(x => x.slug !== r.slug);
}

/* ---------- look ---------- */
const isVeg = r => (r.tags || []).includes('vegetarian');

const MACROS = [['kcal', 'Calories', ''], ['protein', 'Protein', 'g'], ['carbs', 'Carbs', 'g'], ['fiber', 'Fiber', 'g'], ['fat', 'Fat', 'g']];
const hasMacros = r => r.macros && MACROS.some(([k]) => r.macros[k] != null && r.macros[k] !== '');

/* ---------- views ---------- */
const SORTS = { name: ['Name', (a, b) => a.title.localeCompare(b.title)], time: ['Time', (a, b) => total(a) - total(b)],
  kcal: ['Calories', (a, b) => (a.macros?.kcal ?? 1e9) - (b.macros?.kcal ?? 1e9)], rating: ['My rating', (a, b) => ((b.rating?.taste || 0) - (a.rating?.taste || 0)) || ((a.rating?.effort || 0) - (b.rating?.effort || 0))], protein: ['Protein', (a, b) => (b.macros?.protein ?? -1) - (a.macros?.protein ?? -1)] };
const RATINGS = [['taste', 'Taste'], ['effort', 'Effort']];
const stars = (v, cls = '') => `<span class="stars ${cls}" aria-label="${v || 0} of 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= (v || 0) ? 'on' : ''}">★</i>`).join('')}</span>`;
const isMarinade = r => (r.tags || []).includes('marinade');
function viewHome(mode = 'recipes') {
  const M = mode === 'marinades';
  document.title = M ? 'Marinades' : 'Recipe Book';
  S.f ||= { recipes: new Set(), marinades: new Set() };
  S.filters = S.f[mode];
  const rs = S.recipes.filter(r => isMarinade(r) === M);
  S.sort ||= store.get('sort') || 'name';
  const groups = { Cuisine: uniq(rs.map(r => r.cuisine)), Effort: EFFORTS.filter(e => rs.some(r => r.effort === e)), Tags: uniq(rs.flatMap(r => r.tags || [])).filter(t => t !== 'marinade') };
  const has = { Cuisine: (r, v) => r.cuisine === v, Effort: (r, v) => r.effort === v, Tags: (r, v) => (r.tags || []).includes(v) };
  const facet = (g, v) => { const k = `${g}:${v}`, n = rs.filter(r => has[g](r, v)).length;
    return `<label class="opt"><input type="checkbox" data-f="${esc(k)}" ${S.filters.has(k) ? 'checked' : ''}><span>${esc(v)}</span><small>${n}</small></label>`; };
  const wide = matchMedia('(min-width: 761px)').matches;
  app.innerHTML = `<section class="home">
    <div class="homebar">
      <h1>${M ? 'Chicken marinades' : 'Recipes'}</h1>
      <input id="q" class="search" type="search" placeholder="Search recipes or ingredients" aria-label="Search recipes" value="${esc(S.q)}">
      <label class="sortsel">Sort by <select id="sort">${Object.entries(SORTS).map(([k, [l]]) => `<option value="${k}" ${k === S.sort ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    </div>
    ${M ? '<p class="mintro">Each is for about 1 kg of chicken.</p>' : ''}
    <div class="layout">
      <details class="side" ${wide ? 'open' : ''}><summary>Filters${S.filters.size ? ` (${S.filters.size})` : ''}</summary>
        ${Object.entries(groups).filter(([, v]) => v.length).map(([g, vs]) => `<fieldset class="fgroup"><legend>${g}</legend>${vs.map(v => facet(g, v)).join('')}</fieldset>`).join('')}
        ${S.filters.size ? '<button class="link" id="clear">Clear all filters</button>' : ''}
      </details>
      <div class="results">
        <div class="resbar"><span id="count"></span>${[...S.filters].map(k => `<button class="active" data-f="${esc(k)}" aria-label="Remove filter ${esc(k.split(':')[1])}">${esc(k.split(':')[1])} ×</button>`).join('')}</div>
        <div class="rhead-row" aria-hidden="true"><span>Recipe</span><span>Rating</span><span>Cuisine</span><span>Time</span><span>kcal</span><span>Protein</span><span>Effort</span></div>
        <ul id="list" class="rlist"></ul>
      </div>
    </div></section>`;
  const draw = () => {
    const list = rs.filter(matches).sort(SORTS[S.sort][1]);
    $('#count').textContent = `${list.length} of ${rs.length} ${rs.length === 1 ? 'recipe' : 'recipes'}`;
    $('#list').innerHTML = list.length ? list.map(r => `<li><a class="row" href="#/r/${encodeURIComponent(r.slug)}">
      <span class="c-title"><b>${esc(r.title)}</b></span>
      <span class="c-rate">${r.rating?.taste || r.rating?.effort ? `<span title="Taste">${stars(r.rating.taste, 'sm')}</span><span title="Effort" class="diff">${stars(r.rating.effort, 'sm')}</span>` : '<span class="unrated">Not rated</span>'}</span>
      <span class="c-cuisine">${esc(r.cuisine)}</span>
      <span class="c-time">${fmtMin(total(r)) || '–'}</span>
      <span class="c-kcal">${r.macros?.kcal ?? '–'}<em> kcal</em></span>
      <span class="c-prot">${r.macros?.protein != null ? `${r.macros.protein} g` : '–'}<em> protein</em></span>
      <span class="c-eff">${r.effort ? `<span class="pill p-${esc(r.effort)}">${esc(r.effort)}</span>` : ''}${isVeg(r) ? '<span class="pill p-veg">Veg</span>' : ''}</span></a></li>`).join('')
      : `<li class="empty">${rs.length ? 'No recipes match. Try another word or clear the filters.' : 'No recipes yet. <a href="#/new">Add your first one</a>.'}</li>`;
  };
  draw();
  $('#q').addEventListener('input', e => { S.q = e.target.value; draw(); });
  $('#sort').onchange = e => { S.sort = e.target.value; store.set('sort', S.sort); draw(); };
  const toggle = k => { S.filters.has(k) ? S.filters.delete(k) : S.filters.add(k); viewHome(mode); };
  $$('.opt input', app).forEach(c => c.onchange = () => toggle(c.dataset.f));
  $$('.active', app).forEach(b => b.onclick = () => toggle(b.dataset.f));
  $('#clear') && ($('#clear').onclick = () => { S.filters.clear(); viewHome(mode); });
}

function viewGuides() {
  document.title = 'Guides';
  app.innerHTML = `<section class="guides"><div class="homebar"><h1>Guides</h1></div>
    <div class="glist">${Object.entries(GUIDES).map(([k, g]) => `<a class="gcard" href="#/guide/${k}"><h2>${esc(g.title)}</h2><p>${esc(g.blurb)}</p></a>`).join('')}
    <a class="gcard" href="#/marinades"><h2>Chicken marinades</h2><p>Marinades and marinating times.</p></a></div></section>`;
}
function viewGuide(k) {
  const g = GUIDES[k];
  if (!g) return notFound();
  document.title = g.title;
  app.innerHTML = `<article class="guide"><div class="crumbs noprint"><a href="#/guides">← Guides</a></div>
    <header class="ghead"><h1>${esc(g.title)}</h1><button class="btn ghost noprint" id="print">Print</button></header>${g.html}</article>`;
  $('#print').onclick = () => window.print();
}
function matches(r) {
  const by = {};
  for (const k of S.filters) { const i = k.indexOf(':'); (by[k.slice(0, i)] ||= []).push(k.slice(i + 1)); }
  if (by.Cuisine && !by.Cuisine.includes(r.cuisine)) return false;
  if (by.Effort && !by.Effort.includes(r.effort)) return false;
  if (by.Tags && !by.Tags.every(t => (r.tags || []).includes(t))) return false;
  const q = S.q.trim().toLowerCase();
  if (!q) return true;
  const hay = [r.title, r.description, r.cuisine, ...(r.tags || []), ...r.ingredients.map(i => i.item)].join(' ').toLowerCase();
  return q.split(/\s+/).every(w => hay.includes(w));
}

function viewRecipe(slug) {
  const r = S.recipes.find(x => x.slug === slug);
  if (!r) return notFound();
  document.title = r.title;
  const n = S.servings[slug] ?? r.servings, f = n / r.servings;
  const ck = (S.checked[slug] ||= new Set());
  const sd = ((S.stepsDone ||= {})[slug] ||= new Set());
  const li = ([g, i]) => `<li class="${ck.has(i) ? 'done' : ''}" data-i="${i}"><span class="qty">${esc(fmtQty(g, f))}</span><span class="item">${esc(g.item)}</span></li>`;
  const idx = r.ingredients.map((g, i) => [g, i]);
  const ings = S.aisle
    ? AISLES.map(a => { const xs = idx.filter(([g]) => (AISLES.includes(g.aisle) ? g.aisle : 'Other') === a); return xs.length ? `<h4 class="aisle">${a}</h4><ul class="ings">${xs.map(li).join('')}</ul>` : ''; }).join('')
    : idx.some(([g]) => g.group)
      ? [...new Set(idx.map(([g]) => g.group || ''))].map(G => `${G ? `<h4 class="aisle">${esc(G)}</h4>` : ''}<ul class="ings">${idx.filter(([g]) => (g.group || '') === G).map(li).join('')}</ul>`).join('')
      : `<ul class="ings">${idx.map(li).join('')}</ul>`;
  const noteLines = (r.notes || '').split('\n').filter(s => s.trim());
  const notes = noteLines.map((s, i) => `<p class="note"><span>${esc(s)}</span><button class="ndel noprint" data-n="${i}" title="Delete note" aria-label="Delete note">×</button></p>`).join('');
  app.innerHTML = `<article class="recipe">
    <div class="crumbs noprint"><a href="${isMarinade(r) ? '#/marinades' : '#/'}">← ${isMarinade(r) ? 'All marinades' : 'All recipes'}</a></div>
    <header class="rhead">
      <h1>${esc(r.title)}</h1>
      <div class="tags">${(r.tags || []).map(t => `<a href="#/" class="tag" data-tag="${esc(t)}">${esc(t)}</a>`).join('')}</div>
        ${r.source ? `<p class="source">Source: <a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc((() => { try { return new URL(r.source).hostname.replace(/^www\./, ''); } catch { return r.source; } })())}</a></p>` : ''}
      <div class="actions noprint"><button class="btn" id="share">Share</button><button class="btn ghost" id="print">Print recipe</button><a class="btn ghost" href="#/edit/${encodeURIComponent(slug)}">Edit</a></div>
    </header>
    <section class="rcard" id="rcard">
      <div class="rcard-head"><h2>${esc(r.title)}</h2>
        <dl class="stats">${[['Prep', fmtMin(r.prepMin)], ['Cook', fmtMin(r.cookMin)], ['Total', fmtMin(total(r))], ['Servings', n], ['Effort', r.effort], ['Cuisine', r.cuisine]]
          .filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <div class="myrating">${RATINGS.map(([k, l]) => `<div class="rate" data-k="${k}"><span class="rlabel">${l}${k === 'effort' ? ' <small>(5 = a lot of effort)</small>' : ''}</span><span class="stars big">${[1, 2, 3, 4, 5].map(v => `<button class="${v <= (r.rating?.[k] || 0) ? 'on' : ''}" data-v="${v}" aria-label="${l} ${v} of 5">★</button>`).join('')}</span></div>`).join('')}</div>
        ${hasMacros(r) ? `<div class="macros"><span class="mlabel">Per serving <small>(approx.)</small></span>${MACROS.filter(([k]) => r.macros[k] != null && r.macros[k] !== '')
          .map(([k, l, u]) => `<div class="m m-${k}"><b>${esc(r.macros[k])}${u}</b><span>${l}</span></div>`).join('')}</div>` : ''}
      </div>
    <div class="rbody">
      <aside class="ingpanel">
        <div class="inghead"><h2>Ingredients</h2>
          <div class="serv"><button class="noprint" id="sminus" aria-label="Fewer servings">−</button><input id="sv" type="number" min="1" value="${n}" aria-label="Servings"><span>servings</span><button class="noprint" id="splus" aria-label="More servings">+</button></div>
        </div>
        <div class="seg noprint"><button data-m="0" class="${S.aisle ? '' : 'on'}">Recipe order</button><button data-m="1" class="${S.aisle ? 'on' : ''}">By aisle</button></div>
        ${ings}
        ${f !== 1 ? `<p class="scaled noprint">Scaled from ${r.servings} servings. <button class="link" id="reset">Reset</button></p>` : ''}
      </aside>
      <section class="method">
        <h2>Method</h2>
        <ol class="steps">${(r.steps || []).map((s, i) => s.startsWith('## ') ? `<li class="sh">${esc(s.slice(3))}</li>` : `<li class="${sd.has(i) ? 'done' : ''}" data-s="${i}" role="checkbox" aria-checked="${sd.has(i)}" tabindex="0">${esc(s)}</li>`).join('')}</ol>
        ${(r.variations || []).length ? `<div class="subs vars"><h2>Variations</h2><ul>${r.variations.map(x => `<li><b>${esc(x.item)}</b><span>${esc(x.swap)}</span></li>`).join('')}</ul></div>` : ''}
        ${(r.subs || []).length ? `<div class="subs"><h2>Substitutions</h2><ul>${r.subs.map(x => `<li><b>${esc(x.item)}</b><span>${esc(x.swap)}</span></li>`).join('')}</ul></div>` : ''}
        <div class="notes ${notes ? '' : 'noprint'}"><h2>Notes</h2>${notes || '<p class="muted">No notes yet.</p>'}
          <form id="noteform" class="noprint"><textarea id="note" rows="2" placeholder="Add a note — tweaks, what worked, what to try next…"></textarea><button class="btn ghost">Add note</button></form>
        </div>
      </section>
    </div></section></article>`;
  const setN = v => { S.servings[slug] = Math.max(1, Math.round(v) || 1); viewRecipe(slug); };
  $$('.rate', app).forEach(el => el.querySelectorAll('button').forEach(b => b.onclick = async () => {
    if (!token()) return toast('Add your GitHub token in Settings to rate');
    const k = el.dataset.k, v = +b.dataset.v, cur = r.rating?.[k] || 0, nv = v === cur ? 0 : v;
    const rating = { ...(r.rating || {}), [k]: nv };
    if (!nv) delete rating[k];
    el.querySelectorAll('button').forEach(x => x.classList.toggle('on', +x.dataset.v <= nv));
    try { await saveRecipe({ ...r, ...(Object.keys(rating).length ? { rating } : { rating: undefined }) }, false, `Rate: ${r.title}`); toast(nv ? `${k === 'taste' ? 'Taste' : 'Effort'}: ${nv}/5` : 'Rating cleared'); viewRecipe(slug); }
    catch (err) { toast(err.message); viewRecipe(slug); }
  }));
  $('#sminus').onclick = () => setN(n - 1);
  $('#splus').onclick = () => setN(n + 1);
  $('#sv').onchange = e => setN(+e.target.value);
  $('#reset') && ($('#reset').onclick = () => setN(r.servings));
  $$('.seg button', app).forEach(b => b.onclick = () => { S.aisle = b.dataset.m === '1'; store.set('aisle', S.aisle ? '1' : '0'); viewRecipe(slug); });
  $$('.steps li[data-s]', app).forEach(el => { const t = () => { const i = +el.dataset.s; sd.has(i) ? sd.delete(i) : sd.add(i); el.classList.toggle('done'); el.setAttribute('aria-checked', sd.has(i)); };
    el.onclick = t; el.onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); t(); } }; });
  $$('.ings li', app).forEach(el => el.onclick = () => { const i = +el.dataset.i; ck.has(i) ? ck.delete(i) : ck.add(i); el.classList.toggle('done'); });
  $$('.tag', app).forEach(a => { const m = isMarinade(r); a.href = m ? '#/marinades' : '#/'; a.onclick = () => { (S.f ||= { recipes: new Set(), marinades: new Set() })[m ? 'marinades' : 'recipes'] = a.dataset.tag === 'marinade' ? new Set() : new Set([`Tags:${a.dataset.tag}`]); S.q = ''; }; });
  $('#print').onclick = () => window.print();
  $('#share').onclick = async () => {
    const url = `${location.origin}${location.pathname}#/r/${encodeURIComponent(slug)}`;
    if (navigator.share) return navigator.share({ title: r.title, url }).catch(() => {});
    try { await navigator.clipboard.writeText(url); toast('Link copied'); } catch { prompt('Copy this link:', url); }
  };
  $$('.ndel', app).forEach(b => b.onclick = async () => {
    if (!token()) return toast('Add your GitHub token in Settings to delete notes');
    if (!b.dataset.armed) { $$('.ndel', app).forEach(x => { delete x.dataset.armed; x.textContent = '×'; }); b.dataset.armed = 1; b.textContent = 'Delete?'; return; }
    b.disabled = true; b.textContent = 'Deleting…';
    try {
      await saveRecipe({ ...r, notes: noteLines.filter((_, i) => i !== +b.dataset.n).join('\n') }, false, `Delete note: ${r.title}`);
      toast('Note deleted'); viewRecipe(slug);
    } catch (err) { toast(err.message); b.disabled = false; b.textContent = '×'; }
  });
  $('#noteform').onsubmit = async e => {
    e.preventDefault();
    const text = $('#note').value.trim();
    if (!text) return;
    if (!token()) return toast('Add your GitHub token in Settings to save notes');
    const btn = $('#noteform button'); btn.disabled = true; btn.textContent = 'Saving…';
    const d = new Date(), date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    try {
      await saveRecipe({ ...r, notes: `${r.notes ? r.notes.trimEnd() + '\n' : ''}${date} — ${text}` }, false, `Add note: ${r.title}`);
      toast('Note saved'); viewRecipe(slug);
    } catch (err) { toast(err.message); btn.disabled = false; btn.textContent = 'Add note'; }
  };
}

const ingRow = g => `<div class="irow" ${g.item ? 'data-manual="1"' : ''} ${g.group ? `data-group="${esc(g.group)}"` : ''}>
  <input class="iq" inputmode="decimal" value="${esc(qtyInput(g.qty, g.unit))}" placeholder="Qty" aria-label="Quantity">
  <select class="iu" aria-label="Unit">${UNITS.map(u => `<option value="${u}" ${u === (g.unit || '') ? 'selected' : ''}>${u || '—'}</option>`).join('')}</select>
  <input class="ii" value="${esc(g.item)}" placeholder="Ingredient, prep" aria-label="Ingredient">
  <select class="ia" aria-label="Aisle">${AISLES.map(a => `<option ${a === (g.aisle || 'Other') ? 'selected' : ''}>${a}</option>`).join('')}</select>
  <button type="button" class="x" title="Remove" aria-label="Remove">×</button></div>`;

function viewEdit(slug) {
  const isNew = !slug;
  const r = isNew ? { title: '', description: '', cuisine: '', effort: '', tags: [], servings: 2, prepMin: '', cookMin: '', ingredients: [], steps: [], notes: '' }
    : S.recipes.find(x => x.slug === slug);
  if (!r) return notFound();
  document.title = isNew ? 'New recipe' : `Edit · ${r.title}`;
  const back = isNew ? '#/' : `#/r/${encodeURIComponent(slug)}`;
  const rows = r.ingredients.length ? r.ingredients : [{ qty: null, unit: '', item: '' }];
  app.innerHTML = `<form class="editor" id="ed" autocomplete="off">
    <div class="crumbs"><a href="${back}">← ${isNew ? 'All recipes' : 'Back to recipe'}</a></div>
    <h1>${isNew ? 'New recipe' : 'Edit recipe'}</h1>
    ${token() ? '' : '<p class="warn">This device is read-only. <a href="#/settings">Add your GitHub token</a> to save.</p>'}
    <label class="f">Title<input name="title" required value="${esc(r.title)}"></label>
    <div class="fgrid">
      <label class="f">Cuisine<input name="cuisine" list="cuisines" value="${esc(r.cuisine)}"></label>
      <label class="f">Effort<select name="effort"><option value="">Auto (from time)</option>${EFFORTS.map(e => `<option ${e === r.effort ? 'selected' : ''}>${e}</option>`).join('')}</select></label>
      <label class="f">Prep (min)<input name="prepMin" type="number" min="0" value="${esc(r.prepMin)}"></label>
      <label class="f">Cook (min)<input name="cookMin" type="number" min="0" value="${esc(r.cookMin)}"></label>
      <label class="f">Servings<input name="servings" type="number" min="1" value="${esc(r.servings || 2)}"></label>
    </div>
    <div class="f">Macros per serving <small>Optional. Rough estimates are fine. They stay the same when you change servings.</small>
      <div class="fgrid">${MACROS.map(([k, l, u]) => `<label class="f sub">${l}${u ? ` (${u})` : ''}<input name="m_${k}" type="number" min="0" step="1" value="${esc(r.macros?.[k] ?? '')}"></label>`).join('')}</div></div>
    <datalist id="cuisines">${uniq([...CUISINES, ...S.recipes.map(x => x.cuisine)]).map(c => `<option value="${esc(c)}">`).join('')}</datalist>
    <div class="f">Tags <small>comma-separated</small><div class="tagin"><input name="tags" value="${esc((r.tags || []).join(', '))}" aria-label="Tags"><button type="button" class="btn ghost" id="sugg">Suggest</button></div></div>
    <label class="f">Source link <small>Optional. Where the recipe came from.</small><input name="source" type="url" placeholder="https://…" value="${esc(r.source || '')}"></label>
    <fieldset><legend>Ingredients</legend>
      <div class="ihead"><span>Qty</span><span>Unit</span><span>Ingredient</span><span>Aisle</span><span></span></div>
      <div id="rows">${rows.map(ingRow).join('')}</div>
      <button type="button" class="btn ghost" id="addrow">+ Add ingredient</button>
      <details class="paste"><summary>Paste a list instead</summary>
        <textarea id="pastebox" rows="5" placeholder="2 cups cooked rice&#10;8 oz cheddar, grated&#10;1 onion, finely chopped"></textarea>
        <div class="row"><button type="button" class="btn ghost" id="parse">Add these</button><small>oz and lb become grams; ml becomes cups/spoons. Aisles are guessed — check them.</small></div>
      </details>
    </fieldset>
    <label class="f">Method <small>leave a blank line between steps; start a line with ## for a section heading</small><textarea name="steps" rows="9">${esc((r.steps || []).join('\n\n'))}</textarea></label>
    <label class="f">Variations <small>one per line: name: what changes</small><textarea name="variations" rows="3">${esc((r.variations || []).map(x => `${x.item}: ${x.swap}`).join('\n'))}</textarea></label>
    <label class="f">Substitutions <small>one per line: ingredient: swap</small><textarea name="subs" rows="4">${esc((r.subs || []).map(x => `${x.item}: ${x.swap}`).join('\n'))}</textarea></label>
    <label class="f">Notes<textarea name="notes" rows="4">${esc(r.notes || '')}</textarea></label>
    <div class="actions"><button class="btn" id="save">Save</button><a class="btn ghost" href="${back}">Cancel</a>${isNew ? '' : '<button type="button" class="btn danger" id="del">Delete</button>'}</div>
  </form>`;
  const form = $('#ed'), rowsEl = $('#rows');
  const readRows = () => $$('.irow', form).map(row => {
    const q = $('.iq', row).value.trim(), n = q ? num(q) : null;
    return { qty: n == null || isNaN(n) ? null : +n.toFixed(4), unit: $('.iu', row).value, item: $('.ii', row).value.trim(), aisle: $('.ia', row).value, ...(row.dataset.group ? { group: row.dataset.group } : {}) };
  }).filter(g => g.item);
  rowsEl.addEventListener('click', e => { if (e.target.classList.contains('x')) e.target.closest('.irow').remove(); });
  rowsEl.addEventListener('change', e => {
    const row = e.target.closest('.irow');
    if (e.target.classList.contains('ia')) row.dataset.manual = '1';
    if (e.target.classList.contains('ii') && !row.dataset.manual) $('.ia', row).value = guessAisle(e.target.value);
    if (e.target.classList.contains('iq') && e.target.value && isNaN(num(e.target.value))) toast('Use numbers like 2, 1.5, 1/2 or 1 1/2');
  });
  $('#addrow').onclick = () => { rowsEl.insertAdjacentHTML('beforeend', ingRow({ qty: null, unit: '', item: '' })); $('.irow:last-child .iq', rowsEl).focus(); };
  $('#parse').onclick = () => {
    const parsed = $('#pastebox').value.split('\n').map(parseLine).filter(Boolean);
    $$('.irow', rowsEl).forEach(row => { if (!$('.ii', row).value.trim()) row.remove(); });
    rowsEl.insertAdjacentHTML('beforeend', parsed.map(g => ingRow(g).replace('data-manual="1"', '')).join(''));
    $('#pastebox').value = ''; $('.paste').open = false;
    toast(`Added ${parsed.length} ingredient${parsed.length === 1 ? '' : 's'}`);
  };
  $('#sugg').onclick = () => {
    const el = form.elements.tags;
    el.value = uniq([...el.value.split(',').map(t => t.trim().toLowerCase()), ...suggestTags(readRows())]).join(', ');
  };
  form.onsubmit = async e => {
    e.preventDefault();
    if (!token()) return toast('Add your GitHub token in Settings to save');
    const v = k => String(form.elements[k].value || '').trim();
    const rec = {
      slug: isNew ? uniqueSlug(v('title')) : r.slug, title: v('title'), cuisine: v('cuisine'), effort: '',
      tags: uniq(v('tags').split(',').map(t => t.trim().toLowerCase())), servings: Math.max(1, +v('servings') || 1),
      prepMin: +v('prepMin') || 0, cookMin: +v('cookMin') || 0, ingredients: readRows(),
      steps: v('steps').split(/\n\s*\n/.test(v('steps')) ? /\n\s*\n/ : '\n').map(s => s.trim().replace(/\s*\n\s*/g, ' ').replace(/^\d+[.)]\s*/, '')).filter(Boolean), notes: v('notes'),
    };
    rec.effort = v('effort') || autoEffort(rec);
    rec.source = v('source'); delete rec.sticker;
    const pairs = k => v(k).split('\n').map(l => l.trim()).filter(Boolean).map(l => { const i = l.indexOf(':'); return i < 0 ? { item: l, swap: '' } : { item: l.slice(0, i).trim(), swap: l.slice(i + 1).trim() }; });
    const subs = pairs('subs'), vars = pairs('variations');
    if (subs.length) rec.subs = subs;
    if (vars.length) rec.variations = vars;
    if (r.rating) rec.rating = r.rating;
    const mac = Object.fromEntries(MACROS.map(([k]) => [k, v(`m_${k}`) === '' ? null : Math.round(+v(`m_${k}`))]).filter(([, x]) => x != null));
    if (Object.keys(mac).length) rec.macros = mac; else delete rec.macros;
    const btn = $('#save'); btn.disabled = true; btn.textContent = 'Saving…';
    try {
      await saveRecipe(rec, isNew); toast('Saved'); location.hash = `#/r/${encodeURIComponent(rec.slug)}`; }
    catch (err) { toast(err.message); btn.disabled = false; btn.textContent = 'Save'; }
  };
  const del = $('#del');
  if (del) del.onclick = async () => {
    if (!token()) return toast('Add your GitHub token in Settings first');
    if (!del.dataset.armed) { del.dataset.armed = 1; del.textContent = 'Click again to delete'; return; }
    del.disabled = true; del.textContent = 'Deleting…';
    try { await deleteRecipe(r); toast('Deleted'); location.hash = '#/'; }
    catch (err) { toast(err.message); del.disabled = false; del.textContent = 'Delete'; }
  };
}

function viewSettings() {
  document.title = 'Settings';
  const has = !!token();
  app.innerHTML = `<section class="settings">
    <div class="crumbs"><a href="#/">← All recipes</a></div>
    <h1>Settings</h1>
    <h2>Editing on this device</h2>
    <p>Edits are saved straight to <code>${CFG.owner}/${CFG.repo}</code> on GitHub. Anyone can view the site; only browsers with a token can edit. The token stays in this browser only.</p>
    <ol class="howto">
      <li>Open <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">GitHub → New fine-grained token</a>.</li>
      <li>Repository access: <b>Only select repositories</b> → <code>${CFG.repo}</code>.</li>
      <li>Permissions → Repository → <b>Contents: Read and write</b>.</li>
      <li>Generate, copy, and paste it below.</li>
    </ol>
    <p class="status ${has ? 'ok' : ''}">${has ? '✓ A token is saved on this device.' : 'No token saved — this device is read-only.'}</p>
    <div class="tokrow"><input id="tok" type="password" placeholder="github_pat_…" autocomplete="off"><button class="btn" id="savetok">Save &amp; test</button>${has ? '<button class="btn ghost" id="rmtok">Remove</button>' : ''}</div>
  </section>`;
  $('#savetok').onclick = async () => {
    const t = $('#tok').value.trim();
    if (!t) return toast('Paste a token first');
    store.set('gh_token', t);
    try { await gh(`/contents/recipes/index.json?ref=${CFG.branch}`); toast('Token works'); viewSettings(); }
    catch (err) { store.set('gh_token', null); toast(`Token rejected — ${err.message}`); }
  };
  $('#rmtok') && ($('#rmtok').onclick = () => { store.set('gh_token', null); toast('Token removed'); viewSettings(); });
}

function notFound() { app.innerHTML = '<p class="empty">Recipe not found. <a href="#/">Back to all recipes</a></p>'; }

function route() {
  const [, a, b] = (location.hash.slice(1) || '/').split('/');
  const s = b && decodeURIComponent(b);
  if (a === 'r') viewRecipe(s);
  else if (a === 'edit') viewEdit(s);
  else if (a === 'new') viewEdit(null);
  else if (a === 'settings') viewSettings();
  else if (a === 'marinades') viewHome('marinades');
  else if (a === 'guides') viewGuides();
  else if (a === 'guide') viewGuide(s);
  else viewHome();
}
async function load() {
  app.innerHTML = '<p class="empty">Loading recipes…</p>';
  try {
    const idx = (await readJSON('recipes/index.json')) || [];
    S.recipes = (await Promise.all(idx.map(s => readJSON(`recipes/${s}.json`).catch(() => null)))).filter(Boolean);
  } catch (e) { app.innerHTML = `<p class="empty">Couldn't load recipes: ${esc(e.message)}</p>`; return; }
  route();
}
$('#foot').innerHTML = `<div class="strip">${['egg', 'chili', 'rice', 'fries', 'steak', 'cheese', 'leaf', 'pot', 'carrot', 'cake', 'bread', 'drumstick'].map(k => stickerSVG(k, 'f')).join('')}</div>`;
addEventListener('hashchange', () => { route(); scrollTo(0, 0); });
load();
