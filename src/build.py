#!/usr/bin/env python3
"""Cellular Zone — Google Ads repair landing pages (static, own domain, GitHub Pages).

One template, one folder per job (/iphone-screen/, /phone/, /samsung/, /ipad/, /game-console/), the store picked by
?store=potranco|babcock|bulverde (PT/DZ/BV also work). Prices: the "from $" table is baked from the REPAIR PRICES - CZ sheet
(published tabs) at build time and refreshed in the browser from the same CSV the quote widget reads, so it never drifts
from the widget below it. Copy stays "local store, walk in, parts in stock" — no tech-support / software / unlock / data wording.

Usage: python3 build.py  → writes ./site/ (upload the folder as the repo root).
"""
import html, json, os, re, shutil

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site")
SHEET = "https://docs.google.com/spreadsheets/d/1_LCeGk23y5aZ_mT3Oej_6f1b9Zh9PhYuK8R5LlxaNkA/pub?single=true&output=csv&gid="
GIDS = {"apple": 510910333, "samsung": 1436859400, "consoles": 1693651162}
ADS_ID = "AW-796565164"
CALL_LABEL = "59QSCJSK270dEKy96vsC"      # 'Click to call (landing pages)' — the buyback pages fire the same one
QUOTE_LABEL = ""                         # 'Repair quote (landing pages)' — create the action in Google Ads, paste the label, rebuild
LEAD_ENDPOINT = "https://tdcekxznmfvwcuwokkba.supabase.co/functions/v1/web-lead"
IMG = "https://cellularzonesa.com/wp-content/uploads/2026/11/"

STORES = {
    "potranco": dict(key="PT", name="Potranco", road="Potranco Rd", area="151 / Alamo Ranch", addr="9230 Potranco Rd, Suite 105", city="San Antonio, TX 78251",
                     phone="726-224-7325", tel="+17262247325", landmark="next to Dunkin'", photo=IMG + "storefront-potranco.jpg", pos="50% 30%",
                     maps="https://www.google.com/maps/dir/?api=1&destination=Cellular+Zone+9230+Potranco+Rd+San+Antonio+TX"),
    "babcock": dict(key="DZ", name="Babcock", road="Babcock Rd", area="I-10 / De Zavala", addr="6565 Babcock Rd, Suite 7", city="San Antonio, TX 78249",
                    phone="726-207-9951", tel="+17262079951", landmark="off I-10 at De Zavala", photo=IMG + "storefront-babcock.jpg", pos="50% 48%",
                    maps="https://www.google.com/maps/dir/?api=1&destination=Cellular+Zone+6565+Babcock+Rd+San+Antonio+TX"),
    "bulverde": dict(key="BV", name="Bulverde", road="Bulverde Rd", area="1604 / Stone Oak", addr="17910 Bulverde Rd, Suite 106", city="San Antonio, TX 78259",
                     phone="726-227-4149", tel="+17262274149", landmark="next to Smoothie King", photo=IMG + "storefront-bulverde-crop.jpg", pos="50% 45%",
                     maps="https://www.google.com/maps/dir/?api=1&destination=Cellular+Zone+17910+Bulverde+Rd+San+Antonio+TX"),
}
HOURS = "Mon–Sat 10 AM–8 PM · Sun 11 AM–6 PM"

