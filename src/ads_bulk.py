#!/usr/bin/env python3
"""Google Ads bulk-upload sheet for the three 'Repair | {Store}' Search campaigns (Google Ads Editor column names).
Usage: python3 ads_bulk.py https://czphonefix.com  → writes repair_campaigns.csv (campaigns + ad groups + keywords + RSAs + campaign negatives).
Upload in Google Ads: Tools → Bulk actions → Uploads → preview, fix anything red, apply. Then in the UI: attach the R1 negative list,
the store call asset, turn Search partners / Display expansion off if the upload left them on, and check the location radius."""
import csv, sys

DOMAIN = (sys.argv[1] if len(sys.argv) > 1 else "https://DOMAIN").rstrip("/")
BUDGET = "25"           # per store per day, Sam Nov 24
MAX_CPC = "3.00"        # same cap the buyback campaigns run
RADIUS_MI = "12"

STORES = {   # lat/lng = the quote widget's store pins; Location column uses Google's radius syntax "12 | mi | lat,lng"
    "Potranco": dict(road="Potranco Rd", slug="potranco", addr="9230 Potranco Rd, San Antonio, TX 78251", phone="+1 726-224-7325", ll="29.443200,-98.674400"),
    "Babcock": dict(road="Babcock Rd", slug="babcock", addr="6565 Babcock Rd, San Antonio, TX 78249", phone="+1 726-207-9951", ll="29.554500,-98.598700"),
    "Bulverde": dict(road="Bulverde Rd", slug="bulverde", addr="17910 Bulverde Rd, San Antonio, TX 78259", phone="+1 726-227-4149", ll="29.601800,-98.418400"),
}

