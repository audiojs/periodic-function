// Dirac-like pulse: 1 at t=0, 0 elsewhere.
// width extends the high region as a fraction of period.
export default function pulse(t, width = 0) {
	t = ((t % 1) + 1) % 1
	return t <= width ? 1 : 0
}
