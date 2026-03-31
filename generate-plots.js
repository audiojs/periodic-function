// Generate SVG plots for all periodic functions → img/*.svg
import { writeFileSync, mkdirSync } from 'node:fs'
import { sine, cosine, sawtooth, square, triangle, trapezoid, pulse, clausen, noise, interpolate, step, fourier, wavetable } from './index.js'

const W = 200, H = 60, PAD = 6, N = 256

function makeSVG(samples) {
	let min = Infinity, max = -Infinity
	for (let v of samples) { if (v < min) min = v; if (v > max) max = v }
	let pad = (max - min || 1) * 0.08
	let lo = min - pad, span = (max + pad) - lo

	let d = samples.map((v, i) => {
		let x = (PAD + (i / (N - 1)) * (W - 2 * PAD)).toFixed(1)
		let y = (PAD + (1 - (v - lo) / span) * (H - 2 * PAD)).toFixed(1)
		return `${i === 0 ? 'M' : 'L'}${x} ${y}`
	}).join(' ')

	let zy = PAD + (1 - (0 - lo) / span) * (H - 2 * PAD)
	let zeroLine = zy >= PAD && zy <= H - PAD
		? `<line x1="${PAD}" y1="${zy.toFixed(1)}" x2="${W - PAD}" y2="${zy.toFixed(1)}" stroke="#ccc" stroke-width="0.75"/>`
		: ''

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
${zeroLine}
  <path d="${d}" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
}

function sample(fn) {
	return Array.from({length: N}, (_, i) => fn(i / N))
}

mkdirSync('img', {recursive: true})

const LOOKUP_SAMPLES = [0.8, 0.3, -0.5, -0.9, -0.2, 0.6]

const plots = {
	sine:        sample(t => sine(t)),
	cosine:      sample(t => cosine(t)),
	sawtooth:    sample(t => sawtooth(t)),
	square:      sample(t => square(t)),
	triangle:    sample(t => triangle(t)),
	trapezoid:   sample(t => trapezoid(t)),
	pulse:       sample(t => pulse(t, 0.06)),
	clausen:     sample(t => clausen(t)),
	noise:       sample(t => noise(t)),
	interpolate: sample(t => interpolate(t, LOOKUP_SAMPLES)),
	step:        sample(t => step(t, LOOKUP_SAMPLES)),
	fourier:     sample(t => fourier(t, null, [0, 1, 0, 0.33, 0, 0.2])),
	wavetable:   (() => {
		// square wave from Fourier coefficients
		let imag = new Float32Array(16)
		for (let k = 1; k < 16; k += 2) imag[k] = 4 / (Math.PI * k)
		let tbl = wavetable(null, imag, {size: N})
		return Array.from(tbl)
	})(),
}

for (let [name, samples] of Object.entries(plots)) {
	writeFileSync(`img/${name}.svg`, makeSVG(samples))
	console.log(`img/${name}.svg`)
}
