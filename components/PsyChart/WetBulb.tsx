import { range } from "@/utils/helper";
import * as psychrolib from "@/utils/psychrolib";
import * as d3 from "d3";

export const WetBulb = ({
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
  const [, maxW] = wRange;

  const maxWetBulb = psychrolib.GetTWetBulbFromHumRatio(
    maxTemp,
    maxW,
    pressure
  );
  const minWetBulb = psychrolib.GetTWetBulbFromHumRatio(minTemp, 0, pressure);
  const wetBulbs = range(Math.ceil(minWetBulb), Math.floor(maxWetBulb), 1);

  const getDryBulbFromWetBulbRelHum = (wetBulb: number, rh: number) => {
    let min = wetBulb;
    let max = maxTemp;
    let dryBulb = (min + max) * 0.5;

    let testRh = psychrolib.GetRelHumFromTWetBulb(dryBulb, wetBulb, pressure);
    let iterations = 0;

    while (Math.abs(testRh - rh) > 0.001) {
      if (iterations > 300) throw new Error("Infinite loop");
      if (testRh - rh > 0) {
        min = dryBulb;
      } else {
        max = dryBulb;
      }

      dryBulb = (min + max) * 0.5;
      testRh = psychrolib.GetRelHumFromTWetBulb(dryBulb, wetBulb, pressure);
      iterations++;
    }

    return dryBulb;
  };

  // calculate saturation label position
  const saturationLines = range(Math.ceil(minTemp), Math.floor(maxTemp), 0.1)
    .map(
      (temp) =>
        [temp, psychrolib.GetHumRatioFromRelHum(temp, 1, pressure)] as [
          number,
          number
        ]
    )
    .filter((datum) => datum[1] <= maxW)
    .reverse();
  const saturationW = psychrolib.GetHumRatioFromRelHum(minTemp, 1, pressure);
  const corner1 = [minTemp, saturationW * 2];
  const saturationTemp = saturationLines[0][0];
  const corner2 = [saturationTemp - 0.05 * (maxTemp - minTemp), maxW];
  const scale = (yScale(1) - yScale(0)) / (xScale(1) - xScale(0));
  const delta = (scale * (corner2[1] - corner1[1])) / (corner2[0] - corner1[0]);
  const angle = (Math.atan(delta) * 180) / Math.PI;
  const satLabelX = xScale((corner1[0] + corner2[0]) * 0.5);
  const satLabelY = yScale((corner1[1] + corner2[1]) * 0.5);

  return (
    <>
      {wetBulbs.map((wetBulb) => {
        const dryBulbs = range(wetBulb, maxTemp, 0.1);
        let data = d3.map(dryBulbs, (dryBulb) => {
          const humidityRatio = psychrolib.GetHumRatioFromTWetBulb(
            dryBulb,
            wetBulb,
            pressure
          );
          return [dryBulb, humidityRatio] as [number, number];
        });

        const sliceIndex = data.findIndex((datum) => datum[1] < 0.0001);
        if (sliceIndex > 0) data = data.slice(0, sliceIndex);
        const labelTemp = getDryBulbFromWetBulbRelHum(wetBulb, 1);
        const labelY = yScale(
          psychrolib.GetHumRatioFromRelHum(labelTemp, 1, pressure)
        );
        const labelX = xScale(labelTemp);

        return (
          <svg key={`wetBulb-${wetBulb}`} className="group">
            <path
              strokeDasharray="5,5"
              className={`stroke-black opacity-50 group-hover:opacity-100 group-hover:stroke-2`}
              fill="none"
              d={line(data)!}
            />
            {wetBulb % 5 === 0 && (
              <text
                className="group-hover:stroke-black"
                textAnchor="middle"
                x={labelX}
                y={labelY}
                transform={`translate(-6, -6)`}
              >
                {wetBulb}
              </text>
            )}
          </svg>
        );
      })}

      <text
        className="font-semibold"
        x={satLabelX}
        y={satLabelY}
        textAnchor="middle"
        transform={`rotate(${angle}, ${satLabelX}, ${satLabelY}) translate(0, 70)`}
      >
        Saturation Temperature °C
      </text>
    </>
  );
};
