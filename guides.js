'use strict';
// Reference guides. Figures from USDA FSIS / FoodSafety.gov (see sources on each page).
const GUIDES = {
  temps: {
    title: 'Safe internal temperatures',
    blurb: 'USDA minimums, beef doneness, and hold-time tables.',
    html: `
<h2>USDA safe minimums</h2>
<div class="tbl"><table>
<thead><tr><th>Food</th><th>Min. internal temp</th><th>Rest</th></tr></thead>
<tbody>
<tr><td>Poultry: whole, parts, ground; stuffing</td><td><b>165°F (74°C)</b></td><td>–</td></tr>
<tr><td>Beef, veal, lamb, goat: steaks, roasts, chops</td><td><b>145°F (63°C)</b></td><td>3 min</td></tr>
<tr><td>Pork: chops, roasts, tenderloin; raw ham</td><td><b>145°F (63°C)</b></td><td>3 min</td></tr>
<tr><td>Ground beef, pork, lamb, veal; sausage</td><td><b>160°F (71°C)</b></td><td>–</td></tr>
<tr><td>Venison, rabbit</td><td><b>160°F (71°C)</b></td><td>–</td></tr>
<tr><td>Fish</td><td><b>145°F (63°C)</b> or opaque, flakes easily</td><td>–</td></tr>
<tr><td>Shrimp, lobster, crab, scallops</td><td>Pearly white, opaque</td><td>–</td></tr>
<tr><td>Clams, mussels, oysters</td><td>Shells open</td><td>–</td></tr>
<tr><td>Egg dishes</td><td><b>160°F (71°C)</b></td><td>–</td></tr>
<tr><td>Leftovers, casseroles</td><td><b>165°F (74°C)</b></td><td>–</td></tr>
<tr><td>Precooked ham, reheated (USDA-packaged / other)</td><td><b>140°F (60°C)</b> / <b>165°F (74°C)</b></td><td>–</td></tr>
</tbody></table></div>

<h2>Beef and lamb doneness</h2>
<div class="tbl"><table>
<thead><tr><th>Doneness</th><th>Pull at</th><th>Final, after rest</th></tr></thead>
<tbody>
<tr><td>Rare</td><td>115–120°F (46–49°C)</td><td>120–125°F (49–52°C)</td></tr>
<tr><td>Medium-rare</td><td>125–130°F (52–54°C)</td><td>130–135°F (54–57°C)</td></tr>
<tr><td>Medium</td><td>135–140°F (57–60°C)</td><td>140–145°F (60–63°C)</td></tr>
<tr><td>Medium-well</td><td>145–150°F (63–66°C)</td><td>150–155°F (66–68°C)</td></tr>
<tr><td>Well done</td><td>155°F+ (68°C+)</td><td>160°F+ (71°C+)</td></tr>
</tbody></table></div>

<h2>Poultry: hold time equal to 165°F</h2>
<div class="tbl"><table>
<thead><tr><th>Held at</th><th>Chicken breast (~2% fat)</th><th>Chicken thigh (~10% fat)</th></tr></thead>
<tbody>
<tr><td>140°F (60°C)</td><td>25.7 min</td><td>32 min</td></tr>
<tr><td>145°F (63°C)</td><td>8.6 min</td><td>11.3 min</td></tr>
<tr><td>150°F (66°C)</td><td>2.7 min</td><td>3.5 min</td></tr>
<tr><td>155°F (68°C)</td><td>45 sec</td><td>52 sec</td></tr>
<tr><td>160°F (71°C)</td><td>14 sec</td><td>16 sec</td></tr>
<tr><td>165°F (74°C)</td><td>&lt;10 sec</td><td>&lt;10 sec</td></tr>
</tbody></table></div>
<p class="small">7-log Salmonella reduction. Time counts once the centre reaches the temperature.</p>

<h2>Beef and pork: hold time</h2>
<div class="tbl"><table>
<thead><tr><th>Held at</th><th>Min. time</th></tr></thead>
<tbody>
<tr><td>130°F (54.4°C)</td><td>112 min</td></tr>
<tr><td>135°F (57.2°C)</td><td>36 min</td></tr>
<tr><td>140°F (60°C)</td><td>12 min</td></tr>
<tr><td>145°F (62.8°C)</td><td>4 min</td></tr>
<tr><td>150°F (65.6°C)</td><td>67 sec</td></tr>
<tr><td>155°F (68.3°C)</td><td>22 sec</td></tr>
<tr><td>158°F (70°C)</td><td>instant</td></tr>
</tbody></table></div>
<p class="small">6.5-log Salmonella reduction.</p>
<p class="sources">Sources: <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures" target="_blank" rel="noopener">FoodSafety.gov</a>; USDA FSIS poultry time-temperature tables and Appendix A, via <a href="https://riverstonehealth.org/wp-content/uploads/SousVide_LethalityChart_Poultry.pdf" target="_blank" rel="noopener">RiverStone Health (poultry)</a>, <a href="https://riverstonehealth.org/wp-content/uploads/SousVide_LethalityChart_BeefandPork.pdf" target="_blank" rel="noopener">(beef/pork)</a>.</p>`,
  },
  times: {
    title: 'Oven cooking times by cut',
    blurb: 'Roasting times by cut, bone-in and boneless.',
    html: `


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
<p class="small">Done: 165°F (74°C). Thighs, drumsticks, wings: 175–195°F (79–90°C) for best texture.</p>

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
<p class="small">Stuffed: add 15–45 min; stuffing to 165°F (74°C).</p>

<h2>Beef</h2>
<div class="tbl"><table>
<thead><tr><th>Cut</th><th>Size</th><th>Oven</th><th>Time</th></tr></thead>
<tbody>
<tr><td>Rib roast, bone-in</td><td>1.8–2.7 kg</td><td>325°F (163°C)</td><td>51–55 min per kg</td></tr>
<tr><td>Rib roast, boneless</td><td>1.8–2.7 kg</td><td>325°F (163°C)</td><td>62–73 min per kg</td></tr>
<tr><td>Round or rump roast</td><td>1.1–1.8 kg</td><td>325°F (163°C)</td><td>66–77 min per kg</td></tr>
<tr><td>Whole tenderloin</td><td>1.8–2.7 kg</td><td>425°F (220°C)</td><td>45–60 min total</td></tr>
</tbody></table></div>
<p class="small">Doneness temperatures: see <a href="#/guide/temps">safe internal temperatures</a>.</p>

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

<p class="small">* Typical home times; other rows USDA. Check with a thermometer.</p>
<p class="sources">Sources: <a href="https://www.foodsafety.gov/food-safety-charts/meat-poultry-charts" target="_blank" rel="noopener">FoodSafety.gov meat and poultry charts</a>, <a href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures" target="_blank" rel="noopener">safe minimum internal temperatures</a>.</p>`,
  },
};
