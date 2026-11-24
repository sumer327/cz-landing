/* Cellular Zone Instant Quote widget
 * Embed:  <div id="cz-quote"></div>
 *         <script src=".../quote.js" data-endpoint="https://<project>.supabase.co/functions/v1/web-lead" defer><\/script>
 * Options on the div: data-store="PT|DZ|BV" (preselect store), data-device="iphone|samsung|pixel|ipad|watch|console|computer|other"
 * URL params do the same: ?store=PT&device=iphone
 * With neither, the page URL decides: /ipad-repair/ opens on the iPad list, /game-console-repair/ on consoles, /bulverde/ preselects Bulverde.
 * Prices: live from the published REPAIR PRICES - CZ sheet; falls back to the copy baked into this file.
 * Leads: POST to data-endpoint (the POS web-lead function). No endpoint = demo mode (nothing is sent).
 */
(function () {
  'use strict';
  const SCRIPT = document.currentScript;
  const CFG = Object.assign({
    endpoint: (SCRIPT && SCRIPT.dataset.endpoint) || '',
    warranty: '6-month warranty',
  }, window.CZ_QUOTE_CONFIG || {});

  const FALLBACK = {"asof":"Nov 9, 2026 12:19 AM","cats":{"iphone":{"name":"iPhone","cols":["GOOD Glass Only","BETTER Glass Only","BEST Glass Only","GOOD Aftermarket LCD","BETTER Premium OLED","BEST Genuine Apple","Battery","Battery (Genuine Apple)","Back Glass","Housing / Frame","Rear Camera","Camera Lens","Front Camera","Charging Port","Port Cleaning","Ear Speaker","Ear Speaker Mesh","Other Small Parts"],"models":[{"n":"iPhone 6","g":"","p":["$79.99",null,null,"$79.99",null,null,"$59.99",null,null,"$79.00","$59.99","$49.00","$49.00","$59.99","$39.00",null,"$49.00","$49.00"]},{"n":"iPhone 6 Plus","g":"","p":["$79.99",null,null,"$79.99",null,null,"$59.99",null,null,"$89.00","$59.99","$49.00","$49.00","$59.99","$39.00",null,"$49.00","$49.00"]},{"n":"iPhone 6s","g":"","p":["$79.99",null,null,"$79.99",null,null,"$59.99",null,null,"$89.00","$59.99","$49.00","$49.00","$59.99","$39.00",null,"$49.00","$49.00"]},{"n":"iPhone 6s Plus","g":"","p":["$99.99",null,null,"$99.99",null,null,"$59.99",null,null,"$99.00","$59.99","$49.00","$49.00","$59.99","$39.00",null,"$49.00","$49.00"]},{"n":"iPhone 7","g":"","p":["$79.99",null,null,"$79.99",null,null,"$59.99",null,null,"$99.00","$69.99","$59.00","$69.00","$59.99","$39.00",null,"$59.00","$69.00"]},{"n":"iPhone 7 Plus","g":"","p":["$89.99",null,null,"$89.99",null,null,"$59.99",null,null,"$119.00","$89.99","$59.00","$69.00","$69.99","$39.00",null,"$59.00","$69.00"]},{"n":"iPhone 8","g":"","p":["$79.99",null,null,"$79.99",null,null,"$59.99",null,"$79.99","$99.99","$69.99","$59.00","$69.00","$69.99","$39.00",null,"$59.00","$69.00"]},{"n":"iPhone 8 Plus","g":"","p":["$89.99",null,null,"$89.99",null,null,"$59.99",null,"$79.99","$99.99","$79.99","$59.00","$69.00","$69.99","$39.00",null,"$59.00","$69.00"]},{"n":"iPhone SE 2020","g":"","p":["$79.99",null,null,"$79.99",null,null,"$59.99",null,"$99.99","$99.99","$89.99","$59.00","$69.00","$89.99","$39.00",null,"$59.00","$69.00"]},{"n":"iPhone X","g":"","p":["$79.99","$139.99",null,"$79.99","$139.99",null,"$69.99",null,"$79.99","$99.99","$69.99","$59.00","$79.00","$69.99","$39.00","$129.00","$59.00","$79.00"]},{"n":"iPhone XR","g":"","p":["$79.99",null,null,"$79.99",null,null,"$69.99",null,"$79.99","$99.99","$79.99","$59.00","$79.00","$69.99","$39.00","$129.00","$69.00","$79.00"]},{"n":"iPhone XS","g":"","p":["$79.99","$139.99",null,"$79.99","$139.99",null,"$69.99",null,"$79.99","$119.99","$89.99","$59.00","$79.00","$79.99","$39.00","$129.00","$69.00","$79.00"]},{"n":"iPhone XS Max","g":"","p":["$79.99","$129.99",null,"$79.99","$129.99",null,"$69.99",null,"$79.99","$119.99","$109.99","$59.00","$79.00","$79.99","$39.00","$129.00","$69.00","$79.00"]},{"n":"iPhone 11","g":"","p":["$99.99",null,null,"$99.99",null,null,"$89.99",null,"$89.99","$119.99","$79.99","$69.00","$79.00","$79.99","$39.00","$129.00","$69.00","$79.00"]},{"n":"iPhone 11 Pro","g":"","p":["$99.99","$179.99",null,"$99.99","$179.99",null,"$89.99",null,"$89.99","$129.99","$109.99","$69.00","$99.00","$99.99","$39.00","$149.00","$69.00","$99.00"]},{"n":"iPhone 11 Pro Max","g":"","p":["$99.99","$159.99",null,"$99.99","$159.99",null,"$89.99",null,"$89.99","$129.99","$109.99","$69.00","$99.00","$99.99","$39.00","$149.00","$69.00","$99.00"]},{"n":"iPhone 12 Mini","g":"","p":["$99.99","$189.99","$329.99","$109.99","$199.99","$339.99","$89.99",null,"$89.99","$119.99","$109.99","$69.00","$99.00","$79.99","$39.00","$149.00","$79.00","$99.00"]},{"n":"iPhone 12 / 12 Pro","g":"","p":["$99.99","$169.99","$379.99","$99.99","$169.99","$379.99","$99.99",null,"$89.99","$119.99 / $129.99 Pro","$99.99 / $149.99 Pro","$69.00","$99.00","$79.99","$39.00","$149.00 / $159.00 Pro","$79.00","$99.00"]},{"n":"iPhone 12 Pro Max","g":"","p":["$99.99","$159.99","$419.99","$109.99","$169.99","$429.99","$99.99",null,"$89.99","$139.99","$139.99","$69.00","$129.00","$89.99","$39.00","$169.00","$79.00","$99.00"]},{"n":"iPhone SE 2022","g":"","p":["$79.99",null,null,"$79.99",null,null,"$69.99",null,"$99.99","$99.99","$89.99","$59.00","$69.00","$89.99","$39.00",null,"$59.00","$69.00"]},{"n":"iPhone 13 Mini","g":"","p":["$99.99","$199.99","$329.99","$109.99","$209.99","$339.99","$89.99",null,"$89.99","$129.99","$99.99","$69.00","$119.00","$89.99","$39.00",null,"$79.00","$99.00"]},{"n":"iPhone 13","g":"","p":["$99.99","$159.99","$369.99","$109.99","$169.99","$379.99","$99.99",null,"$89.99","$119.99","$99.99","$69.00","$119.00","$89.99","$39.00",null,"$79.00","$99.00"]},{"n":"iPhone 13 Pro","g":"","p":["$99.99","$159.99","$369.99","$109.99","$169.99","$379.99","$99.99",null,"$89.99","$169.99","$149.99","$69.00","$119.00","$89.99","$39.00",null,"$79.00","$99.00"]},{"n":"iPhone 13 Pro Max","g":"","p":["$99.99","$159.99","$419.99","$109.99","$169.99","$429.99","$99.99",null,"$99.99","$159.99","$149.99","$69.00","$129.00","$99.99","$39.00",null,"$79.00","$99.00"]},{"n":"iPhone 14","g":"","p":["$99.99","$169.99","$369.99","$109.99","$179.99","$379.99","$99.99",null,"$99.00","$99.99","$129.99","$69.00","$139.00","$99.99","$39.00",null,"$99.00","$99.00"]},{"n":"iPhone 14 Plus","g":"","p":["$99.99","$169.99","$419.99","$109.99","$179.99","$429.99","$99.99",null,"$99.00","$119.00","$129.99","$69.00","$169.00","$99.99","$39.00",null,"$99.00","$99.00"]},{"n":"iPhone 14 Pro","g":"","p":["$89.99","$159.99","$409.99","$109.99","$179.99","$429.99","$99.99",null,"$99.99","$179.99","$139.99","$79.00","$199.00","$99.99","$39.00",null,"$99.00","$99.00"]},{"n":"iPhone 14 Pro Max","g":"","p":["$89.99","$159.99","$459.99","$109.99","$179.99","$479.99","$109.99",null,"$99.99","$159.99","$139.99","$79.00","$199.00","$109.99","$39.00",null,"$99.00","$99.00"]},{"n":"iPhone 15","g":"","p":["$99.99","$179.99","$369.99","$109.99","$189.99","$379.99","$99.99",null,"$99.99","$99.99 (frame only)","$119.99","$79.00","$199.00","$109.99","$39.00",null,null,"$99.00"]},{"n":"iPhone 15 Plus","g":"","p":["$99.99","$179.99","$419.99","$109.99","$189.99","$429.99","$109.99",null,"$99.99","$119.99 (frame only)","$119.99","$79.00","$199.00","$119.99","$39.00",null,null,"$99.00"]},{"n":"iPhone 15 Pro","g":"","p":["$89.99","$169.99","$409.99","$109.99","$189.99","$429.99","$109.99",null,"$99.99","$159.00 (frame only)","$149.99","$79.00","$249.00","$109.99","$39.00",null,null,"$119.00"]},{"n":"iPhone 15 Pro Max","g":"","p":["$99.99","$169.99","$469.99","$109.99","$179.99","$479.99","$109.99",null,"$99.99","$159.00 (frame only)","$149.99","$79.00","$249.00","$119.99","$39.00",null,null,"$119.00"]},{"n":"iPhone 16","g":"","p":["$99.99","$169.99","$389.99","$109.99","$179.99","$399.99","$99.99","$139.00","$99.99","$159.00 (frame only)","$139.99","$79.00","$299.00","$129.99",null,null,null,"$119.00"]},{"n":"iPhone 16 Plus","g":"","p":["$99.99","$179.99","$439.99","$109.99","$189.99","$449.99","$109.99","$139.00","$99.99","$139.00 (frame only)","$149.99","$79.00","$299.00","$129.99",null,null,null,"$119.00"]},{"n":"iPhone 16 Pro","g":"","p":["$119.99","$189.99","$439.99","$129.99","$199.99","$449.99","$99.99","$149.00","$99.99","$159.00 (frame only)","$149.99","$79.00","$299.00","$129.99",null,null,null,"$129.00"]},{"n":"iPhone 16 Pro Max","g":"","p":["$129.99","$209.99","$479.99","$139.99","$219.99","$489.99","$119.99","$149.00","$99.99","$189.00 (frame only)","$149.99","$79.00","$299.00","$129.99",null,null,null,"$129.00"]},{"n":"iPhone 16e","g":"","p":["$99.99","$169.99","$339.99","$109.99","$179.99","$349.99","$89.99","$139.00","$99.99",null,"$139.99","$79.00","$299.00","$129.99",null,null,null,"$129.00"]},{"n":"iPhone 17","g":"","p":["$119.99","$189.99","$459.99","$129.99","$199.99","$469.99",null,null,"$149.99",null,"$169.99","$79.00",null,"$129.99",null,null,null,"$129.00"]},{"n":"iPhone 17 Pro","g":"","p":["$129.99","$209.99","$459.99","$139.99","$219.99","$469.99",null,null,"$149.99",null,"$149.99","$79.00",null,"$129.99",null,null,null,"$149.00"]},{"n":"iPhone 17 Pro Max","g":"","p":["$139.99","$219.99","$509.99","$149.99","$229.99","$519.99",null,"$159.00","$149.99",null,"$149.99","$79.00",null,"$149.99",null,null,null,"$149.00"]},{"n":"iPhone 17e","g":"","p":["$99.99","$169.99","$359.99","$109.99","$179.99","$369.99","$89.99","$139.00","$119.00",null,"$139.99","$79.00","$299.00","$129.99",null,null,null,"$129.00"]},{"n":"iPhone Air","g":"","p":["$159.99","$159.99","$469.99",null,"$159.99","$469.99",null,null,null,null,"$189.99","$79.00",null,"$149.99",null,null,null,"$129.00"]}],"notes":["Labor only (customer brings part): phones $80 · tablets $80."]},"samsung":{"name":"Samsung","cols":["Glass Only (display works)","Glass Only + Burn-In","Screen Replacement","Battery","Charging Port","Rear Camera","Front Cam / Small Parts","Back Glass / Camera Lens"],"models":[{"n":"Galaxy S3","g":"Galaxy S","p":["$59.00",null,"$79.00","$29.00","$49.00",null,"$49.00",null]},{"n":"Galaxy S4","g":"Galaxy S","p":["$79.00",null,"$89.00","$29.00","$49.00",null,"$49.00",null]},{"n":"Galaxy S4 Active","g":"Galaxy S","p":[null,null,"$129.00","$29.00","$49.00",null,"$49.00",null]},{"n":"Galaxy S5","g":"Galaxy S","p":["$89.00",null,"$119.00","$39.00","$69.00",null,"$69.00",null]},{"n":"Galaxy S5 Active","g":"Galaxy S","p":[null,null,"$139.00","$39.00","$69.00",null,"$69.00",null]},{"n":"Galaxy S6","g":"Galaxy S","p":["$119.00",null,"$159.00","$69.00","$79.00",null,"$79.00","$59.00"]},{"n":"Galaxy S6 Edge","g":"Galaxy S","p":[null,null,"$149.00","$69.00","$79.00",null,"$79.00",null]},{"n":"Galaxy S6 Active","g":"Galaxy S","p":[null,null,"$119.00","$129.00","$129.00",null,"$129.00",null]},{"n":"Galaxy S6 Edge+","g":"Galaxy S","p":[null,null,"$179.00","$69.00","$99.00",null,"$99.00","$59.00"]},{"n":"Galaxy S7","g":"Galaxy S","p":["$129.00",null,"$159.00","$59.00","$79.00",null,"$79.00","$59.00"]},{"n":"Galaxy S7 Edge","g":"Galaxy S","p":[null,null,"$169.00","$69.00","$159.00",null,"$159.00","$59.00"]},{"n":"Galaxy S7 Active","g":"Galaxy S","p":[null,null,"Market Price","$159.00","$159.00",null,"$159.00","$59.00"]},{"n":"Galaxy S8","g":"Galaxy S","p":["$149.99","$154.99","$159.99","$69.99","$59.99","$59.99","$79.00","$29.00"]},{"n":"Galaxy S8+","g":"Galaxy S","p":["$169.99","$174.99","$179.99","$69.99","$59.99","$59.99","$79.00","$29.00"]},{"n":"Galaxy S9","g":"Galaxy S","p":["$149.99","$154.99","$159.99","$69.99","$59.99","$59.99","$79.00","$29.00"]},{"n":"Galaxy S9+","g":"Galaxy S","p":["$149.99","$154.99","$159.99","$69.99","$59.99","$59.99","$79.00","$29.00"]},{"n":"Galaxy S10","g":"Galaxy S","p":["$169.99","$179.99","$189.99","$79.99","$69.99","$69.99","$99.00","$49.00"]},{"n":"Galaxy S10+","g":"Galaxy S","p":["$209.99","$224.99","$239.99","$79.99","$69.99","$69.99","$99.00","$49.00"]},{"n":"Galaxy S10e","g":"Galaxy S","p":["$149.00","$174.99","$199.00","$59.00","$99.00",null,"$99.00","$79.00"]},{"n":"Galaxy S20","g":"Galaxy S","p":["$199.99","$209.99","$219.99","$79.99","$69.99","$79.99","$79.00","$59.00"]},{"n":"Galaxy S20+","g":"Galaxy S","p":["$209.99","$219.99","$229.99","$79.99","$69.99","$79.99","$79.00","$59.00"]},{"n":"Galaxy S20 Ultra","g":"Galaxy S","p":["$239.99","$249.99","$259.99","$79.99","$69.99","$109.99","$79.00","$59.00"]},{"n":"Galaxy S20 FE","g":"Galaxy S","p":["$169.00","$179.99","$189.00","$79.99","$79.99","$79.99","$79.00",null]},{"n":"Galaxy S21","g":"Galaxy S","p":["$179.99","$189.99","$199.99","$79.99","$79.99","$89.99","$89.00","$89.00"]},{"n":"Galaxy S21+","g":"Galaxy S","p":["$189.99","$199.99","$209.99","$89.99","$79.99","$89.99","$89.00","$89.00"]},{"n":"Galaxy S21 Ultra","g":"Galaxy S","p":["$219.99","$234.99","$249.99","$79.99","$79.99","$99.99","$89.00","$89.00"]},{"n":"Galaxy S21 FE","g":"Galaxy S","p":["$199.00","$209.99","$219.00","$79.99","$89.99","$89.99","$89.00","$89.00"]},{"n":"Galaxy S22","g":"Galaxy S","p":["$209.99","$224.99","$239.99","$79.99","$89.99","$89.99","$89.00","$89.00"]},{"n":"Galaxy S22+","g":"Galaxy S","p":["$199.99","$209.99","$219.99","$79.99","$89.99","$89.99","$89.00","$89.00"]},{"n":"Galaxy S22 Ultra","g":"Galaxy S","p":["$269.99","$289.99","$309.99","$89.99","$89.99","$109.99","$89.00","$89.00"]},{"n":"Galaxy S23","g":"Galaxy S","p":["$199.99","$214.99","$229.99","$79.99","$99.99","$99.99","$99.00","$99.00"]},{"n":"Galaxy S23+","g":"Galaxy S","p":["$189.99","$199.99","$209.99","$89.99","$99.99","$99.99","$99.00","$99.00"]},{"n":"Galaxy S23 Ultra","g":"Galaxy S","p":["$269.99","$289.99","$309.99","$89.99","$89.99","$129.99","$99.00","$99.00"]},{"n":"Galaxy S23 FE","g":"Galaxy S","p":[null,null,null,"$79.99","$99.99","$99.99",null,null]},{"n":"Galaxy S24","g":"Galaxy S","p":["$189.99","$199.99","$209.99","$79.99","$99.99","$99.99","$99.00","$99.00"]},{"n":"Galaxy S24+","g":"Galaxy S","p":["$199.99","$214.99","$229.99","$89.99","$99.99","$109.99","$99.00","$99.00"]},{"n":"Galaxy S24 Ultra","g":"Galaxy S","p":["$239.99","$259.99","$279.99","$89.99","$99.99","$149.99","$99.00","$99.00"]},{"n":"Galaxy S25","g":"Galaxy S","p":["$199.99","$209.99","$219.99","$89.99","$109.99",null,"$99.00","$99.00"]},{"n":"Galaxy S25+","g":"Galaxy S","p":["$199.99","$219.99","$239.99","$89.99","$109.99","$119.99","$99.00","$99.00"]},{"n":"Galaxy S25 Ultra","g":"Galaxy S","p":["$259.99","$284.99","$309.99","$89.99","$109.99","$159.99","$119.00","$99.00"]},{"n":"Galaxy S26","g":"Galaxy S","p":["$219.99","$229.99","$239.99",null,"$109.99","$109.99",null,null]},{"n":"Galaxy S26+","g":"Galaxy S","p":["$259.99","$279.99","$299.99",null,"$109.99","$119.99",null,null]},{"n":"Galaxy S26 Ultra","g":"Galaxy S","p":["$299.99","$319.99","$339.99",null,"$109.99","$149.99",null,null]},{"n":"Galaxy Note 3","g":"Galaxy Note","p":["$99.00",null,"$99.00","$39.00","$59.00",null,"$59.00",null]},{"n":"Galaxy Note 4","g":"Galaxy Note","p":["$99.00",null,"$129.00","$39.00","$69.00",null,"$69.00",null]},{"n":"Galaxy Note Edge","g":"Galaxy Note","p":[null,null,"$199.00","$39.00","$99.00",null,"$99.00",null]},{"n":"Galaxy Note 5","g":"Galaxy Note","p":["$99.00",null,"$199.00","$69.00","$79.00",null,"$79.00","$59.00"]},{"n":"Galaxy Note 8","g":"Galaxy Note","p":["$169.99","$174.99","$179.99","$69.99","$59.99","$59.99","$79.00","$69.00"]},{"n":"Galaxy Note 9","g":"Galaxy Note","p":["$189.99","$199.99","$209.99","$69.99","$59.99","$59.99","$79.00","$69.00"]},{"n":"Galaxy Note 10","g":"Galaxy Note","p":["$189.99","$199.99","$209.99","$79.99","$69.99","$79.99","$79.00","$79.00"]},{"n":"Galaxy Note 10+","g":"Galaxy Note","p":["$199.99","$214.99","$229.99","$79.99","$69.99","$69.99","$79.00","$79.00"]},{"n":"Galaxy Note 20","g":"Galaxy Note","p":["$179.99","$189.99","$199.99","$79.99","$69.99","$89.99","$89.00","$99.00"]},{"n":"Galaxy Note 20 Ultra","g":"Galaxy Note","p":["$249.99","$269.99","$289.99","$89.99","$69.99","$99.99","$89.00","$99.00"]},{"n":"Galaxy J7","g":"Galaxy A / J","p":[null,null,"$89.00","$49.00","$49.00",null,"$49.00",null]},{"n":"Galaxy A03s","g":"Galaxy A / J","p":[null,null,"$99.00",null,null,null,null,null]},{"n":"Galaxy A10 (A105)","g":"Galaxy A / J","p":[null,null,"$89.00",null,"$79.00",null,"$79.00",null]},{"n":"Galaxy A10e / A20e","g":"Galaxy A / J","p":[null,null,"$99.00",null,"$89.00",null,"$89.00",null]},{"n":"Galaxy A11 (A115)","g":"Galaxy A / J","p":[null,null,"$89.00",null,"$89.00",null,"$89.00",null]},{"n":"Galaxy A12","g":"Galaxy A / J","p":[null,null,"$99.00",null,null,null,null,null]},{"n":"Galaxy A13","g":"Galaxy A / J","p":[null,null,"$99.00",null,null,null,null,null]},{"n":"Galaxy A14","g":"Galaxy A / J","p":[null,null,"$99.00",null,null,null,null,null]},{"n":"Galaxy A15","g":"Galaxy A / J","p":[null,null,"$149.00",null,null,null,null,null]},{"n":"Galaxy A16","g":"Galaxy A / J","p":[null,null,"$149.00",null,null,null,null,null]},{"n":"Galaxy A17","g":"Galaxy A / J","p":[null,null,"$149.00",null,null,null,null,null]},{"n":"Galaxy A20 (A205)","g":"Galaxy A / J","p":[null,null,"$119.00",null,"$89.00",null,"$89.00",null]},{"n":"Galaxy A32 5G (A326)","g":"Galaxy A / J","p":[null,null,"$99.00",null,"$89.00",null,"$89.00",null]},{"n":"Galaxy A50 (A505)","g":"Galaxy A / J","p":[null,null,"$139.00",null,"$89.00",null,"$89.00",null]},{"n":"Galaxy A51 (A515)","g":"Galaxy A / J","p":[null,null,"$159.00",null,"$89.00",null,"$89.00",null]},{"n":"Galaxy A54 (A546)","g":"Galaxy A / J","p":[null,null,"$159.00",null,"$89.00",null,"$89.00",null]}],"notes":["Labor only (customer brings part): phones $80 · tablets $80 · computers $100. Data backup $75 · Software restore $39."]},"pixel":{"name":"Pixel","cols":["Screen (Standard)","Screen (Genuine OEM)","Battery","Charging Port","Rear Camera","Front Camera","Back Glass / Back Housing","Ear / Loud Speaker"],"models":[{"n":"Pixel","g":"Google Pixel","p":["$109.99",null,"$89.99","$79.99",null,null,"$79.99","$79.99"]},{"n":"Pixel XL","g":"Google Pixel","p":["$99.99",null,null,"$79.99",null,null,"$79.99",null]},{"n":"Pixel 2","g":"Google Pixel","p":["$119.99","$149.99","$79.99","$89.99","$79.99","$79.99","$79.99","$79.99"]},{"n":"Pixel 2 XL","g":"Google Pixel","p":[null,null,"$79.99","$79.99","$79.99","$79.99","$79.99","$79.99"]},{"n":"Pixel 3","g":"Google Pixel","p":["$109.99",null,"$79.99","$79.99","$79.99","$79.99","$79.99","$79.99"]},{"n":"Pixel 3 XL","g":"Google Pixel","p":["$119.99",null,"$79.99","$79.99","$79.99","$79.99","$79.99","$79.99"]},{"n":"Pixel 4","g":"Google Pixel","p":["$119.99","$139.99","$79.99","$79.99","$79.99","$89.99","$79.99","$79.99"]},{"n":"Pixel 4 XL","g":"Google Pixel","p":["$119.99","$139.99","$89.99","$79.99","$79.99","$79.99","$79.99","$79.99"]},{"n":"Pixel 5","g":"Google Pixel","p":["$199.99","$269.99","$89.99","$79.99","$79.99","$79.99","$149.99","$79.99"]},{"n":"Pixel 6","g":"Google Pixel","p":["$199.99","$229.99","$89.99","$89.99","$89.99","$89.99","$79.99","$79.99"]},{"n":"Pixel 6 Pro","g":"Google Pixel","p":["$249.99","$379.99","$89.99","$79.99","$89.99","$89.99","$79.99","$79.99"]},{"n":"Pixel 7","g":"Google Pixel","p":["$209.99",null,"$89.99","$79.99","$89.99","$89.99","$89.99","$79.99"]},{"n":"Pixel 7 Pro","g":"Google Pixel","p":["$269.99","$419.99","$89.99","$79.99","$99.99","$89.99","$79.99","$79.99"]},{"n":"Pixel 8","g":"Google Pixel","p":["$209.99","$269.99","$89.99","$79.99","$89.99","$89.99","$79.99","$79.99"]},{"n":"Pixel 8 Pro","g":"Google Pixel","p":["$269.99","$429.99","$89.99","$79.99","$119.99","$89.99",null,"$79.99"]},{"n":"Pixel 9","g":"Google Pixel","p":["$229.99","$269.99","$89.99","$99.99","$109.99","$99.99","$109.99","$89.99"]},{"n":"Pixel 9 Pro","g":"Google Pixel","p":["$199.99","$279.99","$89.99","$99.99","$129.99","$149.99","$189.99","$89.99"]},{"n":"Pixel 9 Pro XL","g":"Google Pixel","p":["$269.99","$349.99","$89.99","$99.99","$349.99","$149.99","$109.99","$89.99"]},{"n":"Pixel 10","g":"Google Pixel","p":["$209.99","$229.99","$89.99","$119.99","$239.99","$119.99","$169.99","$89.99"]},{"n":"Pixel 10 Pro","g":"Google Pixel","p":["$219.99","$379.99","$89.99","$119.99","$359.99","$139.99","$199.99","$89.99"]},{"n":"Pixel 10 Pro XL","g":"Google Pixel","p":["$259.99","$369.99","$89.99","$119.99","$359.99","$149.99","$199.99","$89.99"]},{"n":"Pixel 11","g":"Google Pixel","p":["$219.99",null,"$109.99",null,"$219.99","$109.99","$169.99",null]},{"n":"Pixel 11 Pro","g":"Google Pixel","p":["$299.99",null,"$119.99",null,"$329.99","$129.99","$179.99",null]},{"n":"Pixel 11 Pro XL","g":"Google Pixel","p":["$309.99",null,"$119.99",null,"$329.99","$129.99","$189.99",null]},{"n":"Pixel 3a","g":"Pixel A-Series","p":["$109.99","$149.99","$79.99","$79.99","$79.99","$79.99","$119.99","$79.99"]},{"n":"Pixel 3a XL","g":"Pixel A-Series","p":["$119.99","$139.99","$79.99","$79.99","$79.99","$79.99","$119.99","$79.99"]},{"n":"Pixel 4a","g":"Pixel A-Series","p":["$159.99",null,"$89.99","$79.99","$79.99","$79.99","$89.99","$79.99"]},{"n":"Pixel 4a 5G","g":"Pixel A-Series","p":["$169.99",null,"$89.99","$79.99","$79.99","$79.99","$99.99","$79.99"]},{"n":"Pixel 5a","g":"Pixel A-Series","p":["$159.99","$179.99","$89.99","$79.99","$79.99","$79.99",null,"$79.99"]},{"n":"Pixel 6a","g":"Pixel A-Series","p":["$189.99",null,"$89.99","$89.99","$99.99","$79.99","$109.99","$79.99"]},{"n":"Pixel 7a","g":"Pixel A-Series","p":["$209.99",null,"$89.99",null,"$89.99","$99.99","$109.99","$79.99"]},{"n":"Pixel 8a","g":"Pixel A-Series","p":["$189.99",null,"$89.99",null,"$129.99","$89.99","$109.99","$79.99"]},{"n":"Pixel 9a","g":"Pixel A-Series","p":["$199.99","$229.99","$89.99",null,"$139.99","$89.99","$99.99","$89.99"]},{"n":"Pixel 10a","g":"Pixel A-Series","p":["$209.99",null,"$109.99",null,null,"$89.99","$89.99","$89.99"]},{"n":"Pixel Fold","g":"Pixel Fold (outer screen)","p":["$209.99","$259.99","$109.99",null,"$89.99",null,null,"$79.99"]},{"n":"Pixel 9 Pro Fold","g":"Pixel Fold (outer screen)","p":["$209.99",null,"$89.99",null,"$89.99","$149.99","$99.99","$89.99"]},{"n":"Pixel 10 Pro Fold","g":"Pixel Fold (outer screen)","p":["$259.99","$309.99","$139.99",null,"$169.99",null,"$219.99","$89.99"]},{"n":"Pixel 11 Pro Fold","g":"Pixel Fold (outer screen)","p":["$329.99",null,null,null,"$199.99","$149.99","$249.99",null]}],"notes":["Labor only (customer brings part): phones $80 · tablets $80 · computers $100. Data backup $75 · Software restore $39."]},"ipad":{"name":"iPad","cols":["Glass Only (display works)","LCD Replacement","Charging Port","Other Small Parts","Battery"],"models":[{"n":"iPad 5th Gen / Air 1","g":"","p":["$89.99","$159.99 (LCD Only)","$119.00","$119.00","$89.00"]},{"n":"iPad 6th","g":"","p":["$89.99","$159.99 (LCD Only)","$129.00","$129.00","$89.00"]},{"n":"iPad 7th/8th/9th","g":"","p":["$99.99","$149.99 (LCD Only)","$129.00","$129.00","$99.00"]},{"n":"iPad 10th/11th","g":"","p":["$109.99","$199.99 (LCD Only)","$129.00",null,"$129.00"]},{"n":"iPad Mini 4","g":"","p":["$159.99","$169.99","$129.99",null,"$89.99"]},{"n":"iPad Mini 5","g":"","p":["$169.99","$179.99","$129.99",null,"$99.99"]},{"n":"iPad Mini 6","g":"","p":["$319.99","$349.99",null,null,null]},{"n":"iPad Air 2","g":"","p":["$169.99","$179.99","$129.00","$129.00","$99.00"]},{"n":"iPad Air 3","g":"","p":["$189.99","$199.99","$149.00","$149.00","$129.00"]},{"n":"iPad Air 4/5","g":"","p":["$249.99","$249.99","$169.00","$169.00","$149.00"]},{"n":"iPad Pro 9.7","g":"","p":["$179.99","$179.99","$129.00","$129.00","$99.00"]},{"n":"iPad Pro 10.5","g":"","p":["$189.99","$199.99","$129.00","$129.00","$119.00"]},{"n":"iPad Pro 11 1st/2nd Gen","g":"","p":["$209.99","$209.99","$149.00","$149.00","$149.00"]},{"n":"iPad Pro 11 3rd/4th Gen","g":"","p":["$229.99","$229.99","$149.00","$149.00","$149.00"]},{"n":"iPad Pro 12.9 1st Gen","g":"","p":["$269.99","$279.99","$129.00","$129.00","$119.00"]},{"n":"iPad Pro 12.9 2nd Gen","g":"","p":["$369.99","$379.99","$199.00","$199.00","$199.00"]},{"n":"iPad Pro 12.9 3rd/4th Gen","g":"","p":["$229.99","$239.99","$149.00","$149.00","$149.00"]},{"n":"iPad Pro 12.9 5th/6th Gen","g":"","p":["$309.99","$319.99","$179.00","$179.00","$169.00"]}],"notes":["Labor only (customer brings part): phones $80 · tablets $80."]},"watch":{"name":"Apple Watch","cols":["Glass Only (display works)","LCD Replacement","Battery"],"models":[{"n":"Series 1 38mm","g":"","p":["$99.00","$99.00","$69.00"]},{"n":"Series 1 42mm","g":"","p":["$99.00","$99.00","$69.00"]},{"n":"Series 2 38mm","g":"","p":["$99.00","$99.00","$69.00"]},{"n":"Series 2 42mm","g":"","p":["$99.00","$99.00","$69.00"]},{"n":"Series 3 38mm","g":"","p":["$99.00","$99.00","$69.00"]},{"n":"Series 3 42mm","g":"","p":["$119.00","$119.00","$69.00"]},{"n":"Series 4 40mm","g":"","p":["$99.00","$99.00","$69.00"]},{"n":"Series 4 44mm","g":"","p":["$119.00","$119.00","$69.00"]},{"n":"Series 5 / SE 40mm","g":"","p":["$139.00","$139.00","$69.00"]},{"n":"Series 5 / SE 44mm","g":"","p":["$159.00","$159.00","$69.00"]},{"n":"Series 6 40mm","g":"","p":["$119.00","$119.00","$89.00"]},{"n":"Series 6 44mm","g":"","p":["$159.00","$159.00","$89.00"]},{"n":"Series 7 41mm","g":"","p":["$119.00","$119.00","$89.00"]},{"n":"Series 7 45mm","g":"","p":["$119.00","$119.00","$89.00"]},{"n":"Series 8 41mm","g":"","p":["$149.00","$149.00",null]},{"n":"Series 8 45mm","g":"","p":["$199.00","$199.00",null]},{"n":"Series 9 41mm","g":"","p":["$199.00","$199.00",null]},{"n":"Series 9 45mm","g":"","p":["$199.00","$199.00",null]},{"n":"Series 10 42mm","g":"","p":["$319.00","$319.00",null]},{"n":"Series 10 46mm","g":"","p":["$319.00","$319.00",null]},{"n":"Series SE 40mm","g":"","p":["$119.00","$159.00",null]},{"n":"Series SE 44mm","g":"","p":["$149.00","$199.00",null]}],"notes":["Labor only (customer brings part): phones $80 · tablets $80."]},"moto":{"name":"Motorola","cols":["Display","Small Part","Battery"],"models":[{"n":"Moto G 5G 2022 LCD","g":"","p":["$109.99",null,null]},{"n":"Moto G 5G 2023 LCD","g":"","p":["$109.99",null,null]},{"n":"Moto G 5G 2024 LCD","g":"","p":["$109.99",null,null]},{"n":"Moto G 5G 2025 LCD","g":"","p":["$119.99",null,null]},{"n":"Moto G Play 2023 LCD","g":"","p":["$109.99",null,null]},{"n":"Moto G Power 2023 LCD","g":"","p":["$119.99",null,null]},{"n":"Moto G Play 2024 LCD","g":"","p":["$119.99",null,null]},{"n":"Moto G Power 2024 LCD","g":"","p":["$119.99",null,null]},{"n":"Moto G Power 2025 LCD","g":"","p":["$139.99",null,null]},{"n":"Moto G Stylus 2023 LCD","g":"","p":["$159.99",null,null]},{"n":"Moto G Stylus 2024 LCD","g":"","p":["$159.99",null,null]},{"n":"Moto G Stylus 2025 LCD","g":"","p":["$179.99",null,null]}],"notes":["Any repair not on pricelist, will be part cost + labor cost based on the device","Smartphone Labor: $80 --- Tablet Labor: $80 --- Computer Labor: $100"]},"console":{"name":"Game Console","cols":["DIGITIZER","LCD","Disk Drive / Game Reader","HDMI Port / Charging Port","HDD 1tb","Cleaning","Thermal Paste / Liquid Metal","Diagnostics","Misc."],"models":[{"n":"XBOX One / One S","g":"","p":[null,null,"$119","$119","$199","$69","$99","$49",null]},{"n":"XBOX One X","g":"","p":[null,null,"$119","$129","$199","$69","$99","$49",null]},{"n":"XBOX Series S","g":"","p":[null,null,"$129","$139","$299","$79","$129","$49",null]},{"n":"XBOX Series X","g":"","p":[null,null,"$139","$149","$299","$79","$129","$49",null]},{"n":"PlayStation 4","g":"","p":[null,null,"$129","$119","$179","$69","$99","$49",null]},{"n":"PS4 Pro/ Slim","g":"","p":[null,null,"$139","$129","$199","$69","$99","$49",null]},{"n":"PlayStation 5","g":"","p":[null,null,"$169 - $179","$149",null,"$79","$129","$49","$129 - $169"]},{"n":"Switch / Switch Lite","g":"","p":["$120","$129","$99","$119",null,"$49","$79","$49",null]},{"n":"Switch OLED","g":"","p":[null,"$229","$119","$149",null,"$49","$79","$49",null]}],"notes":["Low Price Guarantee - We'll match the price, and beat the quality","Console Labor $100","Software Restore/Reinstall: $99"]},"computer":{"name":"Computer","cols":["Price"],"models":[{"n":"Virus Removal","g":"PC","p":["Basic: $79 · Advanced: $119"]},{"n":"Data Recovery","g":"PC","p":["Simple $99 · Re-Install $100 · Data Backup + Reinstall = $150"]},{"n":"LCD","g":"PC","p":["Ballpark: $99 - $299(Model # on back of the LCD for accurate price) · Average: $149 · Digitizer: Model specific; do not quote without diag."]},{"n":"Battery","g":"PC","p":["Based off part cost: $49 - $199"]},{"n":"Power Jack","g":"PC","p":["$90"]},{"n":"HDD w/OS","g":"PC","p":["500 GB: $149 · 1 TB: $199 · 2 TB: $249"]},{"n":"SSD w/OS","g":"PC","p":["256GB: $199 · 512GB: $259 · 1TB: $299"]},{"n":"Fans / Other Misc.","g":"PC","p":["Based off part cost: $49 - $129"]},{"n":"Battery","g":"Mac","p":["Based off part cost: $49 - $199"]},{"n":"HDD w/OS","g":"Mac","p":["500 GB: $149 · 1 TB: $199 · 2 TB: $249"]},{"n":"SSD w/OS","g":"Mac","p":["256 GB: $179 · 512 GB: $249 · 1 TB: $349"]},{"n":"Reinstall / Backup","g":"Mac","p":["Backup & Transfer: $100 Reinstall: $100 Both: $150"]}],"notes":["Any repair not on pricelist, will be part cost + labor cost based on the device","Smartphone Labor: $80 --- Tablet Labor: $80 --- Computer Labor: $100"]},"surface":{"name":"Surface","cols":["Glass/LCD Assembly","Small","Battery"],"models":[{"n":"Surface Pro 3","g":"","p":["$319","$249","$249"]},{"n":"Surface Pro 4","g":"","p":["$299","$249","$249"]},{"n":"Surface Pro 5","g":"","p":["$299","$249","$249"]},{"n":"Surface Pro 6","g":"","p":["$299","$249","$249"]},{"n":"Surface Pro 7","g":"","p":["$349",null,null]},{"n":"Surface Pro 7+","g":"","p":["$399",null,null]},{"n":"Surface Pro X","g":"","p":["$699",null,null]},{"n":"Surface 3","g":"","p":["$229","$219","$219"]}],"notes":["Any repair not on pricelist, will be part cost + labor cost based on the device","Microsoft Surface Labor: $200-$250","Data Backup: 199","Software Restore: 99"]},"ipod":{"name":"iPod","cols":["Glass Only","LCD Only","Full Screen (Glass + LCD)","Small Parts","Battery"],"models":[{"n":"iPod Touch 2nd / 3rd Gen","g":"","p":["$49.00","$49.00","$69.00","$39.00","$29.00"]},{"n":"iPod Touch 4th Gen","g":"","p":[null,null,"$69.00","$49.00","$44.00"]},{"n":"iPod Touch 5th / 6th / 7th Gen","g":"","p":[null,null,"$89.00","$79.00","$79.00"]},{"n":"iPod Video (5th Gen)","g":"","p":["$39.00","$39.00","$59.00","$29.00","$59.00"]},{"n":"iPod Classic (6th Gen)","g":"","p":["$49.00","$49.00","$99.00","$39.00","$59.00"]}],"notes":["Labor only (customer brings part): phones $80 · tablets $80."]}}};

  /* ---------- the POS parser for the published sheet (copied verbatim) ---------- */
  const RQ_PUB = 'https://docs.google.com/spreadsheets/d/1_LCeGk23y5aZ_mT3Oej_6f1b9Zh9PhYuK8R5LlxaNkA/pub';
const RQ_TABS = {Apple: 510910333, Samsung: 1436859400, Pixel: 1436859500, Moto: 746224264, Consoles: 1693651162, PC: 1691333639, Mac: 784629370, 'Surface Pro': 1750962834};
function rqCSV(t){ const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++){ const c = t[i];
    if (q){ if (c === '"'){ if (t[i + 1] === '"'){ f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true; else if (c === ','){ row.push(f); f = ''; }
    else if (c === '\n'){ row.push(f); rows.push(row); row = []; f = ''; } else if (c !== '\r') f += c; }
  if (f !== '' || row.length){ row.push(f); rows.push(row); }
  return rows.map(r => { let k = r.length; while (k > 0 && r[k - 1] === '') k--; return r.slice(0, k); }); }
const rqN = h => String(h || '').replace(/\s+/g, ' ').trim();
const rqC = v => { v = rqN(v); return ['', '—', '-', '–', 'x'].includes(v) ? null : v; };
function rqSections(vals){
  const out = [], notes = []; let i = 0; const isH = r => r && rqN(r[0]) === 'Model';
  while (i < vals.length){ const r = vals[i];
    if (i + 1 < vals.length && isH(vals[i + 1])){
      const title = rqN(r && r[0]), hdr = vals[i + 1].map(rqN), rows = []; let j = i + 2;
      while (j < vals.length && vals[j] && rqN(vals[j][0]) && !(j + 1 < vals.length && isH(vals[j + 1]))){ rows.push(vals[j]); j++; }
      (r || []).slice(1).map(rqN).filter(x => x && /\d/.test(x)).forEach(x => notes.push(x));
      out.push([title, hdr, rows]); i = j;
    } else { if (r && rqN(r[0]) && !(i + 1 < vals.length && isH(vals[i + 1]))){ const t = r.map(rqN).filter(Boolean).join(' \xb7 '); if (t) notes.push(t); } i++; } }
  return [out, notes]; }
function rqBuild(V){
  const cats = {}; const cat = (k, n) => cats[k] || (cats[k] = {name: n, cols: null, models: [], notes: []});
  const add = (c, g, hdr, rows) => { const keep = []; for (let k = 1; k < hdr.length; k++) if (hdr[k]) keep.push(k);
    if (!c.cols) c.cols = keep.map(k => hdr[k]);
    for (const r0 of rows){ const r = r0.concat(Array(Math.max(0, hdr.length - r0.length)).fill('')); const p = keep.map(k => rqC(r[k])); if (p.some(Boolean)) c.models.push({n: rqN(r[0]), g, p}); } };
  let [secs, notes] = rqSections(V.Apple);
  const amap = {'APPLE iPHONE': ['iphone', 'iPhone'], 'APPLE iPAD': ['ipad', 'iPad'], 'APPLE WATCH': ['watch', 'Apple Watch'], 'APPLE iPOD': ['ipod', 'iPod']};
  for (const [t, h, rows] of secs){ const m = amap[t]; if (m) add(cat(m[0], m[1]), '', h, rows); }
  for (const k of ['iphone', 'ipad', 'watch', 'ipod']) if (cats[k]) cats[k].notes = notes.filter(x => /labor/i.test(x));
  for (const [tab, key, name] of [['Samsung', 'samsung', 'Samsung'], ['Pixel', 'pixel', 'Pixel']]){
    [secs, notes] = rqSections(V[tab]); const c = cat(key, name);
    for (const [t, h, rows] of secs){ const g = t.replace(/^SAMSUNG\s+/, '').toLowerCase().replace(/\b\w/g, x => x.toUpperCase()).replace('(Outer Screen)', '(outer screen)'); add(c, g, h, rows); }
    c.notes = notes.filter(x => !x.startsWith('Cellular Zone')); }
  for (const [tab, key, name] of [['Moto', 'moto', 'Motorola'], ['Consoles', 'console', 'Game Console'], ['Surface Pro', 'surface', 'Surface']]){
    [secs, notes] = rqSections(V[tab]); const c = cat(key, name);
    for (const [, h, rows] of secs) add(c, '', h, rows);
    c.notes = notes.filter(x => !/^Cellular ?Zone/.test(x) && !['Consoles', 'Microsoft'].includes(x)); }
  const c = cat('computer', 'Computer'); c.cols = ['Price'];
  for (const tab of ['PC', 'Mac']){ let started = false;
    for (const r of V[tab]){ if (!r || !rqN(r[0])) continue; const a = rqN(r[0]);
      if (['Computers', 'Mac', 'Model'].includes(a) || a.startsWith('Cellular Zone')){ started = true; continue; }
      if (/labor/i.test(a) || a.startsWith('Any repair')){ if (!c.notes.includes(a)) c.notes.push(a); continue; }
      const price = r.slice(1).map(rqN).filter(Boolean).join(' \xb7 ');
      if (started && price) c.models.push({n: a, g: tab === 'PC' ? 'PC' : 'Mac', p: [price]}); } }
  for (const x of Object.values(cats)){ const nn = [];
    for (let t of x.notes){ t = t.replace(/^Prices pull automatically[^.]*\.\s*/, '').replace(/\s*-+$/, '').trim();
      if (!t || t.startsWith('—') || nn.includes(t) || t.includes('Smartphone Labor: $60')) continue; nn.push(t); }
    x.notes = nn; }
  const o = {}; for (const k of ['iphone', 'samsung', 'pixel', 'ipad', 'watch', 'moto', 'console', 'computer', 'surface', 'ipod']) if (cats[k]) o[k] = cats[k];
  return o; }


  /* ---------- stores ---------- */
  const HOURS = 'Mon–Sat 10am–8pm · Sun 11am–6pm';
  const STORES = Object.assign({
    PT: {name: 'Potranco', addr: '9230 Potranco Rd #105', city: 'San Antonio, TX 78251', phone: '7262274697', lat: 29.4432, lng: -98.6744},
    DZ: {name: 'Babcock', addr: '6565 Babcock Rd', city: 'San Antonio, TX 78249', phone: '7262274782', lat: 29.5545, lng: -98.5987},
    BV: {name: 'Bulverde', addr: '17910 Bulverde Rd Suite 106', city: 'San Antonio, TX 78259', phone: '7262274665', lat: 29.6018, lng: -98.4184},
  }, CFG.stores || {});
  const fmtPh = p => `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}`;
  const dirUrl = s => 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(`Cellular Zone ${s.addr}, ${s.city}`);

  /* ---------- what customers pick, mapped onto sheet columns ---------- */
  const DEVICES = [
    {k: 'iphone', label: 'iPhone', icon: 'phone'},
    {k: 'samsung', label: 'Samsung Galaxy', icon: 'phone'},
    {k: 'pixel', label: 'Google Pixel', icon: 'phone'},
    {k: 'ipad', label: 'iPad', icon: 'tablet'},
    {k: 'watch', label: 'Apple Watch', icon: 'watch'},
    {k: 'console', label: 'Game console', icon: 'console'},
    {k: 'computer', label: 'Computer or Mac', icon: 'laptop'},
    {k: 'other', label: 'Something else', icon: 'more', cats: ['moto', 'surface', 'ipod']},
  ];
  const DIAG = {id: 'diag', name: 'Diagnosis in store', label: 'Not sure, water damage or won’t turn on', hint: 'We check it in store and quote you before any work', cols: []};
  const SCREEN_Q = {
    iphone: [['Yes, it’s just cracked glass', ['GOOD Glass Only', 'BETTER Glass Only', 'BEST Glass Only'], 'Screen repair (display still works)'], ['It has black spots, lines, or touch issues', ['GOOD Aftermarket LCD', 'BETTER Premium OLED', 'BEST Genuine Apple'], 'Full screen replacement']],
    samsung: [['Yes, it’s just cracked glass', ['Glass Only (display works)'], 'Screen repair (display still works)'], ['It works but shows burn-in or ghost images', ['Glass Only + Burn-In'], 'Screen repair with burn-in'], ['It has black spots, lines, or touch issues', ['Screen Replacement'], 'Full screen replacement']],
    ipad: [['Yes, it’s just cracked glass', ['Glass Only (display works)'], 'Glass repair (display still works)'], ['It has black spots, lines, or touch issues', ['LCD Replacement'], 'Full screen replacement']],
    watch: [['Yes, it’s just cracked glass', ['Glass Only (display works)'], 'Glass repair (display still works)'], ['It has black spots, lines, or touch issues', ['LCD Replacement'], 'Full screen replacement']],
    ipod: [['Just the glass is cracked', ['Glass Only'], 'Glass replacement'], ['The picture is damaged', ['LCD Only'], 'LCD replacement'], ['Both glass and picture', ['Full Screen (Glass + LCD)'], 'Full screen replacement']],
  };
  const ISSUES = {
    iphone: [
      {id: 'screen', label: 'Cracked or broken screen', q: SCREEN_Q.iphone, fall: ['Screen Replacement']},
      {id: 'back', label: 'Cracked back glass', cols: ['Back Glass', 'Housing / Frame'], name: 'Back glass repair'},
      {id: 'battery', label: 'Battery dies fast', cols: ['Battery', 'Battery (Genuine Apple)'], name: 'Battery replacement'},
      {id: 'port', label: 'Won’t charge', cols: ['Charging Port'], name: 'Charging port repair'},
      {id: 'rear', label: 'Back camera not working', cols: ['Rear Camera'], name: 'Rear camera replacement'},
      {id: 'lens', label: 'Cracked camera lens', cols: ['Camera Lens'], name: 'Camera lens replacement'},
      {id: 'front', label: 'Selfie camera not working', cols: ['Front Camera'], name: 'Front camera replacement'},
      {id: 'ear', label: 'Can’t hear on calls', cols: ['Ear Speaker', 'Other Small Parts'], name: 'Ear speaker repair'},
      {id: 'other', label: 'Speaker, mic or buttons', cols: ['Other Small Parts'], name: 'Small part repair'},
      DIAG],
    samsung: [
      {id: 'screen', label: 'Cracked or broken screen', q: SCREEN_Q.samsung, fall: ['Screen Replacement']},
      {id: 'battery', label: 'Battery dies fast', cols: ['Battery', 'Battery (Genuine Apple)'], name: 'Battery replacement'},
      {id: 'port', label: 'Won’t charge', cols: ['Charging Port'], name: 'Charging port repair'},
      {id: 'rear', label: 'Back camera not working', cols: ['Rear Camera'], name: 'Rear camera replacement'},
      {id: 'front', label: 'Selfie camera, speaker or buttons', cols: ['Front Cam / Small Parts'], name: 'Small part repair'},
      {id: 'back', label: 'Cracked back glass or camera lens', cols: ['Back Glass / Camera Lens'], name: 'Back glass or lens repair'},
      DIAG],
    pixel: [
      {id: 'screen', label: 'Cracked or broken screen', cols: ['Screen (Standard)', 'Screen (Genuine OEM)'], name: 'Screen replacement'},
      {id: 'battery', label: 'Battery dies fast', cols: ['Battery', 'Battery (Genuine Apple)'], name: 'Battery replacement'},
      {id: 'port', label: 'Won’t charge', cols: ['Charging Port'], name: 'Charging port repair'},
      {id: 'rear', label: 'Back camera not working', cols: ['Rear Camera'], name: 'Rear camera replacement'},
      {id: 'front', label: 'Selfie camera not working', cols: ['Front Camera'], name: 'Front camera replacement'},
      {id: 'back', label: 'Cracked back glass', cols: ['Back Glass / Back Housing'], name: 'Back glass repair'},
      {id: 'ear', label: 'Speaker problems', cols: ['Ear / Loud Speaker'], name: 'Speaker repair'},
      DIAG],
    ipad: [
      {id: 'screen', label: 'Cracked or broken screen', q: SCREEN_Q.ipad},
      {id: 'battery', label: 'Battery dies fast', cols: ['Battery', 'Battery (Genuine Apple)'], name: 'Battery replacement'},
      {id: 'port', label: 'Won’t charge', cols: ['Charging Port'], name: 'Charging port repair'},
      {id: 'other', label: 'Buttons, cameras or speakers', cols: ['Other Small Parts'], name: 'Small part repair'},
      DIAG],
    watch: [
      {id: 'screen', label: 'Cracked or broken screen', q: SCREEN_Q.watch},
      {id: 'battery', label: 'Battery dies fast', cols: ['Battery', 'Battery (Genuine Apple)'], name: 'Battery replacement'},
      DIAG],
    moto: [
      {id: 'screen', label: 'Cracked or broken screen', cols: ['Display'], name: 'Screen replacement'},
      {id: 'battery', label: 'Battery dies fast', cols: ['Battery', 'Battery (Genuine Apple)'], name: 'Battery replacement'},
      {id: 'other', label: 'Charging port, cameras or buttons', cols: ['Small Part'], name: 'Small part repair'},
      DIAG],
    surface: [
      {id: 'screen', label: 'Cracked or broken screen', cols: ['Glass/LCD Assembly'], name: 'Screen replacement'},
      {id: 'battery', label: 'Battery dies fast', cols: ['Battery', 'Battery (Genuine Apple)'], name: 'Battery replacement'},
      {id: 'other', label: 'Ports or small parts', cols: ['Small'], name: 'Small part repair'},
      DIAG],
    ipod: [
      {id: 'screen', label: 'Cracked or broken screen', q: SCREEN_Q.ipod},
      {id: 'battery', label: 'Battery dies fast', cols: ['Battery', 'Battery (Genuine Apple)'], name: 'Battery replacement'},
      {id: 'other', label: 'Buttons, port or small parts', cols: ['Small Parts'], name: 'Small part repair'},
      DIAG],
    console: [
      {id: 'hdmi', label: 'No picture on the TV / HDMI or charging port', cols: ['HDMI Port / Charging Port'], name: 'HDMI / charging port repair'},
      {id: 'disc', label: 'Won’t read discs or games', cols: ['Disk Drive / Game Reader'], name: 'Disc drive / game reader repair'},
      {id: 'heat', label: 'Overheating or shutting off', cols: ['Thermal Paste / Liquid Metal'], name: 'Thermal paste service'},
      {id: 'clean', label: 'Loud fan, needs a cleaning', cols: ['Cleaning'], name: 'Deep cleaning'},
      {id: 'lcd', label: 'Cracked or broken screen', cols: ['LCD'], name: 'Screen replacement'},
      {id: 'touch', label: 'Touchscreen not responding', cols: ['DIGITIZER'], name: 'Touchscreen repair'},
      {id: 'diag', label: 'Not sure or won’t turn on', cols: ['Diagnostics'], name: 'Diagnostics', hint: 'We find the problem and quote you before any work'}],
  };

  /* ---------- price helpers ---------- */
  const money = v => { const m = String(v || '').replace(/,/g, '').match(/\$?\s*(\d+(?:\.\d+)?)/); return m ? +m[1] : null; };
  const usd = n => '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, '');
  const colPrice = (cat, model, cols) => { for (const c of cols) { const i = cat.cols.indexOf(c); if (i >= 0) { const n = money(model.p[i]); if (n) return {price: n, col: c}; } } return null; };
  function issuesFor(k, cat, model) {
    if (k === 'computer') return cat.models.filter(m => m.g === model.g).map(m => ({id: 'c:' + m.n, label: m.n, text: m.p[0], cols: []}));
    return (ISSUES[k] || []).map(is => {
      if (is.q) { const opts = is.q.map(([t, cols, short]) => ({t, short, hit: colPrice(cat, model, cols) || (is.fall && colPrice(cat, model, is.fall))})).filter(o => o.hit);
        if (!opts.length) return null; return Object.assign({}, is, {opts, from: Math.min(...opts.map(o => o.hit.price))}); }
      if (!is.cols.length) return is;
      const hit = colPrice(cat, model, is.cols); return hit ? Object.assign({}, is, {hit, from: hit.price}) : null;
    }).filter(Boolean);
  }
  const gen = n => { const m = String(n).match(/iPhone\s+(\d+)/i); if (m) return +m[1]; if (/iPhone\s+(X|XR|XS)/i.test(n)) return 10; if (/iPhone\s+(SE|Air|16e)/i.test(n)) return /Air|16e/i.test(n) ? 17 : /SE/.test(n) ? 9 : 0; return 0; };
  function extras(k, model, id) {
    const o = {};
    if (k === 'iphone') {
      const g = gen(model.n), pro = /pro/i.test(model.n);
      if (['screen', 'battery'].includes(id)) o.time = 'About 30 minutes';
      if (['screen', 'battery', 'port'].includes(id) ? g >= 7 : ['rear', 'lens', 'front', 'ear', 'other'].includes(id)) o.stock = true;
      if (id === 'back') o.time = g <= 13 || (g === 14 && pro) ? 'About 3 hours' : 'About 45 minutes';
    } else if (k === 'samsung') {
      if (['screen', 'battery'].includes(id)) o.time = 'About 30 minutes';
      if (['battery', 'port'].includes(id)) o.stock = true;
    } else if (k === 'ipad' && id !== 'diag') o.time = '3 to 4 hours';
    return o;
  }

  /* ---------- attribution: first touch for 30 days + this visit ---------- */
  const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'];
  function attribution() {
    const qs = new URLSearchParams(location.search), now = {};
    ATTR_KEYS.forEach(k => { if (qs.get(k)) now[k] = qs.get(k).slice(0, 200); });
    let first = null;
    try { first = JSON.parse(localStorage.getItem('cz_attr') || 'null'); } catch (e) {}
    if (!first || Date.now() - first.at > 30 * 864e5 || (Object.keys(now).length && !first.gclid && !first.fbclid && !first.utm_source)) {
      first = Object.assign({at: Date.now(), landing: location.href.slice(0, 300), referrer: document.referrer.slice(0, 300)}, now);
      try { localStorage.setItem('cz_attr', JSON.stringify(first)); } catch (e) {}
    }
    return {first, last: Object.assign({page: location.href.slice(0, 300), referrer: document.referrer.slice(0, 300)}, now),
      paid: !!(first.gclid || first.gbraid || first.wbraid || first.fbclid || now.gclid || now.fbclid || /cpc|paid|ppc/i.test((first.utm_medium || '') + (now.utm_medium || '')))};
  }
  const track = (event, data) => { try { (window.dataLayer = window.dataLayer || []).push(Object.assign({event}, data || {})); } catch (e) {}
    try { if (event === 'generate_lead' && window.fbq) window.fbq('track', 'Lead', {value: data && data.value, currency: 'USD'}); } catch (e) {} };

  /* ---------- icons ---------- */
  const I = {
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M10.5 18.5h3"/>',
    tablet: '<rect x="4" y="3" width="16" height="18" rx="2.2"/><path d="M11 18h2"/>',
    watch: '<rect x="6.5" y="6" width="11" height="12" rx="3"/><path d="M9 6l.6-3h4.8l.6 3M9 18l.6 3h4.8l.6-3"/>',
    console: '<path d="M7 8h10a4 4 0 0 1 4 4l.6 4.2a2 2 0 0 1-3.5 1.6L16 15.5H8l-2.1 2.3a2 2 0 0 1-3.5-1.6L3 12a4 4 0 0 1 4-4z"/><path d="M8 11v3M6.5 12.5h3"/><circle cx="16" cy="12" r=".6"/><circle cx="17.6" cy="13.6" r=".6"/>',
    laptop: '<rect x="5" y="4.5" width="14" height="10" rx="1.5"/><path d="M2.5 18.5h19l-1.5-2.5H4z"/>',
    more: '<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
    back: '<path d="M15 5l-7 7 7 7"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    call: '<path d="M6.6 3.5h2.9l1.4 4.3-2 1.4a12 12 0 0 0 5.9 5.9l1.4-2 4.3 1.4v2.9a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>', shield: '<path d="M12 3l7.5 3v5.5c0 4.7-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.8-7.5-9.5V6z"/><path d="M8.8 12l2.2 2.2 4.4-4.6"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
  };
  const ic = (n, cls) => `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

  const CSS = `
  :host { --cz-accent: #3994E7; --cz-accent-ink: #1F6FBF; --cz-on-accent: #fff; --cz-ink: #1E252C; --cz-muted: #5C6B79; --cz-bg: #F4F7FA; --cz-card: #FFFFFF; --cz-line: #DCE4EC; --cz-soft: #EAF3FC; --cz-good: #16804F; --cz-good-bg: #E6F5EE; --cz-bad: #B3261E;
    display: block; font-family: inherit; color: var(--cz-ink); -webkit-text-size-adjust: 100%; }
  :host([theme="dark"]) { --cz-accent: #5AA8EE; --cz-accent-ink: #8CC3F4; --cz-on-accent: #0B1622; --cz-ink: #E6ECF2; --cz-muted: #9AA8B6; --cz-bg: #12181E; --cz-card: #1A2229; --cz-line: #2C3742; --cz-soft: #1B2E40; --cz-good: #5CCB95; --cz-good-bg: #15302A; --cz-bad: #F2938C; }
  @media (prefers-color-scheme: dark) { :host([theme="auto"]) { --cz-accent: #5AA8EE; --cz-accent-ink: #8CC3F4; --cz-on-accent: #0B1622; --cz-ink: #E6ECF2; --cz-muted: #9AA8B6; --cz-bg: #12181E; --cz-card: #1A2229; --cz-line: #2C3742; --cz-soft: #1B2E40; --cz-good: #5CCB95; --cz-good-bg: #15302A; --cz-bad: #F2938C; } }
  * { box-sizing: border-box; }
  [hidden] { display: none !important; }
  .top[hidden] + .bar { margin-top: 0; }
  .w { background: var(--cz-bg); border-radius: 20px; padding: clamp(16px, 3.5vw, 28px); max-width: 820px; margin: 0 auto; font-size: 16px; line-height: 1.45; }
  .top { display: flex; align-items: center; gap: 10px; min-height: 40px; }
  .back { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--cz-line); background: var(--cz-card); color: var(--cz-ink); cursor: pointer; flex: none; }
  .crumbs { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
  .chip { font: inherit; font-size: 13px; font-weight: 600; padding: 5px 11px; border-radius: 99px; background: var(--cz-card); border: 1px solid var(--cz-line); color: var(--cz-muted); cursor: pointer; }
  .chip:hover { color: var(--cz-ink); }
  .bar { height: 4px; background: var(--cz-line); border-radius: 4px; margin: 14px 0 20px; overflow: hidden; }
  .bar i { display: block; height: 100%; background: var(--cz-accent); border-radius: 4px; transition: width .35s ease; }
  h2 { font-size: clamp(22px, 4.2vw, 28px); line-height: 1.15; margin: 0 0 6px; letter-spacing: -.01em; text-wrap: balance; }
  .sub { color: var(--cz-muted); margin: 0 0 18px; }
  .grid { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
  .tile { font: inherit; text-align: left; display: flex; flex-direction: column; gap: 10px; padding: 16px; min-height: 104px; border-radius: 16px; background: var(--cz-card); border: 1.5px solid var(--cz-line); color: var(--cz-ink); cursor: pointer; transition: border-color .15s, transform .15s, box-shadow .15s; }
  .tile:hover { border-color: var(--cz-accent); box-shadow: 0 6px 18px -10px rgba(30,80,140,.35); }
  .tile:active { transform: scale(.985); }
  .tile b { font-size: 16px; }
  .tile .ic { width: 30px; height: 30px; color: var(--cz-accent); }
  .ic { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; flex: none; }
  .search { display: flex; align-items: center; gap: 10px; background: var(--cz-card); border: 1.5px solid var(--cz-line); border-radius: 14px; padding: 0 14px; margin-bottom: 14px; }
  .search:focus-within { border-color: var(--cz-accent); }
  .search .ic { color: var(--cz-muted); }
  .search input:focus-visible { outline: 0; }
  .search input { font: inherit; font-size: 16px; border: 0; outline: 0; background: transparent; color: var(--cz-ink); padding: 14px 0; width: 100%; min-width: 0; }
  .glabel { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--cz-muted); margin: 18px 0 8px; }
  .models { display: grid; gap: 8px; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); }
  .model { font: inherit; font-size: 15px; font-weight: 600; text-align: left; padding: 13px 14px; border-radius: 12px; background: var(--cz-card); border: 1.5px solid var(--cz-line); color: var(--cz-ink); cursor: pointer; }
  .model:hover { border-color: var(--cz-accent); }
  .empty { color: var(--cz-muted); padding: 18px 0; }
  .issues { display: grid; gap: 8px; }
  .issue { font: inherit; display: grid; grid-template-columns: 26px 1fr auto; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 14px; background: var(--cz-card); border: 1.5px solid var(--cz-line); color: var(--cz-ink); cursor: pointer; text-align: left; width: 100%; }
  .issue:hover { border-color: var(--cz-accent); }
  .issue[aria-pressed="true"] { border-color: var(--cz-accent); background: var(--cz-soft); }
  .box { width: 22px; height: 22px; border-radius: 7px; border: 2px solid var(--cz-line); display: grid; place-items: center; color: var(--cz-on-accent); }
  .issue[aria-pressed="true"] .box { background: var(--cz-accent); border-color: var(--cz-accent); }
  .box .ic { width: 15px; height: 15px; stroke-width: 2.6; opacity: 0; }
  .issue[aria-pressed="true"] .box .ic { opacity: 1; }
  .il b { display: block; font-size: 15.5px; }
  .il span { display: block; font-size: 13px; color: var(--cz-muted); margin-top: 2px; }
  .pr { font-weight: 800; font-variant-numeric: tabular-nums; white-space: nowrap; font-size: 16px; }
  .pr small { display: block; font-size: 11px; font-weight: 600; color: var(--cz-muted); text-align: right; letter-spacing: .02em; }
  .q { grid-column: 2 / -1; display: grid; gap: 6px; margin-top: 4px; }
  .q p { margin: 0 0 2px; font-size: 14px; font-weight: 600; }
  .opt { font: inherit; font-size: 14.5px; display: flex; justify-content: space-between; gap: 10px; align-items: center; padding: 11px 13px; border-radius: 11px; border: 1.5px solid var(--cz-line); background: var(--cz-card); color: var(--cz-ink); cursor: pointer; text-align: left; }
  .opt[aria-pressed="true"] { border-color: var(--cz-accent); box-shadow: inset 0 0 0 1px var(--cz-accent); }
  .opt b { font-variant-numeric: tabular-nums; }
  .sticky { position: sticky; bottom: 12px; margin-top: 16px; z-index: 2; }
  .cta { font: inherit; font-weight: 700; font-size: 16.5px; width: 100%; min-height: 54px; border: 0; border-radius: 14px; background: var(--cz-accent); color: var(--cz-on-accent); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 0 18px; box-shadow: 0 10px 24px -12px rgba(30,100,180,.6); }
  .cta:hover { filter: brightness(1.05); }
  .cta[disabled] { background: var(--cz-line); color: var(--cz-muted); cursor: not-allowed; box-shadow: none; }
  .cta .tot { font-variant-numeric: tabular-nums; margin-left: auto; }
  .cta.ghost { background: var(--cz-card); color: var(--cz-ink); border: 1.5px solid var(--cz-line); box-shadow: none; }
  .quote { background: var(--cz-card); border: 1.5px solid var(--cz-line); border-radius: 18px; padding: 18px; display: grid; gap: 14px; }
  .qhead { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; flex-wrap: wrap; }
  .qhead .dev { font-weight: 700; }
  .big { font-size: clamp(34px, 7vw, 44px); font-weight: 800; letter-spacing: -.02em; font-variant-numeric: tabular-nums; line-height: 1; }
  .lines { display: grid; gap: 8px; border-top: 1px dashed var(--cz-line); padding-top: 12px; }
  .line { display: flex; justify-content: space-between; gap: 12px; font-size: 15px; }
  .line span:last-child { font-variant-numeric: tabular-nums; font-weight: 600; white-space: nowrap; }
  .perks { display: flex; flex-wrap: wrap; gap: 8px; }
  .perk { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; padding: 6px 10px; border-radius: 99px; background: var(--cz-bg); color: var(--cz-ink); }
  .perk.ok { background: var(--cz-good-bg); color: var(--cz-good); }
  .perk .ic { width: 16px; height: 16px; }
  .fine { font-size: 12.5px; color: var(--cz-muted); margin: 0; }
  .sec { margin-top: 22px; }
  .sec h3 { font-size: 18px; margin: 0 0 10px; }
  .stores { display: grid; gap: 8px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
  .store { font: inherit; text-align: left; padding: 14px; border-radius: 14px; background: var(--cz-card); border: 1.5px solid var(--cz-line); color: var(--cz-ink); cursor: pointer; display: grid; gap: 3px; }
  .store[aria-pressed="true"] { border-color: var(--cz-accent); background: var(--cz-soft); }
  .store b { font-size: 16px; display: flex; justify-content: space-between; gap: 8px; }
  .store span { font-size: 13.5px; color: var(--cz-muted); }
  .dist { font-size: 12px !important; font-weight: 700; color: var(--cz-accent-ink) !important; }
  .near { font: inherit; font-size: 14px; font-weight: 600; background: none; border: 0; color: var(--cz-accent-ink); cursor: pointer; padding: 6px 0; display: inline-flex; gap: 6px; align-items: center; }
  .when { display: flex; flex-wrap: wrap; gap: 8px; }
  .when button { font: inherit; font-size: 14.5px; font-weight: 600; padding: 10px 14px; border-radius: 99px; border: 1.5px solid var(--cz-line); background: var(--cz-card); color: var(--cz-ink); cursor: pointer; }
  .when button[aria-pressed="true"] { border-color: var(--cz-accent); background: var(--cz-soft); }
  form { display: grid; gap: 12px; }
  .row2 { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  label { display: grid; gap: 6px; font-size: 14px; font-weight: 600; }
  label small { font-weight: 500; color: var(--cz-muted); }
  input[type=text], input[type=tel], input[type=email] { font: inherit; font-size: 16px; padding: 13px 14px; border-radius: 12px; border: 1.5px solid var(--cz-line); background: var(--cz-card); color: var(--cz-ink); width: 100%; min-width: 0; }
  select { font: inherit; font-size: 16px; padding: 13px 12px; border-radius: 12px; border: 1.5px solid var(--cz-line); background: var(--cz-card); color: var(--cz-ink); width: 100%; min-width: 0; }
  select:disabled { color: var(--cz-muted); }
  input:focus, select:focus { outline: 0; border-color: var(--cz-accent); }
  .err { color: var(--cz-bad); font-size: 14px; margin: 0; min-height: 1em; }
  .chk { display: flex; gap: 10px; align-items: flex-start; font-weight: 500; font-size: 13px; color: var(--cz-muted); }
  .chk input { margin-top: 2px; width: 18px; height: 18px; accent-color: var(--cz-accent); flex: none; }
  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
  .or { display: flex; gap: 8px; flex-wrap: wrap; }
  .or a, .or button { flex: 1 1 160px; text-decoration: none; }
  .done { text-align: center; padding: 8px 0; display: grid; gap: 12px; justify-items: center; }
  .done .tick { width: 64px; height: 64px; border-radius: 50%; background: var(--cz-good-bg); color: var(--cz-good); display: grid; place-items: center; }
  .done .tick .ic { width: 34px; height: 34px; stroke-width: 2.4; }
  .done .quote { text-align: left; width: 100%; }
  .muted { color: var(--cz-muted); }
  .src { font-size: 11.5px; color: var(--cz-muted); text-align: right; margin: 14px 2px 0; }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid var(--cz-accent); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  @media (max-width: 420px) { .issue { grid-template-columns: 24px 1fr auto; padding: 13px 12px; gap: 10px; } .grid { grid-template-columns: 1fr 1fr; } .tile { min-height: 92px; padding: 14px; } }
  `;

  /* ---------- which device / store a page is about, from its URL (e.g. /ipad-repair/ → iPad, /bulverde/ → BV) ---------- */
  const PATH = (location.pathname || '').toLowerCase();
  const PATH_DEVICE = [['iphone', /iphone/], ['ipad', /ipad|tablet/], ['samsung', /samsung|galaxy/], ['pixel', /pixel/], ['watch', /watch/],
    ['console', /console|playstation|xbox|nintendo|switch|\bps[45]\b/], ['computer', /computer|laptop|macbook|imac|\bmac\b|\bpc\b|desktop/]];
  const PATH_STORE = [['BV', /bulverde/], ['PT', /potranco/], ['DZ', /babcock|de-?zavala/]];
  const fromPath = rules => { for (const [k, re] of rules) if (re.test(PATH)) return k; return ''; };

  /* ---------- one widget instance ---------- */
  function mount(host) {
    if (host.__czq) return; host.__czq = true;
    const root = host.attachShadow({mode: 'open'});
    if (!host.hasAttribute('theme')) host.setAttribute('theme', host.dataset.theme || 'light');
    const qs = new URLSearchParams(location.search);
    const S = {step: 'device', k: null, model: null, sel: {}, ans: {}, store: (qs.get('store') || host.dataset.store || fromPath(PATH_STORE) || '').toUpperCase(), when: 'soon', appt: {}, q: '', dist: null, prices: null, live: false, t0: Date.now(), sent: null};
    if (!STORES[S.store]) S.store = '';
    const startDev = (qs.get('device') || host.dataset.device || fromPath(PATH_DEVICE) || '').toLowerCase();
    root.innerHTML = `<style>${CSS}</style><div class="w" role="region" aria-label="Instant repair quote"></div>`;
    const W = root.querySelector('.w');

    loadPrices().then(p => { S.prices = p.cats; S.live = p.live; S.asof = p.asof; if (DEVICES.some(d => d.k === startDev)) { S.k = startDev; S.step = 'model'; } render(); });
    W.innerHTML = `<p class="muted">Loading today’s prices…</p>`;

    const catsFor = k => (DEVICES.find(d => d.k === k).cats || [k]).filter(c => S.prices[c]);
    const model = () => S.model && S.prices[S.model.c].models.find(m => m.n === S.model.n && m.g === S.model.g);
    const cat = () => S.prices[S.model.c];
    const displayName = (c, m) => typeof rqDevice === 'function' ? rqDevice(c, m) : m.n;
    function picked() {
      if (!S.model) return [];
      const iss = issuesFor(S.model.c, cat(), model());
      return iss.filter(i => S.sel[i.id]).map(i => {
        let price = null, name = i.name || i.label, text = i.text || null;
        if (i.opts) { const o = i.opts[S.ans[i.id]]; if (!o) return {id: i.id, label: i.label, pending: true}; price = o.hit.price; name = o.short || i.label; }
        else if (i.hit) price = i.hit.price;
        return Object.assign({id: i.id, label: name, price, text}, extras(S.model.c, model(), i.id));
      });
    }
    const total = list => list.reduce((a, x) => a + (x.price || 0), 0);
    const go = (step) => { S.step = step; render(); track('cz_quote_step', {step}); try { const r = host.getBoundingClientRect(); if (r.top < 0) host.scrollIntoView({behavior: 'smooth', block: 'start'}); } catch (e) {} };

    function header(title, sub) {
      const crumbs = [];
      if (S.k && S.step !== 'device') crumbs.push(`<button class="chip" data-to="device">${esc(DEVICES.find(d => d.k === S.k).label)}</button>`);
      if (S.model && ['issue', 'quote'].includes(S.step)) crumbs.push(`<button class="chip" data-to="model">${esc(S.model.label)}</button>`);
      const prev = {model: 'device', issue: 'model', quote: 'issue'}[S.step];
      return `${prev || crumbs.length ? `<div class="top">` : '<div class="top" hidden>'}${prev ? `<button class="back" data-to="${prev}" aria-label="Back">${ic('back')}</button>` : ''}<div class="crumbs">${crumbs.join('')}</div></div>
        <div class="bar" aria-hidden="true"><i style="width:${{device: 12, model: 36, issue: 62, quote: 88, done: 100}[S.step]}%"></i></div>
        <h2>${title}</h2>${sub ? `<p class="sub">${sub}</p>` : ''}`;
    }

    function render() {
      if (!S.prices) return;
      const v = {device: vDevice, model: vModel, issue: vIssue, quote: vQuote, done: vDone}[S.step]();
      W.innerHTML = v + `<p class="src">${S.live ? 'Prices updated live from our store price list' : 'Prices as of ' + esc(S.asof || 'our latest price list')}</p>`;
      W.querySelectorAll('[data-to]').forEach(b => b.onclick = () => go(b.dataset.to));
      bind[S.step] && bind[S.step]();
    }

    /* step 1 */
    function vDevice() {
      return header('What needs fixing?', 'Get your price in seconds. No phone number needed to see it.') +
        `<div class="grid">${DEVICES.filter(d => catsFor(d.k).length && !(CFG.hide || []).includes(d.k)).map(d => `<button class="tile" data-k="${d.k}">${ic(d.icon)}<b>${esc(d.label)}</b></button>`).join('')}</div>`;
    }
    /* step 2 */
    function modelList() {
      const q = S.q.trim().toLowerCase().replace(/\s+/g, ' ');
      const groups = [];
      for (const c of catsFor(S.k)) {
        const ms = S.prices[c].models.slice();
        const byG = {};
        if (c === 'computer') { ['Mac', 'PC'].forEach(g => { if (ms.some(m => m.g === g)) (byG[g === 'Mac' ? 'Apple' : 'Windows'] = []).push({c, m: {n: g === 'Mac' ? 'Mac (MacBook, iMac)' : 'Windows PC or laptop', g, p: []}, key: g}); }); }
        else ms.forEach(m => { const g = S.k === 'other' ? S.prices[c].name : (m.g || ''); (byG[g] = byG[g] || []).push({c, m}); });
        for (const [g, list] of Object.entries(byG)) {
          let l = list.slice().reverse();
          if (c === 'computer') l = list;
          if (q) l = l.filter(x => { const hay = (displayName(x.c, x.m) + ' ' + x.m.n + ' ' + g).toLowerCase(); return q.split(' ').every(w => hay.includes(w)); });
          if (l.length) groups.push([g, l]);
        }
      }
      if (!groups.length) return `<p class="empty">No match for “${esc(S.q)}”. Try just the number, like “15 pro”, or pick “Not sure” below.</p>`;
      return groups.map(([g, l]) => `${g ? `<div class="glabel">${esc(g)}</div>` : ''}<div class="models">${l.map(x => `<button class="model" data-c="${x.c}" data-n="${esc(x.m.n)}" data-g="${esc(x.m.g)}">${esc(x.c === 'computer' ? x.m.n : displayName(x.c, x.m))}</button>`).join('')}</div>`).join('');
    }
    function vModel() {
      const d = DEVICES.find(x => x.k === S.k);
      const many = catsFor(S.k).reduce((a, c) => a + S.prices[c].models.length, 0) > 12 && S.k !== 'computer';
      return header(S.k === 'computer' ? 'Mac or PC?' : `Which ${esc(d.label === 'Something else' ? 'device' : d.label)}?`, S.k === 'iphone' ? 'Not sure? Settings → General → About shows the model name.' : '') +
        (many ? `<div class="search">${ic('search')}<input id="czq-s" type="text" inputmode="search" autocomplete="off" placeholder="Search, e.g. ${S.k === 'samsung' ? 'S24 Ultra' : S.k === 'iphone' ? '15 Pro Max' : 'model'}" value="${esc(S.q)}" aria-label="Search models"></div>` : '') +
        `<div id="czq-ml">${modelList()}</div>`;
    }
    /* step 3 */
    function vIssue() {
      const iss = issuesFor(S.model.c, cat(), model());
      const list = picked(), done = list.filter(x => !x.pending);
      const ready = list.length && !list.some(x => x.pending);
      return header('What’s wrong with it?', 'Pick everything that applies. Prices include parts and labor.') +
        `<div class="issues">${iss.map(i => {
          const on = !!S.sel[i.id], ex = extras(S.model.c, model(), i.id);
          const sub = i.hint || [ex.time, ex.stock ? 'Part usually in stock' : ''].filter(Boolean).join(' · ');
          const pr = i.text ? `<span class="pr" style="font-size:13px;white-space:normal;text-align:right;max-width:180px">${esc(i.text)}</span>`
            : i.from ? `<span class="pr">${i.opts && i.opts.length > 1 && new Set(i.opts.map(o => o.hit.price)).size > 1 ? '<small>FROM</small>' : ''}${usd(i.from)}</span>` : `<span class="pr" style="font-size:13px;color:var(--cz-muted)">Quote in store</span>`;
          const qhtml = on && i.opts && i.opts.length > 1 ? `<div class="q"><p>Does the screen still work?</p>${i.opts.map((o, n) => `<button type="button" class="opt" data-q="${i.id}" data-o="${n}" aria-pressed="${S.ans[i.id] === n}"><span>${esc(o.t)}</span><b>${usd(o.hit.price)}</b></button>`).join('')}</div>` : '';
          return `<div><button class="issue" data-i="${i.id}" aria-pressed="${on}"><span class="box">${ic('check')}</span><span class="il"><b>${esc(i.label)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</span>${pr}</button>${qhtml}</div>`;
        }).join('')}</div>
        <div class="sticky"><button class="cta" id="czq-next" ${ready ? '' : 'disabled'}>${ready ? `See my quote <span class="tot">${done.some(x => x.price) ? usd(total(done)) : ''}</span>` : list.length ? 'Answer the screen question above' : 'Pick at least one'}</button></div>`;
    }
    /* step 4 */
    function quoteCard(list, compact) {
      const t = total(list), hasPrice = list.some(x => x.price), unpriced = list.some(x => !x.price);
      const times = [...new Set(list.map(x => x.time).filter(Boolean))];
      const stock = list.length && list.every(x => x.stock);
      return `<div class="quote"><div class="qhead"><span class="dev">${esc(S.model.label)}</span>${hasPrice ? `<span class="big">${usd(t)}${unpriced ? '<span style="font-size:15px;font-weight:600;color:var(--cz-muted)"> + diagnosis</span>' : ''}</span>` : ''}</div>
        <div class="lines">${list.map(x => `<div class="line"><span>${esc(x.label)}</span><span>${x.price ? usd(x.price) : x.text ? esc(x.text) : 'Quoted in store'}</span></div>`).join('')}</div>
        <div class="perks"><span class="perk">${ic('shield')}${esc(CFG.warranty)}</span>${times.length === 1 ? `<span class="perk">${ic('clock')}${esc(times[0])}</span>` : ''}${stock ? `<span class="perk ok">${ic('box')}Part usually in stock</span>` : ''}<span class="perk">${ic('check')}Walk-ins welcome</span></div>
        ${compact ? '' : (() => { const t = ({iphone: 'Price is for our standard screen. Premium OLED and genuine Apple screens are available in store.', pixel: 'Price is for our standard screen. Genuine Google screens are available in store.'})[S.model.c] || ''; const u = unpriced ? 'Anything marked “quoted in store” is checked first and priced before any work.' : ''; return t || u ? `<p class="fine">${[t, u].filter(Boolean).join(' ')}</p>` : ''; })()}</div>`;
    }
    function storesHtml() {
      const order = Object.keys(STORES).sort((a, b) => S.dist ? S.dist[a] - S.dist[b] : 0);
      return `<div class="stores">${order.map(k => { const s = STORES[k]; return `<button class="store" data-s="${k}" aria-pressed="${S.store === k}"><b>${esc(s.name)}${S.dist ? `<span class="dist">${S.dist[k].toFixed(1)} mi</span>` : ''}</b><span>${esc(s.addr)}</span><span>${HOURS}</span></button>`; }).join('')}</div>
        ${S.dist ? '' : `<button class="near" id="czq-near" type="button">${ic('pin')}Sort by closest to me</button>`}`;
    }
    function vQuote() {
      const list = picked();
      const s = STORES[S.store];
      return header('Here’s your price', '') + quoteCard(list) +
        `<div class="sec"><h3>Which store?</h3>${storesHtml()}</div>
        <div class="sec"><h3>Hold this price and text it to me</h3>
        <form id="czq-f" novalidate>
          <div class="when" role="group" aria-label="When are you coming in?">${[['soon', 'Today or tomorrow'], ['appointment', 'Make an appointment for later'], ['later', 'Just send the quote']].map(([k, t]) => `<button type="button" data-w="${k}" aria-pressed="${S.when === k}">${t}</button>`).join('')}</div>
          ${S.when === 'appointment' ? apptHtml() : ''}
          <div class="row2"><label for="czq-name">First name<input id="czq-name" type="text" autocomplete="given-name" maxlength="60" required></label>
          <label for="czq-ph">Mobile number<input id="czq-ph" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="16" placeholder="(210) 555-0123" required></label></div>
          <label for="czq-note">Anything we should know? <small>Optional</small><input id="czq-note" type="text" maxlength="300" placeholder="e.g. it fell in water, need it back by 5pm"></label>
          <div class="hp" aria-hidden="true"><label for="czq-web">Website<input id="czq-web" type="text" tabindex="-1" autocomplete="off"></label></div>
          <label class="chk" for="czq-opt"><input id="czq-opt" type="checkbox"><span>Also send me occasional deals from Cellular Zone.</span></label>
          <p class="err" id="czq-err" role="alert"></p>
          <button class="cta" type="submit" id="czq-go">${S.when === 'appointment' ? 'Book my appointment' : 'Text me this quote'}</button>
          <p class="fine">By tapping, you agree Cellular Zone can text you about this ${S.when === 'appointment' ? 'appointment' : 'quote'}. Msg &amp; data rates may apply. Reply STOP to opt out.</p>
        </form></div>
        <div class="sec"><h3>Rather talk to someone?</h3><div class="or">
          ${s ? `<a class="cta ghost" href="tel:+1${s.phone}" data-call="${S.store}">${ic('call')}Call ${esc(s.name)} · ${fmtPh(s.phone)}</a>` : `<span class="fine">Pick a store above to see its number.</span>`}
          ${s ? `<a class="cta ghost" href="${dirUrl(s)}" target="_blank" rel="noopener" data-dir="${S.store}">${ic('pin')}Directions</a>` : ''}</div></div>`;
    }
    function apptDays() {
      const out = [], now = new Date();
      for (let i = 0; i < 14; i++) { const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
        const slots = apptSlots(d, i === 0 ? now : null); if (!slots.length) continue;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        out.push({key, slots, label: (i === 0 ? 'Today · ' : i === 1 ? 'Tomorrow · ' : '') + d.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}); }
      return out;
    }
    function apptSlots(d, now) { const open = d.getDay() === 0 ? 11 : 10, last = d.getDay() === 0 ? 17 : 19, out = [];
      for (let h = open; h <= last; h++) for (const m of [0, 30]) { if (h === last && m) continue; if (now && (h * 60 + m) < now.getHours() * 60 + now.getMinutes() + 60) continue; out.push(`${String(h).padStart(2, '0')}:${m ? '30' : '00'}`); }
      return out; }
    const fmtT = t => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
    function apptLabel(day, t) { const [y, mo, d] = day.split('-').map(Number); return new Date(y, mo - 1, d).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'}) + ' at ' + fmtT(t); }
    function apptHtml() {
      const days = apptDays(); if (!S.appt.day || !days.some(d => d.key === S.appt.day)) S.appt = {day: '', time: ''};
      const day = days.find(d => d.key === S.appt.day);
      return `<div class="row2"><label for="czq-day">Day<select id="czq-day"><option value="">Pick a day</option>${days.map(d => `<option value="${d.key}" ${d.key === S.appt.day ? 'selected' : ''}>${esc(d.label)}</option>`).join('')}</select></label>
        <label for="czq-time">Time<select id="czq-time" ${day ? '' : 'disabled'}><option value="">${day ? 'Pick a time' : 'Pick a day first'}</option>${day ? day.slots.map(t => `<option value="${t}" ${t === S.appt.time ? 'selected' : ''}>${fmtT(t)}</option>`).join('') : ''}</select></label></div>`;
    }
    function vDone() {
      const s = STORES[S.sent.store], list = S.sent.list;
      const appt = S.sent.when === 'appointment' && S.sent.appt;
      const whenTxt = appt ? `You’re booked, ${esc(S.sent.name)}` : S.sent.when === 'soon' ? `See you soon, ${esc(S.sent.name)}` : 'Your quote is on its way';
      const sent = S.sent.demo ? 'Preview mode: nothing was sent.' : (S.sent.ok ? `We just texted your ${appt ? 'confirmation' : 'quote'} to ${fmtPh(S.sent.phone)}.` : appt ? '' : `${esc(s.name)} will text you at ${fmtPh(S.sent.phone)} shortly.`);
      return `<div class="done"><div class="tick">${ic('check')}</div><h2>${whenTxt}</h2>
        ${appt ? `<p class="big" style="font-size:clamp(22px,5vw,28px);margin:0">${esc(appt.label)}</p>` : ''}
        <p class="sub" style="margin:0">${sent} ${appt ? `See you at ${esc(s.name)}. Need a different time? Reply to our text.` : `Just walk in to ${esc(s.name)}, no appointment needed.`}</p>
        ${quoteCard(list, true)}
        <div class="quote" style="gap:4px"><b>${esc(s.name)} · ${esc(s.addr)}</b><span class="muted">${esc(s.city)}</span><span class="muted">${HOURS}</span></div>
        <div class="or" style="width:100%"><a class="cta" href="${dirUrl(s)}" target="_blank" rel="noopener" data-dir="${S.sent.store}">${ic('pin')}Get directions</a><a class="cta ghost" href="tel:+1${s.phone}" data-call="${S.sent.store}">${ic('call')}${fmtPh(s.phone)}</a></div>
        <button class="near" data-again type="button">Get another quote</button></div>`;
    }

    const bind = {
      device() { W.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { if (S.k !== b.dataset.k) { S.model = null; S.sel = {}; S.ans = {}; S.q = ''; } S.k = b.dataset.k; go('model'); }); },
      model() {
        const wire = () => W.querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
          const c = b.dataset.c, n = b.dataset.n, g = b.dataset.g;
          const m = c === 'computer' ? {n, g, p: []} : S.prices[c].models.find(x => x.n === n && x.g === g);
          const label = c === 'computer' ? (g === 'Mac' ? 'Mac' : 'Windows PC') : displayName(c, m);
          if (!S.model || S.model.label !== label) { S.sel = {}; S.ans = {}; }
          S.model = {c, n, g, label};
          if (c === 'computer') { S.model.n = S.prices.computer.models.find(x => x.g === g).n; }
          track('cz_quote_model', {device: label}); go('issue');
        });
        wire();
        const inp = W.querySelector('#czq-s');
        if (inp) { inp.oninput = () => { S.q = inp.value; W.querySelector('#czq-ml').innerHTML = modelList(); wire(); };
          if (matchMedia('(pointer:fine)').matches) inp.focus(); }
      },
      issue() {
        W.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const id = b.dataset.i; S.sel[id] = !S.sel[id];
          if (S.sel[id]) { const is = issuesFor(S.model.c, cat(), model()).find(x => x.id === id); if (is.opts && is.opts.length === 1) S.ans[id] = 0; } render(); });
        W.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { S.ans[b.dataset.q] = +b.dataset.o; render(); });
        const nx = W.querySelector('#czq-next'); if (nx) nx.onclick = () => { const l = picked(); track('cz_quote_viewed', {device: S.model.label, value: total(l), repairs: l.map(x => x.label).join(', ')}); go('quote'); };
      },
      quote() {
        W.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { S.store = b.dataset.s; keep(); render(); });
        W.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { S.when = b.dataset.w; keep(); render(); });
        const ad = W.querySelector('#czq-day'), at2 = W.querySelector('#czq-time');
        if (ad) ad.onchange = () => { keep(); S.appt = {day: ad.value, time: ''}; render(); };
        if (at2) at2.onchange = () => { S.appt.time = at2.value; };
        const near = W.querySelector('#czq-near');
        if (near) near.onclick = () => {
          if (!navigator.geolocation) { near.textContent = 'Location isn’t available in this browser.'; return; }
          near.textContent = 'Finding your location…';
          navigator.geolocation.getCurrentPosition(p => { const {latitude: a, longitude: o} = p.coords; S.dist = {};
            for (const [k, s] of Object.entries(STORES)) { const r = Math.PI / 180, dl = (s.lat - a) * r, dn = (s.lng - o) * r;
              const h = Math.sin(dl / 2) ** 2 + Math.cos(a * r) * Math.cos(s.lat * r) * Math.sin(dn / 2) ** 2; S.dist[k] = 3958.8 * 2 * Math.asin(Math.sqrt(h)); }
            if (!S.store) S.store = Object.keys(S.dist).sort((x, y) => S.dist[x] - S.dist[y])[0]; keep(); render(); },
          () => { near.textContent = 'Couldn’t get your location. Pick the store you’re closest to.'; }, {timeout: 8000, maximumAge: 6e5});
        };
        const f = W.querySelector('#czq-f'), err = W.querySelector('#czq-err');
        // keep typed values across re-renders
        ['czq-name', 'czq-ph', 'czq-note'].forEach(id => { const el = W.querySelector('#' + id); if (S.form && S.form[id]) el.value = S.form[id]; el.oninput = () => { keep(); }; });
        W.querySelector('#czq-opt').checked = !!(S.form && S.form.opt);
        W.querySelector('#czq-opt').onchange = keep;
        f.onsubmit = async e => {
          e.preventDefault(); keep();
          const name = S.form['czq-name'].trim(), ph = S.form['czq-ph'].replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
          if (!S.store) { err.textContent = 'Pick the store you’ll visit.'; W.querySelector('.stores').scrollIntoView({behavior: 'smooth', block: 'center'}); return; }
          if (!name) { err.textContent = 'Enter your first name.'; W.querySelector('#czq-name').focus(); return; }
          if (ph.length !== 10) { err.textContent = 'Enter a 10-digit mobile number so we can text your quote.'; W.querySelector('#czq-ph').focus(); return; }
          if (S.when === 'appointment' && (!S.appt.day || !S.appt.time)) { err.textContent = 'Pick a day and time for your appointment.'; (W.querySelector(S.appt.day ? '#czq-time' : '#czq-day') || f).focus(); return; }
          const appt = S.when === 'appointment' ? {date: S.appt.day, time: S.appt.time, label: apptLabel(S.appt.day, S.appt.time)} : null;
          const btn = W.querySelector('#czq-go'); btn.disabled = true; btn.textContent = 'Sending…'; err.textContent = '';
          const list = picked(), at = attribution();
          const lead = {source: 'Repair landing page (ads)', store: S.store, name, phone: ph, device: S.model.label, category: S.model.c,
            repairs: list.map(x => ({name: x.label, price: x.price, text: x.text || null})), total: total(list), when: S.when, appt, message: S.form['czq-note'].trim(),
            marketingOptIn: !!S.form.opt, attribution: at, pricesLive: S.live, website: W.querySelector('#czq-web').value, ms: Date.now() - S.t0};
          let ok = false, demo = !CFG.endpoint;
          if (!demo) {
            try { const r = await fetch(CFG.endpoint, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(lead)});
              const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'send failed'); ok = !!j.texted; }
            catch (x) { btn.disabled = false; btn.textContent = S.when === 'appointment' ? 'Book my appointment' : 'Text me this quote';
              err.innerHTML = `We couldn’t send that just now. Try again, or call ${esc(STORES[S.store].name)} at ${fmtPh(STORES[S.store].phone)}.`; return; }
          } else { try { console.info('[CZ quote] preview mode, lead not sent:', lead); } catch (x) {} }
          track('generate_lead', {value: lead.total, currency: 'USD', store: S.store, device: lead.device, paid: at.paid});
          S.sent = {store: S.store, name, phone: ph, when: S.when, appt, list, ok, demo}; go('done');
        };
      },
      done() { const a = W.querySelector('[data-again]'); if (a) a.onclick = () => { S.k = null; S.model = null; S.sel = {}; S.ans = {}; S.q = ''; go('device'); }; },
    };
    function keep() {
      const g = id => { const el = W.querySelector('#' + id); return el ? el.value : (S.form && S.form[id]) || ''; };
      const o = W.querySelector('#czq-opt');
      S.form = {'czq-name': g('czq-name'), 'czq-ph': g('czq-ph'), 'czq-note': g('czq-note'), opt: o ? o.checked : !!(S.form && S.form.opt)};
    }
    // clicks on call/directions anywhere in the widget
    W.addEventListener('click', e => { const a = e.target.closest('a[data-call],a[data-dir]'); if (!a) return;
      track(a.dataset.call ? 'click_to_call' : 'get_directions', {store: a.dataset.call || a.dataset.dir, device: S.model && S.model.label}); });
  }

  let pricePromise = null;
  function loadPrices() {
    if (pricePromise) return pricePromise;
    pricePromise = (async () => {
      try {
        const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 5000), V = {};
        await Promise.all(Object.entries(RQ_TABS).map(async ([name, gid]) => { const r = await fetch(`${RQ_PUB}?gid=${gid}&single=true&output=csv`, {cache: 'no-store', signal: ctl.signal}); if (!r.ok) throw new Error(name); V[name] = rqCSV(await r.text()); }));
        clearTimeout(to); const cats = rqBuild(V);
        if (cats.iphone && cats.iphone.models.length >= 30) return {cats, live: true};
      } catch (e) {}
      return {cats: FALLBACK.cats, live: false, asof: FALLBACK.asof};
    })();
    return pricePromise;
  }

  // rqDevice lives in the POS file just below the parser; define the same naming here
  function rqDevice(k, m) { return k === 'watch' ? 'Apple Watch ' + m.n : k === 'pixel' && !/pixel/i.test(m.n) ? 'Pixel ' + m.n : k === 'samsung' && !/galaxy|note/i.test(m.n) ? 'Galaxy ' + m.n : k === 'surface' && !/surface/i.test(m.n) ? 'Surface ' + m.n : m.n; }

  function boot() { document.querySelectorAll('#cz-quote, [data-cz-quote]').forEach(mount); }
  window.CZQuote = {mount, boot};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
