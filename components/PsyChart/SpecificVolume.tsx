import { range } from "@/utils/helper";
import * as psychrolib from "@/utils/psychrolib";
import * as d3 from "d3";

export const SpecificVolume = ({
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
  const vmin = psychrolib.GetMoistAirVolume(minTemp, 0, pressure);
  const vmax = psychrolib.GetMoistAirVolume(maxTemp, maxW, pressure);
  const vRanges = range(
    Math.ceil(vmin / 0.01) * 0.01,
    Math.floor(vmax / 0.01) * 0.01,
    0.01
  ).filter((value, index, array) => array.indexOf(value) === index);

  const getLowerDryBulb = (dryBulb: number, v: number) => {
    let min = -100;
    let max = dryBulb;
    let temp = (min + max) * 0.5;

    const compute = (temp: number, volume: number) => {
      const w = psychrolib.GetHumRatioFromRelHum(temp, 1, pressure);
      const t = psychrolib.GetTDryBulbFromMoistAirVolumeAndHumRatio(
        volume,
        w,
        pressure
      );
      return psychrolib.GetRelHumFromHumRatio(t, w, pressure);
    };

    let iterations = 0;

    let testRelHum = compute(temp, v);
    while (Math.abs(testRelHum - 1) > 0.001) {
      if (iterations > 300) throw new Error("Infinite loop");
      if (testRelHum - 1 > 0) {
        max = temp;
      } else {
        min = temp;
      }
      temp = (min + max) * 0.5;
      testRelHum = compute(temp, v);
      iterations++;
    }

    return temp;
  };

  const getHumidityRatioFromDryBulbVolume = (dryBulb: number, v: number) => {
    let min = 0;
    let max = 1;
    let humidityRatio = (min + max) * 0.5;

    let testV = psychrolib.GetMoistAirVolume(dryBulb, humidityRatio, pressure);

    let difference = testV - v;
    let iterations = 0;

    while (Math.abs(difference) > 0.001) {
      if (iterations > 300) throw new Error("Infinite loop");

      if (difference > 0) {
        max = humidityRatio;
      } else {
        min = humidityRatio;
      }

      humidityRatio = (min + max) * 0.5;
      testV = psychrolib.GetMoistAirVolume(dryBulb, humidityRatio, pressure);

      difference = testV - v;
      // console.log(min, max, humidityRatio, testV, difference);

      iterations++;
    }

    return humidityRatio;
  };

  return (
    <>
      {vRanges.map((v) => {
        let t1 = psychrolib.GetTDryBulbFromMoistAirVolumeAndHumRatio(
          v,
          0,
          pressure
        );
        let w1 = 0;

        if (t1 > maxTemp) {
          t1 = maxTemp;
          w1 = getHumidityRatioFromDryBulbVolume(t1, v);
        }

        const t2 = getLowerDryBulb(t1, v);
        const w2 = psychrolib.GetSatHumRatio(t2, pressure);

        const data = [
          [t1, w1],
          [t2, w2],
        ] as [number, number][];

        // loop from w1 to w2 to see which one is closest to 0.45
        const wRanges = range(w1, w2, 1 / 1000);
        const order = wRanges
          .map((w) => {
            const thisTemp =
              psychrolib.GetTDryBulbFromMoistAirVolumeAndHumRatio(
                v,
                w,
                pressure
              );

            //console.log(thisTemp);

            const thisRel = psychrolib.GetRelHumFromHumRatio(
              thisTemp,
              w,
              pressure
            );

            return [thisTemp, thisRel, Math.abs(thisRel - 0.55)];
          })
          .sort((a, b) => a[2] - b[2]);

        const labelTemp = order[0][0];
        const labelHumidityRatio = psychrolib.GetHumRatioFromRelHum(
          labelTemp,
          0.55,
          pressure
        );

        const labelX = xScale(labelTemp);
        const labelY = yScale(labelHumidityRatio);
        const roundedValue = Math.round(v * 100) / 100;

        const scale = (yScale(1) - yScale(0)) / (xScale(1) - xScale(0));
        const labelAngle =
          (Math.atan((scale * (w2 - w1)) / (t2 - t1)) * 180) / Math.PI;

        return (
          <svg key={`v-${v}`} className="group">
            <path
             strokeDasharray="25,10"
              className="stroke-emerald-600 group-hover:stroke-2"
              fill="none"
              d={line(data)!}
            />
            {(roundedValue * 100) % 2 === 0 && (
              <text
                className="text-sm fill-emerald-600 group-hover:stroke-emerald-600"
                x={labelX}
                y={labelY}
                textAnchor="middle"
                transform={`rotate(${labelAngle}, ${labelX}, ${labelY}) translate(0, -4)`}
              >
                {roundedValue.toFixed(2)}
              </text>
            )}
          </svg>
        );
      })}
    </>
  );
};
