import { range } from "@/utils/helper";
import psychrolib from "@/utils/psychrolib";
import * as d3 from "d3";

export const BoundaryLine = ({
  tempRange,
  wRange,
  pressure,

  line,
}: {
  tempRange: number[];
  wRange: number[];
  pressure: number;

  line: d3.Line<[number, number]>;
}) => {
  const [minTemp, maxTemp] = tempRange;
  const [minW, maxW] = wRange;

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

  // bottom left
  const saturationW = psychrolib.GetHumRatioFromRelHum(minTemp, 1, pressure);
  const corner1 = [minTemp, saturationW * 2];

  // top right
  const saturationTemp = saturationLines[0][0];
  const corner2 = [saturationTemp - 0.05 * (maxTemp - minTemp), maxW];

  const lines = [
    [minTemp, minW],
    [maxTemp, minW],
    [maxTemp, maxW],
    [...corner2],
    [...corner1],
    [minTemp, minW],
  ] as [number, number][];

  return (
    <path className="stroke-black stroke-2" d={line(lines)!} fill="none" />
  );
};