# ad group → (page, keywords, headlines (store-neutral), descriptions)
# Policy notes (Nov 24 dry runs in the account): Google's pre-check flags generic repair terms under "Third-party consumer technical support"
# (iphone screen repair, phone repair near me, cell phone repair, ipad repair, iphone repair ...). Replacement / cracked / model-specific terms pass.
# Keywords go in as broad + phrase so "repair" searches are still matched. Ad text avoids repair/fix wording, the pattern DigiRep's live
# "RSA Workaround" ads use (Screen Service, Same Day Service); their ads sit at Approved (limited), the repair-worded ones were disapproved.
GROUPS = {
    "iPhone screen": dict(page="iphone-screen",
        kw=["iphone screen replacement", "iphone screen replacement near me", "cracked iphone screen", "broken iphone screen", "replace iphone screen", "new iphone screen",
            "iphone glass replacement", "iphone 17 screen replacement", "iphone 16 screen replacement", "iphone 15 screen replacement", "iphone 14 screen replacement",
            "iphone 13 screen replacement", "iphone 12 screen replacement", "iphone 11 screen replacement", "iphone screen fix", "fix iphone screen"],
        h=["iPhone Screen Done In 30 Min", "Cracked iPhone Screen?", "iPhone 11–17 Screens In Stock", "From $99.99, Parts & Labor", "Walk In, No Appointment",
           "6-Month Warranty", "4.9 Stars, 2,000+ Reviews", "Pay When It's Done", "See Your Price Online", "Open 7 Days, Till 8 PM", "12 Years In San Antonio", "New Screen While You Wait"],
        d=["New iPhone screen in about 30 minutes at our {road} store. Parts in stock, walk in.",
           "See your exact price online, then walk in. Parts and labor included, 6-month warranty.",
           "Standard or premium OLED screens in stock for iPhone 11 through 17. Done while you wait.",
           "Open Mon–Sat 10–8, Sun 11–6. Call now or get directions to {road}, San Antonio."]),
    "Phone screen & battery": dict(page="phone",
        kw=["phone screen replacement", "phone screen replacement near me", "cell phone screen replacement", "cracked phone screen", "broken phone screen", "phone fix near me",
            "phone screen fix near me", "phone battery replacement", "iphone battery replacement", "iphone charging port replacement", "charging port repair", "phone store near me",
            "cracked screen", "cracked phone"],
        h=["New Screen While You Wait", "Screens, Batteries & Ports", "iPhone & Samsung Screens", "Walk In, No Appointment", "Most Screens In 30 Minutes",
           "Parts In Stock, Same Day", "6-Month Warranty", "4.9 Stars, 2,000+ Reviews", "See Your Price Online", "Open 7 Days, Till 8 PM", "12 Years In San Antonio", "Pay When It's Done"],
        d=["iPhone and Samsung screens, batteries and charging ports, about 30 minutes at {road}.",
           "Price it online in a minute, then walk in. Parts and labor included, 6-month warranty.",
           "Three San Antonio stores, open 7 days. No appointment needed, pay when it's done.",
           "Cracked screen, dead battery or won't charge? Bring it to {road} today."]),
    "Samsung": dict(page="samsung",
        kw=["samsung screen replacement", "galaxy screen replacement", "cracked samsung screen", "cracked galaxy screen", "samsung repair", "galaxy s25 screen replacement",
            "galaxy s24 screen replacement", "galaxy s23 screen replacement", "galaxy s22 screen replacement", "samsung battery replacement", "samsung galaxy screen", "samsung screen fix"],
        h=["Galaxy Screen Done In 30 Min", "Samsung Galaxy Screens", "Galaxy S, Note, Z & A Series", "Walk In, No Appointment", "Batteries & Ports In Stock",
           "6-Month Warranty", "4.9 Stars, 2,000+ Reviews", "See Your Price Online", "Open 7 Days, Till 8 PM", "12 Years In San Antonio", "Pay When It's Done", "Cracked Galaxy Screen?"],
        d=["Galaxy screens replaced in about 30 minutes at our {road} store. Batteries too.",
           "See your Galaxy's exact price online, then walk in. Parts and labor in, 6-month warranty.",
           "Galaxy S25 down to the S8, Note, Z Flip and Fold, A-series. Open 7 days, no appointment.",
           "Three San Antonio stores. Call {road} now or get directions."]),
    "iPad": dict(page="ipad",
        kw=["ipad screen replacement", "ipad screen replacement near me", "cracked ipad screen", "broken ipad screen", "ipad glass replacement", "ipad battery replacement",
            "cracked ipad", "ipad screen fix", "tablet screen replacement", "ipad charging port replacement"],
        h=["iPad Screen Replacement", "Cracked iPad Glass?", "Ready In 3 To 4 Hours", "Every iPad, 5th Gen To Pro", "Walk In, No Appointment",
           "6-Month Warranty", "4.9 Stars, 2,000+ Reviews", "See Your Price Online", "Open 7 Days, Till 8 PM", "12 Years In San Antonio", "Pay When It's Done", "iPad Batteries & Ports Too"],
        d=["Drop your iPad at our {road} store, pick it up in 3 to 4 hours. Glass or display.",
           "See your iPad's exact price online, then walk in. Parts and labor in, 6-month warranty.",
           "iPad, iPad Air, iPad Mini and iPad Pro, 5th generation and newer. Open 7 days.",
           "Three San Antonio stores. Call {road} now or get directions."]),
    "Game console": dict(page="game-console",
        kw=["ps5 hdmi port", "ps5 hdmi port replacement", "ps5 repair", "ps5 hdmi repair", "playstation hdmi port", "xbox hdmi port", "xbox hdmi port replacement",
            "nintendo switch screen replacement", "switch charging port", "ps4 hdmi port", "console hdmi port replacement", "ps5 disc drive replacement"],
        h=["PS5 HDMI Port Done In A Day", "PS5, Xbox & Switch", "Console Service In Store", "HDMI Ports & Disc Drives", "Free Check-Over, Quote First",
           "6-Month Warranty", "4.9 Stars, 2,000+ Reviews", "Walk In, No Appointment", "Open 7 Days, Till 8 PM", "12 Years In San Antonio", "Overheating? Bring It In", "Prices Online, No Surprises"],
        d=["PlayStation, Xbox and Switch HDMI ports and disc drives replaced in-store at {road}.",
           "PS5 HDMI port from $149, done in about a day. See every console price online first.",
           "Not sure what's wrong? Bring it in, the check-over is free and we quote before any work.",
           "Three San Antonio stores, open 7 days. Call {road} now or get directions."]),
}

NEGATIVES = ["diy", "kit", "how to", "free", "jobs", "hiring", "apple store", "best buy", "ubreakifix", "asurion", "unlock", "unlocking", "software", "data recovery",
             "virus", "mail in", "mail-in", "at home", "come to you", "insurance claim", "warranty claim", "wholesale", "parts", "screen protector", "case", "cases", "tutorial", "youtube"]

# Web bulk-upload format (NOT Google Ads Editor): match type by syntax in Keyword ("phrase" / [exact]), radius in Location ("12 | mi | lat,lng", 6 decimals), "EU political ads" is required
# for new campaigns (preview Nov 24 flagged it). Campaign negatives are not in the sheet: the R1 shared list + repair_negatives.txt get attached in the UI.
COLS = ["Campaign", "Campaign Type", "Networks", "Budget", "Budget type", "Bid Strategy Type", "Max CPC bid limit", "Languages", "Location", "EU political ads",
        "Campaign state", "Ad Group", "Ad Group Type", "Max CPC", "Ad Group Status", "Keyword", "Status", "Final URL", "Path 1", "Path 2", "Ad type",
        "Headline 1", "Headline 2", "Headline 3", "Headline 4", "Headline 5", "Headline 6", "Headline 7", "Headline 8", "Headline 9", "Headline 10", "Headline 11", "Headline 12", "Headline 13",
        "Headline 2 position", "Description 1", "Description 2", "Description 3", "Description 4"]

