const SIZE = 4096
const _buf = Float32Array.from({length: SIZE}, () => Math.random() * 2 - 1)

// Periodic noise: repeating random buffer sampled by phase.
export default function noise(t) {
	return _buf[Math.floor(((t % 1 + 1) % 1) * SIZE)]
}
