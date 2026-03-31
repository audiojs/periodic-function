// Triangle wave. ratio = peak position (0 = ascending ramp, 1 = descending ramp, 0.5 = symmetric).
export default function triangle(t, ratio = 0.5) {
	t = ((t % 1) + 1) % 1
	if (t < ratio) return ratio > 0 ? 1 - 2 * t / ratio : -1
	return (1 - ratio) > 0 ? -1 + 2 * (t - ratio) / (1 - ratio) : 1
}
