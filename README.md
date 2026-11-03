# Home Dashboard

An always-on wall dashboard for an iPad, hosted on GitHub Pages: clock, weather with
jacket/umbrella advice, live bus departures, the week's calendar, a to-do list and the
day's top news.

## How it works

| Panel | Source | Refresh |
|---|---|---|
| Weather and 7-day forecast | Open-Meteo (free, no key) | every 20 min |
| Next bus | transport.opendata.ch (live, with delays) | every minute |
| Calendar, to-do, news | `data.json`, refreshed by a scheduled job | page re-reads every 15 min |

## Privacy

GitHub Pages sites are public, so `data.json` is encrypted (AES-GCM, key from a passphrase
via PBKDF2). It holds all personal data, including the location, bus stop and screen
schedule. This page's code contains none of it. The passphrase is typed once on the iPad
and kept in its browser storage. `data.plain.json` is git-ignored and never committed.

## Screen

The page keeps the screen awake only during the on-hours set in the encrypted settings,
and shows a black screen otherwise. Set the iPad's Auto-Lock (and Guided Access's) to
2 minutes so it really sleeps. Buttons: switch today's day type, or stay on for an hour.
Tapping the black screen wakes it for 2 minutes.

## Updating data by hand

```
DASH_PASS="passphrase" node scripts/encrypt.mjs data.plain.json data.json
git add data.json && git commit -m "Refresh dashboard data" && git push
```