# ---- pages -------------------------------------------------------------------------------------------------------------
# table rows: (label shown, exact sheet model name, baked price from the sheet on Nov 24 2026). The browser re-reads the sheet.
PAGES = [
    dict(slug="iphone-screen", device="iphone", title="iPhone screen replacement · Cellular Zone San Antonio",
         eb="iPhone screen replacement", h1="Cracked iPhone screen? <em>Fixed in about 30 minutes.</em>",
         lede="Walk into our {road} store, grab a coffee, walk out with a new screen. iPhone 11 through 17 screens are on the shelf, so there is nothing to order and nothing to wait for.",
         time="About 30 minutes", stock=True, tbl_title="iPhone screen prices", tbl_sub="Glass-only price, for a phone whose display still works. Lines, spots or no picture: see your exact price below, it is usually $10 more.",
         tab="apple", section="APPLE iPHONE", col="GOOD Glass Only", alt_col="GOOD Aftermarket LCD",
         rows=[("iPhone 17 Pro Max", "iPhone 17 Pro Max", 139.99), ("iPhone 17", "iPhone 17", 119.99), ("iPhone 16 Pro Max", "iPhone 16 Pro Max", 129.99), ("iPhone 16", "iPhone 16", 99.99),
               ("iPhone 15 Pro Max", "iPhone 15 Pro Max", 99.99), ("iPhone 15", "iPhone 15", 99.99), ("iPhone 14", "iPhone 14", 99.99), ("iPhone 13", "iPhone 13", 99.99), ("iPhone 12", "iPhone 12 / 12 Pro", 99.99), ("iPhone 11", "iPhone 11", 99.99)],
         tiers="Every iPhone screen comes in three qualities. The price above is our standard screen. A premium OLED (brighter, deeper color) and a genuine Apple screen are on the shelf too; you pick at the counter.",
         faq=[("How long does an iPhone screen take?", "About 30 minutes for iPhone 11 and newer. Come in, pick the screen quality, and it is done while you wait."),
              ("Do I need an appointment?", "No. Walk in any time we are open, {hours}. If you would rather lock a time, the price tool above books one."),
              ("What if the display does not work at all?", "Pick “black spots, lines or touch issues” in the price tool and you will see the full-display price, usually about $10 more than glass only."),
              ("Is the price I see the price I pay?", "Yes, if the phone matches what you picked. Parts and labor are included and every screen carries a 6-month warranty."),
              ("Is my data safe?", "The screen swap does not touch what is on your phone. We ask you to know your passcode so we can test the new screen with you.")]),
    dict(slug="phone", device="", title="Phone screen & battery replacement · Cellular Zone San Antonio",
         eb="Phone screen & battery", h1="Phone broken? <em>Fixed today</em> at our {road} store.",
         lede="iPhone and Samsung screens, batteries and charging ports, done while you wait. Price it in a minute below, then walk in. No appointment needed.",
         time="Most phone repairs take about 30 minutes", stock=True, tbl_title="Popular phone repairs", tbl_sub="Starting prices, parts and labor included. Your exact model sets the real number; the price tool shows it in seconds.",
         tab="apple", section="APPLE iPHONE", col="GOOD Glass Only", alt_col=None,
         rows=[("iPhone 15 screen", "iPhone 15", 99.99), ("iPhone 14 screen", "iPhone 14", 99.99), ("iPhone 13 screen", "iPhone 13", 99.99), ("iPhone 12 screen", "iPhone 12 / 12 Pro", 99.99), ("iPhone 11 screen", "iPhone 11", 99.99)],
         rows2=dict(tab="samsung", section="SAMSUNG GALAXY S", col="Glass Only (display works)", rows=[("Galaxy S24 screen", "Galaxy S24", 189.99), ("Galaxy S23 screen", "Galaxy S23", 199.99), ("Galaxy S22 screen", "Galaxy S22", 209.99)]),
         rows3=dict(tab="apple", section="APPLE iPHONE", col="Battery", rows=[("iPhone 13 battery", "iPhone 13", 99.99), ("iPhone 12 battery", "iPhone 12 / 12 Pro", 99.99), ("iPhone 11 battery", "iPhone 11", 89.99)]),
         tiers="",
         faq=[("Which phones do you fix?", "Every iPhone from the 6 to the 17 Pro Max, Samsung Galaxy S, Note, A and Z series, Google Pixel and Motorola. Pick yours in the price tool to see the number."),
              ("How long will it take?", "Screens and batteries on iPhone and Samsung are about 30 minutes. Back glass and camera work can take a few hours; the tool tells you per repair."),
              ("Do you have the part in stock?", "iPhone screens, batteries and charging ports are stocked for every model we list. Samsung batteries and ports too. If something has to be ordered we tell you before you drive over."),
              ("Do I need an appointment?", "No, walk in any time, {hours}. You can also pick a time in the tool and we will have the part ready."),
              ("What is the warranty?", "6 months on parts and labor, every repair.")]),
    dict(slug="samsung", device="samsung", title="Samsung Galaxy screen replacement · Cellular Zone San Antonio",
         eb="Samsung Galaxy screens", h1="Galaxy screen cracked? <em>New screen in about 30 minutes.</em>",
         lede="Galaxy S, Note, Z and A series. Bring it to our {road} store and it is done while you wait; batteries and charging ports are stocked too.",
         time="About 30 minutes", stock=False, tbl_title="Samsung screen prices", tbl_sub="Glass-only price, for a phone whose display still works. Burn-in or a dead display costs a little more; the tool shows both.",
         tab="samsung", section="SAMSUNG GALAXY S", col="Glass Only (display works)", alt_col="Screen Replacement",
         rows=[("Galaxy S25 Ultra", "Galaxy S25 Ultra", 259.99), ("Galaxy S25", "Galaxy S25", 199.99), ("Galaxy S24 Ultra", "Galaxy S24 Ultra", 239.99), ("Galaxy S24", "Galaxy S24", 189.99),
               ("Galaxy S23 Ultra", "Galaxy S23 Ultra", 269.99), ("Galaxy S23", "Galaxy S23", 199.99), ("Galaxy S22 Ultra", "Galaxy S22 Ultra", 269.99), ("Galaxy S21", "Galaxy S21", 179.99)],
         tiers="Galaxy A-series screens start at $99 and Note screens at $179.99; every model we stock is in the price tool.",
         faq=[("How long does a Galaxy screen take?", "About 30 minutes for most Galaxy S and Note models once the screen is on the shelf. We confirm stock before you drive over."),
              ("Do I need an appointment?", "No, walk in any time, {hours}."),
              ("My screen works but has burn-in or ghost images.", "Pick that option in the tool, it is priced separately from a plain cracked glass."),
              ("What is the warranty?", "6 months on parts and labor, every repair.")]),
    dict(slug="ipad", device="ipad", title="iPad screen repair · Cellular Zone San Antonio",
         eb="iPad screen repair", h1="Cracked iPad glass? <em>Same-day repair</em> at our {road} store.",
         lede="Drop it off, pick it up in 3 to 4 hours. Every iPad from the 5th generation to the Pro 12.9, plus batteries and charging ports.",
         time="3 to 4 hours, same day when you drop off before 4 PM", stock=False, tbl_title="iPad glass prices", tbl_sub="Glass-only price, for an iPad whose display still works. A damaged LCD is priced separately in the tool.",
         tab="apple", section="APPLE iPAD", col="Glass Only (display works)", alt_col="LCD Replacement",
         rows=[("iPad 7th / 8th / 9th gen", "iPad 7th/8th/9th", 99.99), ("iPad 10th / 11th gen", "iPad 10th/11th", 109.99), ("iPad Air 4 / 5", "iPad Air 4/5", 249.99), ("iPad Pro 11 (1st / 2nd gen)", "iPad Pro 11 1st/2nd Gen", 209.99),
               ("iPad Pro 11 (3rd / 4th gen)", "iPad Pro 11 3rd/4th Gen", 229.99), ("iPad Mini 5", "iPad Mini 5", 169.99), ("iPad Mini 6", "iPad Mini 6", 319.99), ("iPad Air 3", "iPad Air 3", 189.99)],
         tiers="",
         faq=[("How long does an iPad screen take?", "3 to 4 hours. The glass is bonded to the frame and has to cure, so most people drop off and come back after lunch or the next morning."),
              ("Which generation is my iPad?", "Settings → General → About → Model Name, or the small model number on the back (starts with A). The price tool lists both."),
              ("Do I need an appointment?", "No, walk in any time, {hours}."),
              ("What is the warranty?", "6 months on parts and labor, every repair.")]),
    dict(slug="game-console", device="console", title="PS5, Xbox & Switch repair · Cellular Zone San Antonio",
         eb="Game console repair", h1="PS5 won’t show a picture? <em>HDMI port fixed in about a day.</em>",
         lede="PlayStation, Xbox and Nintendo Switch repaired in-store at our {road} shop: HDMI ports, disc drives, overheating and cleaning. Free check-over if you are not sure what is wrong.",
         time="HDMI ports about a day; most console work 1 to 3 days", stock=False, tbl_title="Console repair prices", tbl_sub="Parts and labor included. Not sure what is wrong? Bring it in, the diagnosis is free and we quote before any work.",
         tab="consoles", section="Consoles", col="HDMI Port / Charging Port", alt_col=None,
         rows=[("PlayStation 5 HDMI port", "PlayStation 5", 149), ("PlayStation 4 HDMI port", "PlayStation 4", 119), ("PS4 Pro / Slim HDMI port", "PS4 Pro/ Slim", 129), ("Xbox Series X HDMI port", "XBOX Series X", 149),
               ("Xbox Series S HDMI port", "XBOX Series S", 139), ("Xbox One / One S HDMI port", "XBOX One / One S", 119), ("Switch HDMI / charging port", "Switch / Switch Lite", 119), ("Switch OLED HDMI / charging port", "Switch OLED", 149)],
         rows2=dict(tab="consoles", section="Consoles", col="Disk Drive / Game Reader", rows=[("PS5 disc drive", "PlayStation 5", "169 - 179"), ("Xbox Series X disc drive", "XBOX Series X", 139), ("Switch game reader", "Switch / Switch Lite", 99)]),
         tiers="Overheating, loud fans and shut-offs are usually a cleaning and new thermal paste; the tool prices those too.",
         faq=[("How long does a console take?", "HDMI ports are usually done the next day. Disc drives and overheating work run 1 to 3 days depending on parts."),
              ("Do I need an appointment?", "No, drop it off any time, {hours}. Bring the console only, no cables or controllers needed."),
              ("What if you are not sure what is wrong?", "Drop it off, the check-over is free, and we text you a price before any work starts."),
              ("What is the warranty?", "6 months on parts and labor, every repair.")]),
]

