const τ = Math.PI * 2

// Clausen function: Σ sin(kθ)/k², a smooth periodic ripple.
export default function clausen(t, harmonics = 10) {
	t = ((t % 1) + 1) % 1
	let v = 0
	for (let k = 1; k <= harmonics; k++) v += Math.sin(k * τ * t) / (k * k)
	return v
}
