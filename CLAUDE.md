# Strides

Bobby's running log, replacing the "Running Tracksheet" Google Sheet. A PWA at https://strides.app.haddow.me. Each run has a route, date, distance, time, elevation gain and surface, and gets a score and a grade (🏆 A+ to 🚶 E). Bobby is the runner; Jon can sign in to check things.

## Worth knowing

- `src/lib/runs.ts` is the sheet's maths (score, grade, pace) and time/distance parsing: pure and unit tested, keep it that way. Scores are worked out on read, never stored.
- Distances are integer metres and times integer seconds.
- Bobby runs all over the world, so days are the phone's local date (`todayHere`), not UK days.
- Picking a known route on the form fills in its last distance, climb and surface.

## Review focus

The score formula matching the sheet, time parsing (`50:59`, `155:35`, `1:15:35`), and phone-width layout of the run form.