# ---- template ----------------------------------------------------------------------------------------------------------
CSS = r"""
:root{--bg:#F3F5F8;--surface:#fff;--surface-2:#E9EEF4;--fg:#0F1B2D;--muted:#5A6B7F;--line:#D5DDE6;--band:#0F1B2D;--band-2:#16263D;--band-ink:#fff;--band-muted:#B7C3D1;--band-line:rgba(255,255,255,.16);
--brand:#1A8CE0;--brand-ink:#fff;--brand-bg:#E3F1FC;--brand-soft:#5FB8FF;--cta:#FFC72C;--cta-ink:#15202B;--cta-deep:#F2B800;--hero-bg:#F2F5F9;--hero-glow:rgba(26,140,224,.14);--ok:#1D8A4E;--ok-bg:#E6F5EC;
--display:"Barlow Condensed","Arial Narrow",Impact,sans-serif;--body:"Barlow","Helvetica Neue",Arial,sans-serif;--shadow:0 14px 40px rgba(15,27,45,.16);--radius:16px;color-scheme:light}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 var(--body);-webkit-font-smoothing:antialiased;padding-bottom:84px}
@media(min-width:900px){body{padding-bottom:0}}
a{color:inherit}button{font:inherit;color:inherit}img{max-width:100%;display:block}
h1,h2,h3{font-family:var(--display);line-height:1.04;margin:0;text-wrap:balance;letter-spacing:.005em}
.wrap{max-width:1080px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.eyebrow{font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:13px;color:var(--brand)}
.top{position:sticky;top:0;z-index:9;background:var(--band);color:var(--band-ink);border-bottom:1px solid var(--band-line)}
.top .wrap{display:flex;align-items:center;gap:12px;padding-block:10px}
.brand{font-family:var(--display);font-weight:800;font-size:22px;letter-spacing:.05em;text-transform:uppercase;display:flex;align-items:center;gap:9px;text-decoration:none;white-space:nowrap;min-width:0}
.brand i{display:inline-block;width:10px;height:22px;background:var(--cta);transform:skewX(-14deg);border-radius:2px}
.status{font-size:13px;color:var(--band-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1}
.status b{color:#7CE0A6;font-weight:700}.status b.closed{color:#FFB4A8}
.call{margin-left:auto;flex:none;background:var(--cta);color:var(--cta-ink);border:0;border-radius:999px;padding:9px 14px;font-weight:700;text-decoration:none;white-space:nowrap;font-size:15px;display:inline-flex;gap:8px;align-items:center}
.call svg{width:16px;height:16px}
.hero{background:var(--hero-bg);padding-block:26px 40px;border-bottom:1px solid var(--line);background-image:radial-gradient(760px 340px at 88% -30%,var(--hero-glow),transparent 65%)}
.hero .wrap{display:grid;gap:22px;grid-template-columns:minmax(0,1fr)}
@media(min-width:900px){.hero .wrap{grid-template-columns:minmax(0,1.1fr) minmax(360px,.9fr);column-gap:40px;align-items:center}}
.hero h1{font-size:clamp(36px,6.2vw,58px);font-weight:800;margin-top:8px}
.hero h1 em{font-style:normal;color:var(--brand)}
.lede{font-size:17px;color:var(--muted);max-width:42ch;margin:12px 0 0;line-height:1.45}
.trust{display:flex;flex-wrap:wrap;gap:6px 0;margin:16px 0 0;padding:0;list-style:none;font-size:14px;font-weight:500}
.trust li{display:flex;align-items:center}.trust li+li::before{content:"";width:4px;height:4px;border-radius:50%;background:var(--brand);margin:0 10px}
.trust b{color:var(--brand);font-weight:700;margin-right:4px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.chips a{text-decoration:none;font-size:14px;font-weight:600;border:1.5px solid var(--line);background:var(--surface);border-radius:999px;padding:8px 13px;color:var(--fg)}
.chips a[aria-current="true"]{background:var(--brand);border-color:var(--brand);color:#fff}
.ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.btn{border:0;border-radius:12px;padding:14px 18px;font-weight:700;font-size:16px;cursor:pointer;background:var(--cta);color:var(--cta-ink);display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none}
.btn:hover{background:var(--cta-deep)}.btn.ghost{background:var(--surface);border:1.5px solid var(--line);color:var(--fg)}.btn.ghost:hover{background:var(--surface-2)}
.btn svg{width:18px;height:18px}
.herophoto{margin:0;position:relative;border-radius:var(--radius);overflow:hidden;background:var(--surface-2);box-shadow:var(--shadow)}
.herophoto img{width:100%;height:auto;aspect-ratio:4/3;object-fit:cover}
.storecard{position:absolute;left:0;right:0;bottom:0;padding:34px 14px 14px;color:#fff;background:linear-gradient(to top,rgba(10,18,30,.92),rgba(10,18,30,.55) 55%,transparent);display:flex;align-items:flex-end;gap:12px}
.storecard div{min-width:0;flex:1}.storecard b{font-family:var(--display);font-size:20px;display:block;line-height:1.1}
.storecard span{display:block;font-size:13px;color:#D7DEE7;margin-top:2px}.storecard b span.inl{display:inline;font-size:inherit;color:inherit;margin:0}
.storecard a{flex:none;font-size:13px;font-weight:700;text-decoration:none;border:1.5px solid rgba(255,255,255,.55);border-radius:999px;padding:7px 12px;color:#fff;background:rgba(10,18,30,.35)}
section{padding-block:40px}section.alt{background:var(--surface);border-block:1px solid var(--line)}
.sec-h{margin-bottom:18px}.sec-h h2{font-size:clamp(28px,4.6vw,40px);font-weight:800;margin-top:6px}.sec-h p{color:var(--muted);margin:8px 0 0;max-width:60ch}
.pricecard{background:var(--band);color:var(--band-ink);border-radius:var(--radius);padding:18px;background-image:radial-gradient(520px 200px at 80% -40%,rgba(26,140,224,.35),transparent 70%);box-shadow:var(--shadow)}
@media(min-width:720px){.pricecard{padding:26px}}
.from{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
.from .num{font-family:var(--display);font-weight:800;font-size:clamp(46px,10vw,72px);line-height:1;color:var(--cta);font-variant-numeric:tabular-nums}
.from .num small{font-size:.42em;color:var(--band-ink);font-weight:700;letter-spacing:.02em;margin-right:6px}
.from .meta{color:var(--band-muted);font-size:14px}
table{width:100%;border-collapse:collapse;margin-top:14px;font-variant-numeric:tabular-nums}
td,th{padding:10px 4px;border-top:1px solid var(--band-line);text-align:left;font-size:15.5px}
th{font-family:var(--display);font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:12px;color:var(--band-muted);border-top:0;padding-top:0}
td:last-child,th:last-child{text-align:right;white-space:nowrap}td:last-child{font-weight:700;color:#fff}
.tblnote{color:var(--band-muted);font-size:13px;margin:12px 0 0}
.perks{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.perk{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.1);color:#fff}
.perk.ok{background:rgba(29,138,78,.35)}
.steps{display:grid;gap:14px;grid-template-columns:1fr}@media(min-width:720px){.steps{grid-template-columns:repeat(3,1fr)}}
.step{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px}
.step i{font-family:var(--display);font-weight:800;font-size:32px;color:var(--brand);font-style:normal;line-height:1}
.step h3{font-size:20px;margin-top:6px}.step p{color:var(--muted);margin:6px 0 0;font-size:15px}
.widgetbox{background:#DCE5EF;border:1px solid #C3D0DE;border-top:4px solid var(--brand);border-radius:18px;padding:14px;box-shadow:var(--shadow)}
@media(min-width:720px){.widgetbox{padding:22px}}
.store{display:grid;gap:18px;align-items:center;grid-template-columns:1fr}@media(min-width:800px){.store{grid-template-columns:1fr 1fr}}
.store img{border-radius:var(--radius);aspect-ratio:4/3;object-fit:cover;width:100%;box-shadow:var(--shadow)}
.store h3{font-size:28px}.store p{margin:6px 0 0;color:var(--muted)}.store .big{font-family:var(--display);font-size:30px;font-weight:800;color:var(--fg);text-decoration:none;display:inline-block;margin-top:10px}
.others{margin-top:22px;display:grid;gap:10px;grid-template-columns:1fr}@media(min-width:720px){.others{grid-template-columns:1fr 1fr}}
.others a{display:flex;justify-content:space-between;gap:10px;align-items:center;text-decoration:none;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;font-size:15px}
.others a b{font-family:var(--display);font-size:18px}.others a span{color:var(--muted);font-size:13px}
.faq details{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:0 16px;margin-top:8px}
.faq summary{cursor:pointer;font-weight:600;padding:14px 0;list-style:none;display:flex;justify-content:space-between;gap:12px}
.faq summary::after{content:"+";font-family:var(--display);font-size:22px;color:var(--brand);line-height:1}
.faq details[open] summary::after{content:"–"}.faq details p{margin:0 0 14px;color:var(--muted)}
footer{padding:28px 0 40px;color:var(--muted);font-size:13px}footer p{margin:6px 0}
.bar{position:fixed;left:0;right:0;bottom:0;z-index:8;background:var(--surface);border-top:1px solid var(--line);padding:10px max(12px,env(safe-area-inset-right,0px)) calc(10px + env(safe-area-inset-bottom,0px)) max(12px,env(safe-area-inset-left,0px));display:flex;gap:10px}
.bar .btn{flex:1;padding:13px 10px;font-size:15px}@media(min-width:900px){.bar{display:none}}
.skip{position:absolute;left:-9999px}.skip:focus{left:16px;top:16px;z-index:99;background:#fff;padding:8px 12px;border-radius:8px}
"""

