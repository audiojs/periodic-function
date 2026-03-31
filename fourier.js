const τ = Math.PI * 2

// Fourier series: evaluate one sample at phase t.
// x(t) = Σ[ real[k]·cos(2πkt) + imag[k]·sin(2πkt) ]
// k=0 is DC offset, k=1 is fundamental, k=2 is first harmonic, etc.
export default function fourier(t, real, imag) {
	let nr = real?.length || 0, ni = imag?.length || 0
	let n = Math.max(nr, ni), v = 0
	for (let k = 0; k < n; k++) {
		let θ = τ * k * t
		if (k < nr && real[k]) v += real[k] * Math.cos(θ)
		if (k < ni && imag[k]) v += imag[k] * Math.sin(θ)
	}
	return v
}
