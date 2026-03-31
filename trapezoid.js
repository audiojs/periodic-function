// Trapezoid wave. Generalizes square and triangle.
// p1: end of rise, p2: start of fall, p3: end of fall (all in [0,1]).
// square ≈ trapezoid(t, 0, 0.5, 0.5)
// triangle ≈ trapezoid(t, 0.5, 0.5, 1)
export default function trapezoid(t, p1 = 0.25, p2 = 0.5, p3 = 0.75) {
	t = ((t % 1) + 1) % 1
	if (t < p1) return p1 > 0 ? -1 + 2 * t / p1 : 1
	if (t < p2) return 1
	if (t < p3) return p3 > p2 ? 1 - 2 * (t - p2) / (p3 - p2) : -1
	return -1
}
