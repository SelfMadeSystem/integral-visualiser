import "./style.css";
import * as d3 from "d3";
import { IntegralCalculator } from "./integral-calc";

const container = document.getElementById("container")!;
const functionInput = document.getElementById("function") as HTMLInputElement;
const rangeMinInput = document.getElementById("range-min") as HTMLInputElement;
const rangeMaxInput = document.getElementById("range-max") as HTMLInputElement;
const domainMinInput = document.getElementById(
  "domain-min"
) as HTMLInputElement;
const domainMaxInput = document.getElementById(
  "domain-max"
) as HTMLInputElement;
const nInput = document.getElementById("steps") as HTMLInputElement;

rangeMinInput.value = "-2";
rangeMaxInput.value = "2";
domainMinInput.value = "-10";
domainMaxInput.value = "10";
nInput.value = "1000";

// Declare the chart dimensions and margins.
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

function plotStuff(
  f: (x: number) => number,
  domain: readonly [number, number],
  range: readonly [number, number],
  n: number
) {
  // Declare the x (horizontal position) scale.
  const x = d3
    .scaleLinear()
    .domain(domain)
    .range([marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain(range)
    .range([height - marginBottom, marginTop]);

  // Create the integral calculator.
  const calc = new IntegralCalculator(f);

  // Generate the plot data.
  const fData = calc.generatePlotData(domain[0], domain[1], n);

  // Generate the integral plot data.
  const integralData = calc.generateIntegralPlotData(domain[0], domain[1], n);

  // Create the line generator.
  const line = d3
    .line<{ x: number; y: number }>()
    .x((d) => x(d.x))
    .y((d) => y(d.y));

  // Create the SVG container.
  const svg = d3.create("svg").attr("width", width).attr("height", height);

  // Add the x-axis.
  const xAxis = d3.axisBottom(x);
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);

  // Add the y-axis.
  const yAxis = d3.axisLeft(y);
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis);

  // Add the x-axis grid lines.
  svg
    .append("g")
    .attr("class", "d3-grid")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(
      xAxis.tickSize(-height + marginTop + marginBottom).tickFormat(() => "")
    );

  // Add the y-axis grid lines.
  svg
    .append("g")
    .attr("class", "d3-grid")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(
      yAxis.tickSize(-width + marginLeft + marginRight).tickFormat(() => "")
    );

  // Add vertical line at x = 0
  svg
    .append("line")
    .attr("x1", x(0))
    .attr("y1", y(range[0]))
    .attr("x2", x(0))
    .attr("y2", y(range[1]))
    .attr("stroke", "currentColor")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4");

  // Add horizontal line at y = 0
  svg
    .append("line")
    .attr("x1", x(domain[0]))
    .attr("y1", y(0))
    .attr("x2", x(domain[1]))
    .attr("y2", y(0))
    .attr("stroke", "currentColor")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4");

  // Add the function plot.
  svg
    .append("path")
    .datum(fData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add the integral plot.
  svg
    .append("path")
    .datum(integralData)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add x-axis label.
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 5)
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("x");

  // Add y-axis label.
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("fill", "currentColor")
    .style("text-anchor", "middle")
    .text("f(x)");

  // Add the function label.
  svg
    .append("text")
    .attr("x", width - 5)
    .attr("y", y(f(domain[1])) - 5)
    .style("text-anchor", "end")
    .attr("fill", "steelblue")
    .text("f(x)");

  // Add the integral label.
  svg
    .append("text")
    .attr("x", width - 5)
    .attr("y", y(integralData[integralData.length - 1].y) - 5)
    .style("text-anchor", "end")
    .attr("fill", "orange")
    .text("∫ f(x) dx");

  // Remove the old SVG element.
  container.innerHTML = "";

  // Append the SVG element.
  container.append(svg.node()!);
}

functionInput.value = "abs(mod((x + 2), 4) - 2) - 1";

const context: Record<string, any> = {
  mod: (a: number, b: number) => ((a % b) + b) % b,
};

for (const key of Object.getOwnPropertyNames(Math)) {
  context[key] = Math[key as keyof typeof Math];
}

function handleFunctionInput() {
  try {
    const domain = [
      domainMinInput.valueAsNumber,
      domainMaxInput.valueAsNumber,
    ] as const;
    const range = [
      rangeMinInput.valueAsNumber,
      rangeMaxInput.valueAsNumber,
    ] as const;
    const n = nInput.valueAsNumber;

    const functionBody = `with (context) { return ${functionInput.value}; }`;
    const f = new Function("x", "context", functionBody) as (
      x: number,
      context: any
    ) => number;

    plotStuff((x) => f(x, context), domain, range, n);
  } catch (e) {
    console.error(e);
  }
}

handleFunctionInput();

functionInput.addEventListener("input", handleFunctionInput);
rangeMinInput.addEventListener("input", handleFunctionInput);
rangeMaxInput.addEventListener("input", handleFunctionInput);
domainMinInput.addEventListener("input", handleFunctionInput);
domainMaxInput.addEventListener("input", handleFunctionInput);
nInput.addEventListener("input", handleFunctionInput);