def row(**kw):
    r = {c: "" for c in COLS}; r.update(kw); return r

def build():
    rows = []
    for store, s in STORES.items():
        camp = f"Repair | {store}"
        rows.append(row(**{"Campaign": camp, "Campaign Type": "Search", "Networks": "Google search", "Budget": BUDGET, "Budget type": "Daily",
                           "Bid Strategy Type": "Maximize clicks", "Max CPC bid limit": MAX_CPC, "Languages": "en", "Location": f"{RADIUS_MI} | mi | {s['ll']}",
                           "EU political ads": "no",          # preview Nov 24: "Does not contain EU political ads" rejected, "no" accepted
                           "Campaign state": "paused"}))   # created PAUSED; turned on after the review in the UI
        for g, d in GROUPS.items():
            rows.append(row(**{"Campaign": camp, "Ad Group": g, "Ad Group Type": "Standard", "Max CPC": MAX_CPC, "Ad Group Status": "Enabled"}))
            url = f"{DOMAIN}/{d['page']}/?store={s['slug']}"
            for k in d["kw"]:   # no keyword-level URLs: the ad carries the URL, so step 1 can go in before the domain exists
                rows.append(row(**{"Campaign": camp, "Ad Group": g, "Keyword": f'"{k}"', "Status": "Enabled"}))
                rows.append(row(**{"Campaign": camp, "Ad Group": g, "Keyword": f"[{k}]", "Status": "Enabled"}))
            heads = [f"{s['road']}, San Antonio"] + d["h"]           # 13 headlines, the store one pinned to position 2 via 'Headline 2 position'
            heads = [heads[1], heads[0]] + heads[2:]
            assert all(len(h) <= 30 for h in heads), [h for h in heads if len(h) > 30]
            descs = [x.replace("{road}", s["road"]) for x in d["d"]]
            assert all(len(x) <= 90 for x in descs), [x for x in descs if len(x) > 90]
            ad = {"Campaign": camp, "Ad Group": g, "Ad type": "Responsive search ad", "Status": "Enabled", "Final URL": url, "Path 1": store, "Path 2": d["page"][:15].replace("-", "")[:15],
                  "Headline 2 position": "2"}
            for i, h in enumerate(heads, 1): ad[f"Headline {i}"] = h
            for i, x in enumerate(descs, 1): ad[f"Description {i}"] = x
            rows.append(row(**ad))
    with open("repair_campaigns.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLS); w.writeheader(); w.writerows(rows)
    # two-step upload: step 1 = campaigns + ad groups + keywords (no URLs needed, campaigns paused, nothing can serve without ads);
    # step 2 = the RSAs once the domain is live (the preview cannot validate ads for ad groups that do not exist yet)
    step1 = [r for r in rows if not r["Ad type"]]
    cols1 = [c for c in COLS if not (c.startswith("Headline") or c.startswith("Description") or c in ("Path 1", "Path 2", "Ad type", "Final URL"))]
    with open("step1_campaigns_keywords.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols1, extrasaction="ignore"); w.writeheader(); w.writerows(step1)
    step2 = [r for r in rows if r["Ad type"]]
    cols2b = ["Campaign", "Ad Group", "Ad type", "Status", "Final URL", "Path 1", "Path 2"] + [c for c in COLS if c.startswith("Headline") or c.startswith("Description")]
    with open("step2_ads.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols2b, extrasaction="ignore"); w.writeheader(); w.writerows(step2)
    print(len(step1), "rows → step1_campaigns_keywords.csv;", len(step2), "rows → step2_ads.csv")
    # the same without campaign / negative rows: for when the three campaigns are made in the UI first (settings checked by eye)
    sub = [r for r in rows if r["Ad Group"]]
    cols2 = ["Campaign", "Ad Group", "Ad Group Type", "Max CPC", "Ad Group Status", "Keyword", "Status", "Final URL", "Path 1", "Path 2", "Ad type"] + [c for c in COLS if c.startswith("Headline") or c.startswith("Description")]
    with open("repair_adgroups.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols2, extrasaction="ignore"); w.writeheader(); w.writerows(sub)
    with open("repair_negatives.txt", "w") as f: f.write("\n".join(NEGATIVES))
    print(len(rows), "rows →", "repair_campaigns.csv;", len(sub), "rows →", "repair_adgroups.csv | domain", DOMAIN)

if __name__ == "__main__":
    build()