ICON_CALL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.6 3.5h2.9l1.4 4.3-2 1.4a12 12 0 0 0 5.9 5.9l1.4-2 4.3 1.4v2.9a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/></svg>'
ICON_TAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>'

def esc(s): return html.escape(str(s), quote=True)
def usd(v):
    if isinstance(v, str): return "$" + v.replace(" - ", "–").replace("-", "–")
    return "$" + (f"{v:,.2f}".rstrip("0").rstrip(".") if v != int(v) else f"{int(v):,}")

def table_rows(spec):
    out = []
    for label, model, price in spec["rows"]:
        out.append(f'<tr><td>{esc(label)}</td><td data-tab="{spec["tab"]}" data-section="{esc(spec["section"])}" data-col="{esc(spec["col"])}" data-model="{esc(model)}">{usd(price)}</td></tr>')
    return "\n".join(out)

def page_html(p):
    first = p["rows"][0]
    low = min(r[2] for r in p["rows"] if not isinstance(r[2], str))
    extra_tables = ""
    for k in ("rows2", "rows3"):
        if p.get(k): extra_tables += table_rows(p[k]) + "\n"
    faq = "\n".join(f'<details><summary>{esc(q)}</summary><p>{esc(a.replace("{hours}", HOURS))}</p></details>' for q, a in p["faq"])
    perks = f'<span class="perk">{esc(p["time"])}</span><span class="perk">6-month warranty</span>' + ('<span class="perk ok">Parts in stock</span>' if p["stock"] else '') + '<span class="perk">Walk-ins welcome</span>'
    device_attr = f' data-device="{p["device"]}"' if p["device"] else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>{esc(p["title"])}</title>
