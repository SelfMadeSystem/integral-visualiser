/**
 * A simple integral calculator that uses the trapezoidal rule.
 */
export class IntegralCalculator {
  constructor(public f: (x: number) => number) {}

  /**
   * Calculates the integral of the function f(x) from a to b using the trapezoidal rule.
   * @param a The lower limit of the integral.
   * @param b The upper limit of the integral.
   * @param n The number of trapezoids to use in the calculation.
   * @returns The approximate value of the integral.
   */
  calculate(a: number, b: number, n: number): number {
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const amnt = this.f(a + i * h) * h;
      if (isFinite(amnt)) {
        sum += amnt;
      }
    }
    return sum;
  }

  /**
   * Generates a list of points that can be used to plot the function f(x) over the interval [a, b].
   */
  generatePlotData(
    a: number,
    b: number,
    n: number
  ): { x: number; y: number }[] {
    const h = (b - a) / n;
    const data = [];
    for (let i = 0; i <= n; i++) {
      const y = this.f(a + i * h);
      if (isFinite(y)) {
        data.push({ x: a + i * h, y });
      }
    }
    return data;
  }

  /**
   * Generates a list of points that can be used to plot the integral of the function f(x) over the interval [a, b].
   *
   * Optionally limits the range of the integral plot.
   */
  generateIntegralPlotData(
    a: number,
    b: number,
    n: number
  ): { x: number; y: number }[] {
    const h = (b - a) / n;
    const data = [];
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      const amnt = this.f(a + i * h) * h;
      if (isFinite(amnt)) {
        sum += amnt;
        console.log(sum);
        data.push({ x: a + i * h, y: sum });
      }
    }
    return data;
  }
}
