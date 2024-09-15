import "./style.css";
import * as d3 from "d3";
import { IntegralCalculator } from "./integral-calc";

const container = document.getElementById("container")!;

const domain = [0, 10];
const range = [-2, 2];
const n = 1000;

// Declare the chart dimensions and margins.
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

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

function plotStuff(f: (x: number) => number) {
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
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

  // Add the y-axis.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

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

  // Remove the old SVG element.
  container.innerHTML = "";

  // Append the SVG element.
  container.append(svg.node()!);
}

const functionInput = document.getElementById("function") as HTMLInputElement;

functionInput.value = "Math.abs((x + 2) % 4 - 2) - 1";

plotStuff((x) => Math.abs((x + 2) % 4 - 2) - 1);

functionInput.addEventListener("input", () => {
  try {
    const f = new Function("x", `return ${functionInput.value};`) as (
      x: number
    ) => number;

    plotStuff(f);
  } catch (e) {
    console.error(e);
  }
});
