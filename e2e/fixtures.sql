-- Made-up data for the end-to-end tests.
INSERT INTO user (email, name) VALUES ('alex@example.com', 'Alex'), ('sam@example.com', 'Sam');
INSERT INTO run (day, route, metres, seconds, climb, surface, created_at) VALUES
	('2026-09-20', 'River loop', 5650, 1744, 118, 'Mixed', '2026-09-20T08:00:00.000Z'),
	('2026-10-01', 'Upper paddock', 3650, 1390, 89, 'Technical', '2026-10-01T08:00:00.000Z'),
	('2026-10-04', 'Valley extended', 8300, 2948, 119, 'Mixed', '2026-10-04T08:00:00.000Z'),
	('2026-10-06', 'Hut run/walk', 15930, 9335, 348, 'Technical', '2026-10-06T08:00:00.000Z'),
	-- Edited and deleted by runs.spec.ts.
	('2026-10-10', 'Spare run', 3000, 1080, 10, 'Road', '2026-10-10T08:00:00.000Z');
