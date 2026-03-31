const τ = Math.PI * 2

// Sine wave. phase shifts the start point (0.25 = cosine).
export default function sine(t, phase = 0) {
	return Math.sin(τ * (t + phase))
}
