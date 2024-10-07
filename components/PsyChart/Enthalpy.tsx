import { getIntersection, range } from "@/utils/helper";
import * as psychrolib from "@/utils/psychrolib";
import * as d3 from "d3";

export const Enthalpy = ({
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

  const [minH, maxH] = [
    psychrolib.GetMoistAirEnthalpy(minTemp, minW),
    psychrolib.GetMoistAirEnthalpy(maxTemp, maxW),
  ];
  const hRanges = range(Math.ceil(minH), Math.floor(maxH), 1000);

  // get the equation of left boundary
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
  const saturationTemp = saturationLines[0][0];
  const corner1 = [minTemp, saturationW * 2];
  const corner2 = [saturationTemp - 0.05 * (maxTemp - minTemp), maxW];

  // y = ax + c
  const a = (corner2[1] - corner1[1]) / (corner2[0] - corner1[0]);
  const c = corner2[1] - a * corner2[0];

  // calculate label position
  const scale = (yScale(1) - yScale(0)) / (xScale(1) - xScale(0));
  const delta = (scale * (corner2[1] - corner1[1])) / (corner2[0] - corner1[0]);
  const angle = (Math.atan(delta) * 180) / Math.PI;
  const labelX = xScale((corner1[0] + corner2[0]) * 0.5);
  const labelY = yScale((corner1[1] + corner2[1]) * 0.5);

  return (
    <>
      {hRanges.map((h, index) => {
        let t1 = psychrolib.GetTDryBulbFromEnthalpyAndHumRatio(h, 0);
        let w1 = 0;

        const t2 = psychrolib.GetTDryBulbFromEnthalpyAndHumRatio(h, maxW);
        const w2 = maxW;

        if (t1 > maxTemp) {
          t1 = maxTemp;
          w1 = psychrolib.GetHumRatioFromEnthalpyAndTDryBulb(h, maxTemp);
        }

        // compute the line y = bx +d
        const b = (w2 - w1) / (t2 - t1);
        const d = w1 - b * t1;

        const intersection = getIntersection(a, b, c, d);

        if (intersection.y < corner1[1]) {
          return <></>;
        }

        let isUpperRegion = false;
        if (intersection.y > corner2[1]) {
          intersection.y = maxW;
          intersection.x = (maxW - d) / b;
          isUpperRegion = true;

          if (h % 5000 !== 0) return <></>;
        }

        const delta = (maxW - minW) * 0.02;
        const data: [number, number][] =
          h % 5000 === 0
            ? [
                [t1, w1],
                [intersection.x, intersection.y],
              ]
            : [
                [(intersection.y - delta - d) / b, intersection.y - delta],
                [intersection.x, intersection.y],
              ];

        return (
          <svg key={`enthalpy-${h}-${index}`} className="group">
            <path
              key={`enthalpy-${h}-line`}
              className="stroke-1 stroke-cyan-500 group-hover:stroke-2"
              fill="none"
              d={line(data)!}
            />

            {h % 5000 === 0 && !isUpperRegion && (
              <text
                key={`enthalpy-${h}-label`}
                className="group-hover:stroke-black"
                x={xScale(data[1][0])}
                y={yScale(data[1][1])}
                transform="translate(-6, -12)"
                textAnchor="middle"
              >
                {Math.round(h / 1000)}
              </text>
            )}
          </svg>
        );
      })}
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        className="font-semibold"
        transform={`rotate(${angle}, ${labelX}, ${labelY}) translate(0, -50)`}
      >
        Enthalpy (h) Kilojoules per kg dry air
      </text>
    </>
  );
};
