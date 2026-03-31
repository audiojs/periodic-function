const τ = Math.PI * 2

// Build a Float32Array wavetable from Fourier coefficients.
// Suitable for OscillatorNode / PeriodicWave table generation.
// normalize: scale by peak amplitude so max = 1 (default true).
export default function wavetable(real, imag, {size = 8192, normalize = true} = {}) {
	let nr = real?.length || 0, ni = imag?.length || 0
	let n = Math.max(nr, ni)
	let table = new Float32Array(size)

	for (let i = 0; i < size; i++) {
		let θ = τ * i / size, v = 0
		for (let k = 0; k < n; k++) {
			if (k < nr && real[k]) v += real[k] * Math.cos(k * θ)
			if (k < ni && imag[k]) v += imag[k] * Math.sin(k * θ)
		}
		table[i] = v
	}

	if (normalize) {
		let max = 0
		for (let i = 0; i < size; i++) if (Math.abs(table[i]) > max) max = Math.abs(table[i])
		if (max > 0) for (let i = 0; i < size; i++) table[i] /= max
	}

	return table
}
