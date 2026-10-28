// Days are YYYY-MM-DD text. Runs happen wherever the runner is, so "today"
// comes from the phone (see todayHere); the server only formats.

// Built once: making a formatter costs ~0.1 ms, and Workers' free plan allows
// about 10 ms of CPU per request.
const dayLabel = new Intl.DateTimeFormat('en-GB', {
	weekday: 'short',
	day: 'numeric',
	month: 'short',
	timeZone: 'UTC'
});
const monthLabel = new Intl.DateTimeFormat('en-GB', {
	month: 'long',
	year: 'numeric',
	timeZone: 'UTC'
});

/** A real YYYY-MM-DD date. */
export const isDay = (s: string) =>
	/^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(`${s}T00:00:00Z`).toJSON()?.startsWith(s) === true;

/** Today on this device, YYYY-MM-DD. */
export function todayHere(now = new Date()) {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** "Fri 16 Oct" for 2026-10-16. */
export const formatDay = (day: string) =>
	dayLabel.format(new Date(`${day}T12:00:00Z`)).replace(',', '');

/** "October 2026" for 2026-10. */
export const formatMonth = (month: string) => monthLabel.format(new Date(`${month}-15T12:00:00Z`));
