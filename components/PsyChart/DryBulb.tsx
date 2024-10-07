import { range } from "@/utils/helper";
import psychrolib from "@/utils/psychrolib";
import * as d3 from "d3";

export const DryBulb = ({
  tempRange,
  wRange,
  pressure,
  xScale,
  yScale,
  line,
}: {
  tempRange: number[];
  wRange: number[];
  pressure: number;
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  line: d3.Line<[number, number]>;
}) => {
  const [minTemp, maxTemp] = tempRange;
  const [minW, maxW] = wRange;
  const temperatures = range(minTemp, maxTemp, 5);

  return (
    <>
      {temperatures.map((temperature) => {
        const w = psychrolib.GetSatHumRatio(temperature, pressure);

        return (
          <svg className="group" key={`dryBulb-${temperature}`}>
            <path
              strokeDasharray="5,5"
              className="opacity-50 group-hover:opacity-100 group-hover:stroke-2 stroke-black"
              d={
                line([
                  [temperature, 0],
                  [temperature, Math.min(w, maxW)],
                ])!
              }
            />
            <text
              className="group-hover:stroke-black translate-y-5 stroke-1"
              x={xScale(temperature)}
              y={yScale(0)}
              style={{ textAnchor: "middle" }}
            >
              {temperature}
            </text>
          </svg>
        );
      })}

      <text
        className="font-semibold"
        x={xScale(0.5 * (minTemp + maxTemp))}
        y={yScale(minW - 0.07 * (maxW - minW))}
        textAnchor="middle"
      >
        Dry Bulb Temperature °C, Pressure = {pressure} Pa
      </text>
    </>
  );
};