<meta name="description" content="{esc(p["eb"])} at Cellular Zone, San Antonio. Three stores, walk in any time, 6-month warranty.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230F1B2D'/%3E%3Cpath d='M11 6h8l-4 20h-8z' fill='%23FFC72C'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500;600;700&display=swap">
<style>{CSS}</style>
<script async src="https://www.googletagmanager.com/gtag/js?id={ADS_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','{ADS_ID}');</script>
</head>
<body>
<a class="skip" href="#price">Skip to the price tool</a>
<header class="top"><div class="wrap">
  <a class="brand" href="./" data-keep><i></i><span>Cellular Zone</span></a>
  <span class="status" id="status"></span>
  <a class="call" id="callTop" href="tel:" data-call>{ICON_CALL}<span>Call <span data-store-name></span></span></a>
</div></header>

<main>
<div class="hero"><div class="wrap">
  <div class="copy">
    <span class="eyebrow">{esc(p["eb"])} · <span data-store-road></span> · San Antonio</span>
    <h1>{p["h1"].replace("{road}", '<span data-store-road></span>')}</h1>
    <p class="lede">{p["lede"].replace("{road}", '<span data-store-road></span>')}</p>
    <ul class="trust"><li><b>4.9★</b> 2,000+ Google reviews</li><li>12 years in San Antonio</li><li>6-month warranty</li><li>Pay when it’s fixed</li></ul>
    <div class="chips" id="chips" aria-label="Pick your store">
      <a href="?store=potranco" data-store-link="potranco">Potranco Rd · 151</a>
      <a href="?store=babcock" data-store-link="babcock">Babcock Rd · I-10</a>
      <a href="?store=bulverde" data-store-link="bulverde">Bulverde Rd · 1604</a>
    </div>
    <div class="ctas">
      <a class="btn" href="tel:" data-call>{ICON_CALL}Call <span data-store-name></span> · <span data-store-phone></span></a>
      <a class="btn ghost" href="#price">{ICON_TAG}See my exact price</a>
    </div>
  </div>
  <figure class="herophoto"><img id="heroImg" src="" alt="" width="800" height="600" loading="eager" fetchpriority="high">
    <figcaption class="storecard"><div><b>Cellular Zone <span class="inl" data-store-name></span> Rd</b><span data-store-addr></span><span>{HOURS}</span></div><a href="#" data-maps target="_blank" rel="noopener">Directions</a></figcaption></figure>
