"use client";

import * as d3 from "d3";
import PsyChart from "@/components/PsyChart/PsyChart";
import { getPsychrometrics } from "@/utils/helper";
import * as psychrolib from "@/utils/psychrolib";
import { MouseEventHandler, useState, useRef } from "react";
import { StatePanel } from "@/components/PsyChart/StatePanel";

export default function Home() {
  psychrolib.SetUnitSystem(psychrolib.SI);

  const ref = useRef<SVGSVGElement>(null);

  const [visibility, setVisibility] = useState({
    showDryBulb: true,
    showRelativeHumidity: true,
    showWetBulb: true,
    showSpecificVolume: true,
    showHumidityRatio: true,
    showEnthalpy: true,
  });

  const [options, setOptions] = useState({
    tempRange: [-10, 50],
    wRange: [0, 30 / 1000],
    pressure: 101325,
  });

  const sizes = {
    width: 1000,
    height: 800,
    marginTop: 50,
    marginRight: 80,
    marginBottom: 80,
    marginLeft: 20,
  };

  const [minTemp, maxTemp] = options.tempRange;
  const [minW, maxW] = options.wRange;
  //const parameters = Object.getOwnPropertyNames(visibility);
  const parameters = [
    "showDryBulb",
    "showRelativeHumidity",
    "showWetBulb",
    "showSpecificVolume",
    "showHumidityRatio",
    "showEnthalpy",
  ] as const;
  const [states, setStates] = useState([getPsychrometrics(25, 20)]);
  const [position, setPosition] = useState([0, 0]);

  const mouseMoveHandler: MouseEventHandler = (e) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition([
        Math.round(e.clientX - rect.left),
        Math.round(e.clientY - rect.top),
      ]);
    }
  };

  const mouseClickHandler: MouseEventHandler = () => {
    const xScale = d3.scaleLinear(
      [sizes.marginLeft, sizes.width - sizes.marginRight],
      [minTemp, maxTemp]
    );
    const yScale = d3.scaleLinear(
      [sizes.height - sizes.marginBottom, sizes.marginTop],
      [minW, maxW]
    );

    const t = xScale(position[0]);
    const w = yScale(position[1]);

    if (t <= maxTemp && t >= minTemp && w <= maxW && w >= minW) {
      const wetBulb = psychrolib.GetTWetBulbFromHumRatio(
        t,
        w,
        options.pressure
      );
      const state = getPsychrometrics(t, wetBulb, undefined, options.pressure);
      setStates([state]);
    }
  };

  return (
    <div className="w-full h-full flex flex-row">
      <div className="flex items-center justify-center w-full">
        <PsyChart
          ref={ref}
          states={states}
          {...visibility}
          {...options}
          {...sizes}
          mouseClickHandler={mouseClickHandler}
          mouseMoveHandler={mouseMoveHandler}
        />
      </div>

      <div className="flex flex-col border">
        <div className="flex flex-col p-4">
          <label>
            Temp
            <input
              className="border mx-2"
              type="number"
              value={options.tempRange[1]}
              onChange={(e) =>
                setOptions({
                  ...options,
                  tempRange: [options.tempRange[0], e.target.valueAsNumber],
                })
              }
            />
          </label>

          <label>
            Max w
            <input
              className="border mx-2"
              type="number"
              min={0.01}
              max={0.05}
              step={0.001}
              value={options.wRange[1]}
              onChange={(e) =>
                setOptions({
                  ...options,
                  wRange: [options.wRange[0], e.target.valueAsNumber],
                })
              }
            />
          </label>

          {parameters.map((parameter) => (
            <label key={parameter}>
              <input
                type="checkbox"
                checked={visibility[parameter]}
                onChange={(e) =>
                  setVisibility({
                    ...visibility,
                    [parameter]: e.target.checked,
                  })
                }
              />
              {parameter}
            </label>
          ))}
        </div>

        <div className="p-4">{states && <StatePanel state={states[0]} />}</div>
        <div className="flex items-center justify-center w-full">
          {position[0]}, {position[1]}
        </div>
      </div>
    </div>
  );
}
