// Descending sawtooth: 1 at t=0, −1 approaching t=1.
// For ascending ramp use triangle(t, 0).
export default function sawtooth(t) {
	t = ((t % 1) + 1) % 1
	return 1 - 2 * t
}
