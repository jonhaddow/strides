// Run maths: pace, score and grade, as in the old "Running Tracksheet".
// Pure, so it's unit tested; distances are metres and times seconds (integers).

export const SURFACES = ['Road', 'Track', 'Trail', 'Mixed', 'Technical'] as const;
export type Surface = (typeof SURFACES)[number];

/** Harder ground scores more for the same speed. */
const SURFACE_FACTOR: Record<Surface, number> = {
	Road: 1,
	Track: 1.02,
	Trail: 1.05,
	Mixed: 1.1,
	Technical: 1.2
};

/**
 * The sheet's score: (km/h ^ 1.5) / 2, plus a fifteenth for every 100 m climbed,
 * times the surface factor. About 20 is a good run.
 */
export function score(metres: number, seconds: number, climb: number, surface: Surface) {
	if (metres <= 0 || seconds <= 0) return 0;
	const kmh = metres / 1000 / (seconds / 3600);
	return (kmh ** 1.5 / 2) * (1 + climb / 1500) * SURFACE_FACTOR[surface];
}

export const GRADES = [
	{ min: 25, label: 'A+', emoji: '🏆' },
	{ min: 22.5, label: 'A', emoji: '🥇' },
	{ min: 19.5, label: 'B', emoji: '🥈' },
	{ min: 16.5, label: 'C', emoji: '🥉' },
	{ min: 13.5, label: 'D', emoji: '👟' },
	{ min: -Infinity, label: 'E', emoji: '🚶' }
] as const;

export type Grade = (typeof GRADES)[number];

export const grade = (s: number): Grade => GRADES.find((g) => s >= g.min)!;

/** Seconds per km. */
export const pace = (metres: number, seconds: number) =>
	metres > 0 ? (seconds * 1000) / metres : 0;

const pad = (n: number) => String(n).padStart(2, '0');

/** "50:59", or "1:15:35" from an hour. */
export function formatDuration(seconds: number) {
	const s = Math.round(seconds);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

/** "6:04" (per km). */
export const formatPace = (secondsPerKm: number) => formatDuration(secondsPerKm);

/** "8.41" km. */
export const formatKm = (metres: number) => (metres / 1000).toFixed(2);

/**
 * A time typed as "50:59" (minutes:seconds, minutes can pass 60), "1:15:35",
 * or plain minutes ("51"). Phone number pads have no colon, so "50.59",
 * "50,59" and "50 59" work too; seconds take two digits so "26.5" isn't
 * mistaken for 26:05. Null if it isn't one.
 */
export function parseDuration(text: string): number | null {
	const parts = text
		.trim()
		.replace(/\.(?=:)/g, '')
		.split(/[:.,\s]/);
	if (parts.length > 3 || !/^\d+$/.test(parts[0]) || parts.slice(1).some((p) => !/^\d\d$/.test(p)))
		return null;
	const n = parts.map(Number);
	if (n.slice(1).some((x) => x >= 60)) return null;
	const seconds = n.reduce((total, x) => total * 60 + x, 0) * (parts.length === 1 ? 60 : 1);
	return seconds > 0 ? seconds : null;
}

/** Km typed as "8.41" or "8,41", in whole metres. Null if it isn't a distance. */
export function parseKm(text: string): number | null {
	const km = Number(text.trim().replace(',', '.'));
	if (!Number.isFinite(km) || km <= 0 || km > 500) return null;
	return Math.round(km * 1000);
}