</div></div>

<section id="prices"><div class="wrap">
  <div class="pricecard">
    <div class="from"><span class="num"><small>FROM</small><span id="fromPrice">{usd(low)}</span></span><span class="meta">{esc(p["tbl_title"])} · parts and labor included · same price at all three stores</span></div>
    <table><thead><tr><th>Repair</th><th>Price</th></tr></thead><tbody>
{table_rows(p)}
{extra_tables}</tbody></table>
    <p class="tblnote">{esc(p["tbl_sub"])}</p>
    <div class="perks">{perks}</div>
  </div>
</div></section>

<section class="alt" id="price"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Your exact price</span><h2>Pick your model, see the number.</h2><p>Same prices our counter uses, updated live. No phone number needed to see it. Text it to yourself or book a time if you want.</p></div>
  <div class="widgetbox"><div id="cz-quote"{device_attr}></div></div>
</div></section>

<section><div class="wrap">
  <div class="sec-h"><span class="eyebrow">How it works</span><h2>Three steps. One trip.</h2></div>
  <div class="steps">
    <div class="step"><i>1</i><h3>Price it here</h3><p>Pick your model and what is wrong. The price includes the part, the labor and a 6-month warranty.</p></div>
    <div class="step"><i>2</i><h3>Walk in</h3><p>Come to <span data-store-name></span> Rd any time we are open, or pick a time in the tool. {esc(p["time"])}.</p></div>
    <div class="step"><i>3</i><h3>Test it, then pay</h3><p>A tech tests the repair with you at the counter. You pay when it is fixed, not before.</p></div>
  </div>
  {('<p class="tblnote" style="color:var(--muted);margin-top:18px;max-width:70ch">' + esc(p["tiers"]) + '</p>') if p["tiers"] else ''}
</div></section>

<section class="alt" id="store"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Where to bring it</span><h2>Cellular Zone <span data-store-name></span> Rd</h2></div>
  <div class="store">
    <img id="storeImg" src="" alt="" width="800" height="600" loading="lazy">
    <div>
      <h3><span data-store-addr></span></h3>
      <p><span data-store-city></span> · <span data-store-landmark></span></p>
      <p>{HOURS}</p>
      <a class="big" href="tel:" data-call><span data-store-phone></span></a>
      <div class="ctas"><a class="btn" href="tel:" data-call>{ICON_CALL}Call now</a><a class="btn ghost" href="#" data-maps target="_blank" rel="noopener">Directions</a></div>
    </div>
  </div>
  <div class="others" id="others"></div>
</div></section>

<section class="faq"><div class="wrap">
  <div class="sec-h"><span class="eyebrow">Questions</span><h2>Before you come in</h2></div>
  {faq}
</div></section>
</main>

<footer><div class="wrap">
  <p><b>Cellular Zone</b> · Potranco Rd · Babcock Rd · Bulverde Rd · San Antonio, TX · {HOURS}</p>
  <p>Independent repair shop. Not affiliated with Apple Inc., Samsung, Sony, Microsoft or Nintendo. Teachers and first responders get $5 off any repair.</p>
</div></footer>

<div class="bar"><a class="btn" href="tel:" data-call>{ICON_CALL}Call <span data-store-name></span></a><a class="btn ghost" href="#price">{ICON_TAG}My price</a></div>

