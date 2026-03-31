// Square wave. duty = fraction of period spent high (default 0.5).
export default function square(t, duty = 0.5) {
	t = ((t % 1) + 1) % 1
	return t < duty ? 1 : -1
}
