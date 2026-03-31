// Linear interpolation between samples, treating them as one period.
export default function interpolate(t, samples) {
	t = ((t % 1) + 1) % 1
	let n = samples.length
	let ptr = t * n
	let lo = Math.floor(ptr), hi = (lo + 1) % n
	return samples[lo] + (samples[hi] - samples[lo]) * (ptr - lo)
}
