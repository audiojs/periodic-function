const τ = Math.PI * 2

// Cosine wave. Equivalent to sine(t, 0.25).
export default function cosine(t, phase = 0) {
	return Math.cos(τ * (t + phase))
}
