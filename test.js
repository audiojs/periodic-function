import test from 'node:test'
import assert from 'node:assert/strict'
import { sine, cosine, sawtooth, square, triangle, trapezoid, pulse, clausen, noise, interpolate, step, fourier, wavetable } from './index.js'

const ε = 1e-6
const near = (a, b) => Math.abs(a - b) < ε

test('sine', () => {
	assert.ok(near(sine(0), 0))
	assert.ok(near(sine(0.25), 1))
	assert.ok(near(sine(0.5), 0))
	assert.ok(near(sine(0.75), -1))
	assert.ok(near(sine(-0.75), sine(0.25)))
	// phase shift
	assert.ok(near(sine(0, 0.25), 1))   // sine with 0.25 phase = cosine
})

test('cosine', () => {
	assert.ok(near(cosine(0), 1))
	assert.ok(near(cosine(0.25), 0))
	assert.ok(near(cosine(0.5), -1))
	assert.ok(near(cosine(0.75), 0))
	// cosine = sine shifted by 0.25
	assert.ok(near(cosine(0.3), sine(0.3, 0.25)))
})

test('sawtooth', () => {
	assert.ok(near(sawtooth(0), 1))
	assert.ok(near(sawtooth(0.5), 0))
	assert.ok(near(sawtooth(0.875), -0.75))
	assert.ok(near(sawtooth(-0.75), sawtooth(0.25)))
})

test('square', () => {
	assert.equal(square(0), 1)
	assert.equal(square(0.25), 1)
	assert.equal(square(0.5), -1)
	assert.equal(square(0.75), -1)
	// duty cycle
	assert.equal(square(0.05, 0.1), 1)
	assert.equal(square(0.15, 0.1), -1)
	assert.equal(square(-0.75), square(0.25))
})

test('triangle', () => {
	assert.equal(triangle(0), 1)
	assert.equal(triangle(0.25), 0)
	assert.equal(triangle(0.5), -1)
	assert.equal(triangle(0.75), 0)
	assert.ok(near(triangle(-0.75), triangle(0.25)))
	// ratio=0: ascending ramp
	assert.equal(triangle(0, 0), -1)
	assert.equal(triangle(0.5, 0), 0)
	// ratio=1: descending (same as sawtooth)
	assert.ok(near(triangle(0.3, 1), sawtooth(0.3)))
})

test('trapezoid', () => {
	// default: rise [0,0.25], high [0.25,0.5], fall [0.5,0.75], low [0.75,1]
	assert.equal(trapezoid(0), -1)
	assert.equal(trapezoid(0.125), 0)    // midpoint of rise
	assert.equal(trapezoid(0.25), 1)     // top of rise
	assert.equal(trapezoid(0.4), 1)      // sustain high
	assert.equal(trapezoid(0.625), 0)    // midpoint of fall
	assert.equal(trapezoid(0.75), -1)    // bottom of fall
	assert.equal(trapezoid(0.9), -1)     // sustain low
	// square-like: trapezoid(t, 0, 0.5, 0.5)
	assert.equal(trapezoid(0, 0, 0.5, 0.5), 1)
	assert.equal(trapezoid(0.49, 0, 0.5, 0.5), 1)
	assert.equal(trapezoid(0.5, 0, 0.5, 0.5), -1)
})

test('pulse', () => {
	assert.equal(pulse(0), 1)
	assert.equal(pulse(0.01), 0)
	assert.equal(pulse(0.5), 0)
	// with width
	assert.equal(pulse(0.05, 0.1), 1)
	assert.equal(pulse(0.15, 0.1), 0)
	assert.ok(near(pulse(-0.75), pulse(0.25)))
})

test('clausen', () => {
	assert.ok(near(clausen(0), 0))
	assert.ok(near(clausen(0.5), 0))       // antisymmetric around 0.5
	assert.ok(near(clausen(-0.75), clausen(0.25)))
})

test('noise', () => {
	// periodic: same t gives same value
	assert.equal(noise(0), noise(0))
	assert.equal(noise(0.5), noise(0.5))
	assert.equal(noise(1.5), noise(0.5))
	// values in [-1, 1]
	for (let i = 0; i < 10; i++) {
		let v = noise(i / 10)
		assert.ok(v >= -1 && v <= 1)
	}
})

test('interpolate', () => {
	const samples = [0, 0.5, 1, 0.5, 0]
	assert.equal(interpolate(0, samples), 0)
	assert.ok(near(interpolate(0.2, samples), 0.5))
	assert.ok(near(interpolate(0.4, samples), 1))
	assert.ok(near(interpolate(0.1, samples), 0.25))
})

test('step', () => {
	const samples = [0, 1, 2, 3]
	assert.equal(step(0, samples), 0)
	assert.equal(step(0.25, samples), 1)
	assert.equal(step(0.5, samples), 2)
	assert.equal(step(0.75, samples), 3)
	assert.equal(step(1, samples), 0)   // wraps
})

test('fourier', () => {
	// pure sine: imag[1]=1 → sin(2πt)
	assert.ok(near(fourier(0, null, [0, 1]), 0))
	assert.ok(near(fourier(0.25, null, [0, 1]), 1))
	assert.ok(near(fourier(0.75, null, [0, 1]), -1))
	// pure cosine: real[1]=1 → cos(2πt)
	assert.ok(near(fourier(0, [0, 1], null), 1))
	assert.ok(near(fourier(0.25, [0, 1], null), 0))
	// DC offset: real[0]=0.5
	assert.ok(near(fourier(0.3, [0.5], null), 0.5))
})

test('wavetable', () => {
	// pure sine wavetable (normalized)
	const tbl = wavetable(null, [0, 1], {size: 1024})
	assert.ok(near(tbl[0], 0))
	assert.ok(near(tbl[256], 1))        // quarter period = peak
	assert.ok(near(tbl[512], 0))
	assert.ok(near(tbl[768], -1))
	assert.ok(tbl instanceof Float32Array)
	assert.equal(tbl.length, 1024)

	// normalization
	const tbl2 = wavetable(null, [0, 1, 0, 0.5], {size: 256})
	let max = 0
	for (let v of tbl2) if (Math.abs(v) > max) max = Math.abs(v)
	assert.ok(near(max, 1))

	// no normalization
	const tbl3 = wavetable(null, [0, 1], {size: 4, normalize: false})
	assert.ok(near(tbl3[1], 1))         // sin(π/2) = 1
})
