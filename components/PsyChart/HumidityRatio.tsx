import { range } from "@/utils/helper";
import * as psychrolib from "@/utils/psychrolib";
import * as d3 from "d3";

export const HumidityRatio = ({
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
  const wRanges = range(minW, maxW, 1 / 1000); // unit in g

  const getDryBulbFromHumidityRatioRelHum = (
    humidityRatio: number,
    relHum: number
  ) => {
    let min = minTemp;
    let max = maxTemp;
    let dryBulb = (min + max) * 0.5;

    let testRelHum = psychrolib.GetRelHumFromHumRatio(
      dryBulb,
      humidityRatio,
      pressure
    );
    let difference = testRelHum - relHum;
    let iterations = 0;

    while (Math.abs(difference) > 0.001) {
      if (iterations > 300) throw new Error("Infinite loop");

      if (difference > 0) {
        min = dryBulb;
      } else {
        max = dryBulb;
      }

      dryBulb = (min + max) * 0.5;
      testRelHum = psychrolib.GetRelHumFromHumRatio(
        dryBulb,
        humidityRatio,
        pressure
      );

      difference = testRelHum - relHum;

      //console.log(min, max, dryBulb, testRelHum, difference);

      iterations++;
    }

    return dryBulb;
  };

  const labelX = xScale(maxTemp + (maxTemp - minTemp) * 0.05);
  const labelY = yScale(0.5 * (minW + maxW));

  return (
    <>
      {wRanges.map((w) => {
        const pv = psychrolib.GetVapPresFromHumRatio(w, pressure);
        const temp =
          pv < psychrolib.GetSatVapPres(minTemp)
            ? minTemp
            : getDryBulbFromHumidityRatioRelHum(w, 1);

        const data = [
          [temp, w],
          [maxTemp, w],
        ] as [number, number][];

        return (
          <svg key={`w-${w}`} className="group">
            <path
              className="stroke-black group-hover:opacity-100 group-hover:stroke-2 opacity-50"
              fill="none"
              d={line(data)!}
              strokeDasharray="5,5"
            />
            {Math.round(w * 1000) % 2 === 0 && (
              <text
                className="group-hover:stroke-black"
                x={xScale(maxTemp)}
                y={yScale(w)}
                transform="translate(4, 4)"
              >
                {Math.round(w * 1000)}
              </text>
            )}
          </svg>
        );
      })}

      <text
        className="font-semibold"
        x={xScale(maxTemp)}
        y={yScale(0.5 * (minW + maxW))}
        textAnchor="middle"
        transform={`rotate(-90, ${labelX}, ${labelY})`}
      >
        Humidity Ratio, g/kg
      </text>
    </>
  );
};
