import { range } from "@/utils/helper";
import * as psychrolib from "@/utils/psychrolib";
import * as d3 from "d3";

export const RelativeHumidity = ({
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
  const labelTemp = (minTemp + maxTemp + 5) * 0.5;
  const [, maxW] = wRange;
  const rhs = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const temperatures = range(minTemp, maxTemp, 0.1);

  const getLabelAngle = (rh: number, temp: number) => {
    const w1 = psychrolib.GetHumRatioFromRelHum(
      temp - 2.5,
      rh * 0.01,
      pressure
    );
    const w2 = psychrolib.GetHumRatioFromRelHum(
      temp + 2.5,
      rh * 0.01,
      pressure
    );

    const scale = (yScale(1) - yScale(0)) / (xScale(1) - xScale(0));
    const angle = (Math.atan(((w2 - w1) * scale) / 5) * 180) / Math.PI;
    return angle;
  };

  return (
    <>
      {rhs.map((rh) => {
        const data = d3
          .map(temperatures, (temperature) => {
            const w = psychrolib.GetHumRatioFromRelHum(
              temperature,
              rh * 0.01,
              pressure
            );
            return [temperature, w] as [number, number];
          })
          .filter((datum) => datum[1] <= maxW);

        const angle = getLabelAngle(rh, labelTemp);
        const labelX = xScale(labelTemp);
        const labelY = yScale(
          psychrolib.GetHumRatioFromRelHum(labelTemp, rh * 0.01, pressure)
        );

        return (
          <svg key={`relHum-${rh}`} className="group">
            <path
              className="stroke-blue-600 stroke-1 group-hover:stroke-2"
              fill="none"
              d={line(data)!}
            />
            {rh !== 100 && (
              <text
                className="text-sm fill-blue-600 group-hover:stroke-blue-600"
                y={labelY}
                x={labelX}
                style={{ textAnchor: "middle" }}
                transform={`rotate(${angle}, ${labelX}, ${labelY}) translate(-2, -4)`}
              >
                {rh}%
              </text>
            )}
          </svg>
        );
      })}
    </>
  );
};