<script>
(function(){{
'use strict';
var STORES={json.dumps({k: {kk: vv for kk, vv in v.items()} for k, v in STORES.items()})};
var ALIAS={{PT:'potranco',DZ:'babcock',BV:'bulverde',POTRANCO:'potranco',BABCOCK:'babcock',DEZAVALA:'babcock',BULVERDE:'bulverde'}};
var qs=new URLSearchParams(location.search);
var raw=(qs.get('store')||'').toUpperCase();
var key=STORES[raw.toLowerCase()]?raw.toLowerCase():(ALIAS[raw]||'potranco');
var S=STORES[key];
/* fill every store-bound element */
var set=function(sel,fn){{document.querySelectorAll(sel).forEach(fn);}};
set('[data-store-name]',function(e){{e.textContent=S.name;}});
set('[data-store-road]',function(e){{e.textContent=S.road;}});
set('[data-store-addr]',function(e){{e.textContent=S.addr;}});
set('[data-store-city]',function(e){{e.textContent=S.city;}});
set('[data-store-landmark]',function(e){{e.textContent=S.landmark;}});
set('[data-store-phone]',function(e){{e.textContent=S.phone;}});
set('a[data-call]',function(a){{a.href='tel:'+S.tel;}});
set('a[data-maps]',function(a){{a.href=S.maps;}});
set('[data-store-link]',function(a){{var on=a.dataset.storeLink===key;a.setAttribute('aria-current',on?'true':'false');}});
document.getElementById('heroImg').src=S.photo;document.getElementById('heroImg').alt='Cellular Zone '+S.name+' Rd storefront';document.getElementById('heroImg').style.objectPosition=S.pos;
document.getElementById('storeImg').src=S.photo;document.getElementById('storeImg').alt='Cellular Zone '+S.name+' Rd storefront';document.getElementById('storeImg').style.objectPosition=S.pos;
document.title=document.title.replace('San Antonio',S.road+', San Antonio');
/* keep ?store= (and ad params) on the store chips and internal links */
var keep=['gclid','gbraid','wbraid','utm_source','utm_medium','utm_campaign','utm_term','utm_content'].filter(function(k){{return qs.get(k);}});
set('[data-store-link]',function(a){{var u=new URLSearchParams();u.set('store',a.dataset.storeLink);keep.forEach(function(k){{u.set(k,qs.get(k));}});a.href=location.pathname+'?'+u.toString();}});
/* other stores */
var oth=document.getElementById('others');
Object.keys(STORES).filter(function(k){{return k!==key;}}).forEach(function(k){{var o=STORES[k];var a=document.createElement('a');var u=new URLSearchParams();u.set('store',k);keep.forEach(function(x){{u.set(x,qs.get(x));}});a.href=location.pathname+'?'+u.toString();a.innerHTML='<span><b>'+o.name+' Rd</b><br><span>'+o.addr+' · '+o.area+'</span></span><span>'+o.phone+'</span>';oth.appendChild(a);}});
/* open / closed */
(function(){{try{{var now=new Date(new Date().toLocaleString('en-US',{{timeZone:'America/Chicago'}}));var d=now.getDay(),h=now.getHours()+now.getMinutes()/60;var open=d===0?11:10,close=d===0?18:20;var el=document.getElementById('status');
if(h>=open&&h<close){{el.innerHTML='<b>Open now</b> · closes '+(close===18?'6 PM':'8 PM')+' · '+S.road;}}else{{var nd=(h>=close)?(d+1)%7:d;el.innerHTML='<b class="closed">Closed</b> · opens '+(nd===0?'11 AM':'10 AM')+(h>=close?' tomorrow':'')+' · '+S.road;}}}}catch(e){{}}}})();
/* conversions: click to call */
document.addEventListener('click',function(e){{var a=e.target&&e.target.closest?e.target.closest('a[href^="tel:"]'):null;if(!a)return;
try{{window.dataLayer=window.dataLayer||[];window.dataLayer.push({{event:'click_to_call',call_store:S.key,page:'{p["slug"]}'}});
if(typeof gtag==='function'){{gtag('event','conversion',{{send_to:'{ADS_ID}/{CALL_LABEL}',value:1,currency:'USD'}});}}}}catch(x){{}}}},true);
/* quote widget config: the ad-tracked store numbers, store preselected */
window.CZ_QUOTE_CONFIG={{endpoint:'{LEAD_ENDPOINT}',hide:['computer','other'],stores:{{
  PT:{{name:'Potranco',addr:'9230 Potranco Rd #105',city:'San Antonio, TX 78251',phone:'7262247325',lat:29.4432,lng:-98.6744}},
  DZ:{{name:'Babcock',addr:'6565 Babcock Rd',city:'San Antonio, TX 78249',phone:'7262079951',lat:29.5545,lng:-98.5987}},
  BV:{{name:'Bulverde',addr:'17910 Bulverde Rd Suite 106',city:'San Antonio, TX 78259',phone:'7262274149',lat:29.6018,lng:-98.4184}}}}}};
document.getElementById('cz-quote').dataset.store=S.key;
/* the widget's lead → Google Ads conversion (label filled once the action exists) */
var QUOTE_LABEL='{QUOTE_LABEL}';
var origPush=window.dataLayer.push;window.dataLayer.push=function(){{var r=origPush.apply(this,arguments);try{{var ev=arguments[0];if(ev&&ev.event==='generate_lead'&&QUOTE_LABEL&&typeof gtag==='function'){{gtag('event','conversion',{{send_to:'{ADS_ID}/'+QUOTE_LABEL,value:ev.value||0,currency:'USD'}});}}}}catch(x){{}}return r;}};
/* live prices: re-read the same published sheet the widget uses; the baked numbers stay if anything fails */
(function(){{var cells=[].slice.call(document.querySelectorAll('td[data-model]'));if(!cells.length)return;
var GIDS={json.dumps(GIDS)};var SHEET='{SHEET}';
function parse(s){{var rows=[],row=[],f='',q=false;for(var i=0;i<s.length;i++){{var c=s[i];if(q){{if(c==='"'){{if(s[i+1]==='"'){{f+='"';i++;}}else q=false;}}else f+=c;}}else if(c==='"')q=true;else if(c===','){{row.push(f);f='';}}else if(c==='\\n'){{row.push(f);rows.push(row);row=[];f='';}}else if(c!=='\\r')f+=c;}}if(f||row.length){{row.push(f);rows.push(row);}}return rows;}}
var norm=function(s){{return String(s||'').replace(/\\s+/g,' ').trim().toLowerCase();}};
var money=function(v){{var m=String(v||'').replace(/,/g,'').match(/\\$?\\s*(\\d+(?:\\.\\d+)?)(?:\\s*-\\s*\\$?\\s*(\\d+(?:\\.\\d+)?))?/);if(!m)return null;var a=+m[1];var b=m[2]?+m[2]:null;var f=function(n){{return '$'+(n%1?n.toFixed(2):String(n));}};return b?f(a)+'–'+f(b):f(a);}};
var tabs={{}};cells.forEach(function(td){{tabs[td.dataset.tab]=true;}});
var low=null;
Promise.all(Object.keys(tabs).map(function(t){{return fetch(SHEET+GIDS[t],{{cache:'no-store'}}).then(function(r){{if(!r.ok)throw 0;return r.text();}}).then(function(csv){{var rows=parse(csv);
  cells.filter(function(td){{return td.dataset.tab===t;}}).forEach(function(td){{var sec=norm(td.dataset.section),col=norm(td.dataset.col),model=norm(td.dataset.model);var i=0;
    for(;i<rows.length;i++){{if(norm(rows[i][0])===sec)break;}}if(i>=rows.length)return;
    var hi=-1,hdr=null;for(var j=i;j<Math.min(i+4,rows.length);j++){{if(norm(rows[j][0])==='model'){{hdr=rows[j].map(norm);hi=j;break;}}}}if(!hdr)return;
    var ci=hdr.indexOf(col);if(ci<0)return;
    for(var k=hi+1;k<rows.length;k++){{if(!norm(rows[k][0]))break;if(norm(rows[k][0])===model){{var p=money(rows[k][ci]);if(p){{td.textContent=p;var n=parseFloat(p.replace(/[^0-9.]/g,''));if(n&&(low===null||n<low))low=n;}}break;}}}}
  }});}}).catch(function(){{}});}})).then(function(){{if(low!==null){{var el=document.getElementById('fromPrice');if(el)el.textContent='$'+(low%1?low.toFixed(2):low);}}}});
}})();
}})();
</script>
<script src="../quote.js" defer></script>
</body>
</html>
"""

INDEX = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Cellular Zone · San Antonio</title>
<style>body{font-family:Barlow,Arial,sans-serif;background:#F3F5F8;color:#0F1B2D;margin:0;padding:40px 16px}main{max-width:620px;margin:0 auto}h1{font-size:28px}a{display:block;background:#fff;border:1px solid #D5DDE6;border-radius:12px;padding:14px 16px;margin-top:10px;text-decoration:none;color:inherit;font-weight:600}a:hover{border-color:#1A8CE0}p{color:#5A6B7F}</style></head>
<body><main><h1>Cellular Zone repair · San Antonio</h1><p>Pick what needs fixing. Three stores: Potranco Rd, Babcock Rd, Bulverde Rd.</p>
__LINKS__
<p style="margin-top:24px;font-size:13px">Main site: <a href="https://cellularzonesa.com" style="display:inline;border:0;padding:0;background:none">cellularzonesa.com</a></p></main></body></html>
"""

