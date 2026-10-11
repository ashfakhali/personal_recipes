'use strict';
// Reference guides. Figures from USDA FSIS / FoodSafety.gov (see sources on each page).
const GUIDES = {
  temps: {
    title: 'Safe internal temperatures',
    blurb: 'USDA minimums by meat, plus how time at a lower temperature does the same job.',
    html: `
<p class="lead">Always check with an instant-read thermometer in the thickest part, away from bone. Colour and clear juices are not reliable signs of doneness.</p>

<h2>USDA safe minimums</h2>
<div class="tbl"><table>
<thead><tr><th>Food</th><th>Minimum internal temp</th><th>Rest</th></tr></thead>
<tbody>
<tr><td>Chicken, turkey, duck: whole, parts, ground; stuffing</td><td><b>165°F (74°C)</b></td><td>–</td></tr>
<tr><td>Beef, veal, lamb, goat: steaks, roasts, chops</td><td><b>145°F (63°C)</b></td><td>3 min</td></tr>
<tr><td>Pork: chops, roasts, tenderloin; raw ham</td><td><b>145°F (63°C)</b></td><td>3 min</td></tr>
<tr><td>Ground beef, pork, lamb, veal; sausage</td><td><b>160°F (71°C)</b></td><td>–</td></tr>
<tr><td>Ground chicken or turkey</td><td><b>165°F (74°C)</b></td><td>–</td></tr>
<tr><td>Venison, rabbit</td><td><b>160°F (71°C)</b></td><td>–</td></tr>
<tr><td>Fish (whole or fillet)</td><td><b>145°F (63°C)</b> or opaque and flakes easily</td><td>–</td></tr>
<tr><td>Shrimp, lobster, crab, scallops</td><td>Flesh pearly white and opaque</td><td>–</td></tr>
<tr><td>Clams, mussels, oysters</td><td>Shells open (discard any that don't)</td><td>–</td></tr>
<tr><td>Egg dishes (frittata, quiche)</td><td><b>160°F (71°C)</b></td><td>–</td></tr>
<tr><td>Leftovers and casseroles</td><td><b>165°F (74°C)</b></td><td>–</td></tr>
<tr><td>Precooked ham, reheated (USDA-packaged / other)</td><td><b>140°F (60°C)</b> / <b>165°F (74°C)</b></td><td>–</td></tr>
</tbody></table></div>

<h2>Time × temperature: why 165°F isn't the only answer</h2>
<p>Killing bacteria isn't a switch at one temperature. It's a rate: the hotter the meat, the faster bacteria die. The USDA numbers above are the temperatures where the kill is effectively <b>instant</b>. Hold the meat at a <b>lower</b> temperature for <b>long enough</b> and you get the same safety level. This is how sous-vide chicken can be juicy at 145°F and still safe.</p>
<p>The time starts once the <b>coldest part</b> of the meat has reached the temperature, not when it goes into the oven or water bath.</p>

<h3>Chicken: same safety as 165°F (7-log Salmonella reduction)</h3>
<div class="tbl"><table>
<thead><tr><th>Held at</th><th>Breast (lean, ~2% fat)</th><th>Thigh (fattier, ~10% fat)</th></tr></thead>
<tbody>
<tr><td>140°F (60°C)</td><td>25.7 min</td><td>32 min</td></tr>
<tr><td>145°F (63°C)</td><td>8.6 min</td><td>11.3 min</td></tr>
<tr><td>150°F (66°C)</td><td>2.7 min</td><td>3.5 min</td></tr>
<tr><td>155°F (68°C)</td><td>45 sec</td><td>52 sec</td></tr>
<tr><td>160°F (71°C)</td><td>14 sec</td><td>16 sec</td></tr>
<tr><td>165°F (74°C)</td><td>under 10 sec</td><td>under 10 sec</td></tr>
</tbody></table></div>
<p class="small">Fat protects bacteria a little, so fattier cuts need slightly longer. Turkey needs a bit longer than chicken at each temperature.</p>

<h3>Beef and pork, not poultry (6.5-log Salmonella reduction)</h3>
<div class="tbl"><table>
<thead><tr><th>Held at</th><th>Minimum time</th></tr></thead>
<tbody>
<tr><td>130°F (54.4°C)</td><td>112 min</td></tr>
<tr><td>135°F (57.2°C)</td><td>36 min</td></tr>
<tr><td>140°F (60°C)</td><td>12 min</td></tr>
<tr><td>145°F (62.8°C)</td><td>4 min</td></tr>
<tr><td>150°F (65.6°C)</td><td>67 sec</td></tr>
<tr><td>155°F (68.3°C)</td><td>22 sec</td></tr>
<tr><td>158°F (70°C)</td><td>instant</td></tr>
</tbody></table></div>

<h3>Using this in practice</h3>
<ul>
<li><b>Sous vide</b> is where the tables are most useful: the water holds a precise temperature, so you can cook chicken breast at 145°F and keep it there 10+ minutes past the time the centre comes up to temperature.</li>
<li><b>In an oven or pan</b> the temperature is always climbing, so you can't reliably "hold". Stick to the USDA minimums, and remember the meat keeps rising 3–10°F (2–5°C) while it rests (more for big roasts).</li>
<li><b>Whole steaks and roasts</b> are commonly served below 145°F because contamination sits mostly on the surface, which searing sterilises. That reasoning does <b>not</b> apply to ground, mechanically tenderised, rolled or stuffed meat, where surface bacteria end up inside.</li>
<li>If you're cooking for someone pregnant, elderly, very young or immunocompromised, use the USDA minimums.</li>
<li>Calibrate your thermometer now and then: in a glass of ice water it should read 32°F (0°C).</li>
</ul>
<p class="sources">Sources: <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures" target="_blank" rel="noopener">FoodSafety.gov safe minimum temperatures</a>; USDA FSIS <i>Time-Temperature Tables for Cooking Ready-to-Eat Poultry Products</i> and <i>Appendix A: Compliance Guidelines for Meeting Lethality Performance Standards</i>, as reproduced by <a href="https://riverstonehealth.org/wp-content/uploads/SousVide_LethalityChart_Poultry.pdf" target="_blank" rel="noopener">RiverStone Health (poultry)</a> and <a href="https://riverstonehealth.org/wp-content/uploads/SousVide_LethalityChart_BeefandPork.pdf" target="_blank" rel="noopener">RiverStone Health (beef and pork)</a>.</p>`,
  },
  times: {
    title: 'Oven cooking times by cut',
    blurb: 'Roasting times for chicken, turkey, beef, pork, lamb and fish, bone-in vs boneless.',
    html: `
<p class="lead">Times are starting points. Thickness, starting temperature and your oven all change them, so <b>cook to temperature, not time</b>. Check 10–15 minutes before the shortest time. Safe temperatures are on the <a href="#/guide/temps">safe temperatures</a> page.</p>

<h2>Rules of thumb</h2>
<ul>
<li><b>Thickness matters more than weight.</b> A thin 250 g breast cooks faster than a thick 200 g one.</li>
<li><b>Bone-in takes longer</b> than boneless of the same size (often 25–50% longer), and meat right next to the bone cooks last. Don't let the probe touch bone.</li>
<li><b>Start from fridge-cold</b> for the times below; meat that's sat out 30 minutes cooks a little faster.</li>
<li><b>Carryover:</b> pull meat 3–5°F (2–3°C) early for steaks and chicken parts, 5–10°F (3–5°C) early for large roasts, then rest. Rest steaks 5 minutes, roasts 15–20.</li>
<li><b>Convection/fan ovens:</b> lower the temperature by about 25°F (15°C), or check 25% sooner.</li>
<li><b>Stuffed birds</b> take longer, and the stuffing itself must reach 165°F (74°C).</li>
</ul>

<h2>Chicken</h2>
<div class="tbl"><table>
<thead><tr><th>Cut</th><th>Size</th><th>Oven</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Whole chicken</td><td>1.4–1.8 kg</td><td>350°F (175°C)</td><td>1¼–1½ h</td></tr>
<tr><td>Whole chicken</td><td>2.3–3.2 kg</td><td>350°F (175°C)</td><td>2–2¼ h</td></tr>
<tr><td>Whole chicken, hotter roast*</td><td>1.5–2 kg</td><td>425°F (220°C)</td><td>60–80 min</td></tr>
<tr><td>Breast, bone-in</td><td>170–230 g each</td><td>350°F (175°C)</td><td>30–40 min</td></tr>
<tr><td>Breast, boneless</td><td>~115 g each</td><td>350°F (175°C)</td><td>20–30 min</td></tr>
<tr><td>Breast, boneless*</td><td>170–230 g each</td><td>425°F (220°C)</td><td>18–24 min</td></tr>
<tr><td>Thighs or drumsticks, bone-in*</td><td>150–200 g each</td><td>425°F (220°C)</td><td>35–45 min</td></tr>
<tr><td>Thighs, boneless*</td><td>100–150 g each</td><td>425°F (220°C)</td><td>18–25 min</td></tr>
<tr><td>Wings*</td><td>–</td><td>425°F (220°C)</td><td>40–50 min, flip halfway</td></tr>
<tr><td>Cornish hen</td><td>500–700 g</td><td>350°F (175°C)</td><td>50–60 min</td></tr>
</tbody></table></div>
<p class="small">Safe at 165°F (74°C). Thighs, drumsticks and wings are much better at 175–195°F (79–90°C): the connective tissue softens and they stay juicy.</p>

<h2>Turkey <span class="sub">unstuffed, 325°F (163°C)</span></h2>
<div class="tbl"><table>
<thead><tr><th>Cut</th><th>Size</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Breast, bone-in</td><td>1.8–2.7 kg</td><td>1½–2¼ h</td></tr>
<tr><td>Breast, bone-in</td><td>2.7–3.6 kg</td><td>2¼–3¼ h</td></tr>
<tr><td>Whole turkey</td><td>3.6–5.4 kg</td><td>2¾–3 h</td></tr>
<tr><td>Whole turkey</td><td>5.4–6.4 kg</td><td>3–3¾ h</td></tr>
<tr><td>Whole turkey</td><td>6.4–8.2 kg</td><td>3¾–4¼ h</td></tr>
<tr><td>Whole turkey</td><td>8.2–9.1 kg</td><td>4¼–4½ h</td></tr>
<tr><td>Whole turkey</td><td>9.1–10.9 kg</td><td>4½–5 h</td></tr>
</tbody></table></div>
<p class="small">Stuffed: add roughly 15–45 minutes, and check the stuffing reaches 165°F (74°C).</p>

<h2>Beef</h2>
<div class="tbl"><table>
<thead><tr><th>Cut</th><th>Size</th><th>Oven</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Rib roast, bone-in</td><td>1.8–2.7 kg</td><td>325°F (163°C)</td><td>51–55 min per kg</td></tr>
<tr><td>Rib roast, boneless</td><td>1.8–2.7 kg</td><td>325°F (163°C)</td><td>62–73 min per kg</td></tr>
<tr><td>Round or rump roast</td><td>1.1–1.8 kg</td><td>325°F (163°C)</td><td>66–77 min per kg</td></tr>
<tr><td>Whole tenderloin</td><td>1.8–2.7 kg</td><td>425°F (220°C)</td><td>45–60 min total</td></tr>
</tbody></table></div>
<p><b>Doneness for beef and lamb</b> (pull temp → after rest):</p>
<div class="tbl"><table>
<thead><tr><th>Doneness</th><th>Pull at</th><th>After resting</th></tr></thead>
<tbody>
<tr><td>Rare</td><td>115–120°F (46–49°C)</td><td>120–125°F (49–52°C)</td></tr>
<tr><td>Medium-rare</td><td>125–130°F (52–54°C)</td><td>130–135°F (54–57°C)</td></tr>
<tr><td>Medium</td><td>135–140°F (57–60°C)</td><td>140–145°F (60–63°C)</td></tr>
<tr><td>Medium-well</td><td>145–150°F (63–66°C)</td><td>150–155°F (66–68°C)</td></tr>
<tr><td>Well done</td><td>155°F+ (68°C+)</td><td>160°F+ (71°C+)</td></tr>
</tbody></table></div>
<p class="small">USDA's minimum for whole cuts is 145°F (63°C) plus a 3-minute rest; rarer is a common choice for whole steaks and roasts. See the safe temperatures page.</p>

<h2>Pork <span class="sub">roasts 145°F (63°C) + 3 min rest</span></h2>
<div class="tbl"><table>
<thead><tr><th>Cut</th><th>Size</th><th>Oven</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Loin roast, bone-in or boneless</td><td>0.9–2.3 kg</td><td>350°F (175°C)</td><td>about 44 min per kg</td></tr>
<tr><td>Tenderloin</td><td>225–680 g</td><td>425–450°F (220–230°C)</td><td>20–27 min total</td></tr>
<tr><td>Shoulder / Boston butt (sliceable)</td><td>1.4–2.7 kg</td><td>350°F (175°C)</td><td>about 100 min per kg</td></tr>
<tr><td>Shoulder for pulled pork</td><td>any</td><td>275–300°F (135–150°C)</td><td>until 195–205°F (90–96°C), often 1½–2 h per kg</td></tr>
<tr><td>Ribs</td><td>0.9–1.8 kg</td><td>350°F (175°C)</td><td>1½–2 h, until fork-tender</td></tr>
</tbody></table></div>

<h2>Lamb <span class="sub">325°F (163°C)</span></h2>
<div class="tbl"><table>
<thead><tr><th>Cut</th><th>Size</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Leg, bone-in</td><td>2.3–3.2 kg</td><td>44–55 min per kg</td></tr>
<tr><td>Leg, boneless, rolled</td><td>1.8–3.2 kg</td><td>55–66 min per kg</td></tr>
<tr><td>Shoulder roast</td><td>1.4–1.8 kg</td><td>66–77 min per kg</td></tr>
</tbody></table></div>

<h2>Fish <span class="sub">145°F (63°C), or opaque and flaky</span></h2>
<div class="tbl"><table>
<thead><tr><th>Cut</th><th>Size</th><th>Oven</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Fillets (salmon, cod, etc.)*</td><td>per 2.5 cm thickness</td><td>400°F (200°C)</td><td>about 10–12 min</td></tr>
<tr><td>Whole fish*</td><td>about 1 kg</td><td>425°F (220°C)</td><td>25–30 min</td></tr>
</tbody></table></div>

<p class="small">* Typical home-cooking times; all other rows are from the USDA/FoodSafety.gov roasting charts, converted to metric (per-kg times = per-lb × 2.2).</p>
<p class="sources">Sources: <a href="https://www.foodsafety.gov/food-safety-charts/meat-poultry-charts" target="_blank" rel="noopener">FoodSafety.gov meat and poultry charts</a>, <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures" target="_blank" rel="noopener">safe minimum internal temperatures</a>.</p>`,
  },
};
