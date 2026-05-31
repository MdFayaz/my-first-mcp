export function normalizeRSI(rsi: number): number {
	return (rsi - 50) * 2;
}