def main():
    if os.path.isdir(OUT): shutil.rmtree(OUT)
    os.makedirs(OUT)
    for p in PAGES:
        d = os.path.join(OUT, p["slug"]); os.makedirs(d)
        with open(os.path.join(d, "index.html"), "w") as f: f.write(page_html(p))
    links = "\n".join(f'<a href="{p["slug"]}/?store=potranco">{esc(p["eb"])}</a>' for p in PAGES)
    with open(os.path.join(OUT, "index.html"), "w") as f: f.write(INDEX.replace("__LINKS__", links))
    with open(os.path.join(OUT, "robots.txt"), "w") as f: f.write("User-agent: *\nDisallow: /\n")
    with open(os.path.join(OUT, "404.html"), "w") as f: f.write(INDEX.replace("__LINKS__", links).replace("<h1>Cellular Zone repair", "<h1>Page not found — Cellular Zone repair"))
    with open(os.path.join(OUT, ".nojekyll"), "w") as f: f.write("")
    # the quote widget (same build as cellularzonesa.com), with the landing-page tweak: CFG.hide hides device tiles
    src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "quote.js")).read()
    patched = src.replace("DEVICES.filter(d => catsFor(d.k).length)", "DEVICES.filter(d => catsFor(d.k).length && !(CFG.hide || []).includes(d.k))")
    assert patched != src, "quote.js device filter not found"
    with open(os.path.join(OUT, "quote.js"), "w") as f: f.write(patched)
    print("built", [p["slug"] for p in PAGES], "→", OUT)

if __name__ == "__main__":
    main()
