'use strict';
// Hand-drawn food stickers (64×64). Pick one per recipe in the editor, or leave on Auto.
const STICKERS = {
  egg: ['Fried egg', '<path d="M14 30c-4-9 4-18 13-16 5-6 16-5 19 3 9 1 12 12 6 18 3 8-5 15-13 13-6 6-17 4-19-4-8-1-10-10-6-14z" fill="#fff"/><circle cx="32" cy="32" r="9" fill="#FFC233"/><circle cx="29" cy="29" r="2.5" fill="#fff" stroke="none"/>'],
  rice: ['Rice bowl', '<path d="M30 6l14 24M38 4l10 26" stroke-width="3"/><path d="M12 32c2-9 10-13 20-13s18 4 20 13z" fill="#fff"/><path d="M9 32h46c0 13-10 21-23 21S9 45 9 32z" fill="#4DA8FF"/><path d="M18 40c4 3 9 3 13 0M33 40c4 3 9 3 13 0" stroke="#fff" stroke-width="2.5"/><path d="M24 58h16"/>'],
  steak: ['Steak', '<path d="M10 32c0-11 11-18 24-18 13 0 21 7 21 17 0 11-7 21-21 21-7 0-9-6-15-6-6 0-9-6-9-14z" fill="#E8564A"/><path d="M17 31c0-7 8-11 16-11 10 0 16 5 16 11" stroke="#fff" stroke-width="3"/><circle cx="38" cy="36" r="5.5" fill="#fff"/>'],
  fries: ['Fries', '<g fill="#FFC233"><rect x="17" y="10" width="6" height="26" rx="2" transform="rotate(-12 20 23)"/><rect x="26" y="5" width="6" height="28" rx="2"/><rect x="35" y="8" width="6" height="27" rx="2" transform="rotate(8 38 21)"/><rect x="43" y="13" width="5.5" height="22" rx="2" transform="rotate(16 46 24)"/></g><path d="M13 28h38l-5 28H18z" fill="#FF5A36"/><path d="M24 40q8 6 16 0" stroke="#fff" stroke-width="3"/>'],
  cheese: ['Cheese', '<path d="M8 38L48 20l8 18z" fill="#FFE07A"/><path d="M8 38h48v14H8z" fill="#FFC233"/><circle cx="20" cy="45" r="3" fill="#F29E1F"/><circle cx="38" cy="47" r="2.5" fill="#F29E1F"/><circle cx="47" cy="43" r="2" fill="#F29E1F"/><ellipse cx="38" cy="31" rx="3" ry="1.6" fill="#F29E1F"/>'],
  drumstick: ['Drumstick', '<ellipse cx="39" cy="24" rx="17" ry="13" transform="rotate(-35 39 24)" fill="#E08A2C"/><path d="M27 35L15 47" stroke-width="9"/><path d="M27 35L15 47" stroke="#fff" stroke-width="4"/><circle cx="11" cy="46" r="4" fill="#fff"/><circle cx="16" cy="51" r="4" fill="#fff"/><path d="M34 16c4-3 9-2 12 1" stroke="#fff" stroke-width="2.5"/>'],
  chili: ['Chili', '<path d="M44 15c5 0 7 4 5 9-5 16-17 29-35 31 10-8 18-20 22-34 1-4 4-6 8-6z" fill="#FF3B30"/><path d="M45 15c0-4 2-7 6-9" stroke-width="3"/><path d="M38 17c4-4 10-4 13 1-4 2-9 2-13-1z" fill="#2EB872"/><path d="M40 24c-2 8-7 16-13 21" stroke="#fff" stroke-width="2.5"/>'],
  leaf: ['Leaf', '<path d="M11 53C11 27 27 12 54 10c0 27-15 43-43 43z" fill="#2EB872"/><path d="M11 53L41 23M24 40l-1-10M32 32l10 1" stroke-width="2.5"/>'],
  pot: ['Cooking pot', '<path d="M12 28h40v15a11 11 0 0 1-11 11H23a11 11 0 0 1-11-11z" fill="#FF8FB1"/><path d="M7 28h50M5 34h7M52 34h7" stroke-width="3"/><path d="M24 20c0-4 4-4 4-9M33 20c0-4 4-4 4-9" /><path d="M20 38h10" stroke="#fff" stroke-width="3"/>'],
  carrot: ['Carrot', '<path d="M18 52L43 22c5-4 11 2 7 7L22 55c-2 1-5 0-4-3z" fill="#FF8A1F"/><path d="M45 20c0-7 4-11 8-11-1 5-3 8-5 10 4-1 8 0 10 3-4 2-8 1-10-1" fill="#2EB872"/><path d="M28 44l4 3M35 36l4 3" stroke-width="2.5"/>'],
  cake: ['Cake', '<path d="M12 34h40v20H12z" fill="#FFD6E5"/><path d="M12 34c4 5 8 5 10 0 3 5 8 5 10 0 3 5 8 5 10 0 3 5 7 5 10 0" fill="#fff"/><path d="M12 44h40" stroke="#FF5A8A" stroke-width="3"/><path d="M32 34V22" stroke-width="3"/><path d="M32 13c3 3 3 6 0 7-3-1-3-4 0-7z" fill="#FFC233"/>'],
  bread: ['Bread', '<path d="M10 30c0-9 9-14 22-14s22 5 22 14c0 3-2 5-4 6v16H14V36c-2-1-4-3-4-6z" fill="#E9B46A"/><path d="M22 26l4 6M31 24l4 6M40 26l4 6" stroke-width="2.5"/>'],
};
const STICKER_RULES = [
  [/fries|potato|wedges/, 'fries'], [/steak|beef|lamb|mutton/, 'steak'], [/mac|cheese|pasta|lasagn/, 'cheese'],
  [/cake|cookie|dessert|sweet|brownie|pudding/, 'cake'], [/bread|naan|roti|toast|sandwich/, 'bread'],
  [/omurice|omelet|egg/, 'egg'], [/rice|biryani|pulao|curry|dal/, 'rice'], [/chicken|turkey/, 'drumstick'],
  [/spicy|chil+i|hot/, 'chili'], [/salad|vegan|greens|vegetarian/, 'leaf'], [/carrot|soup|stew/, 'carrot'],
];
const stickerKey = r => r.sticker && STICKERS[r.sticker] ? r.sticker
  : (STICKER_RULES.find(([re]) => re.test(`${r.title} ${(r.tags || []).join(' ')}`.toLowerCase())) || [0, 'pot'])[1];
const stickerSVG = (k, cls = '') => `<span class="sticker ${cls}" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="#232737" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${STICKERS[k][1]}</svg></span>`;
