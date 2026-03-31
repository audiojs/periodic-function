// Step function: nearest sample, no interpolation.
export default function step(t, samples) {
	t = ((t % 1) + 1) % 1
	return samples[Math.floor(t * samples.length)]
}
