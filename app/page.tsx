"use client";

import * as d3 from "d3";
import PsyChart from "@/components/PsyChart/PsyChart";
import { getPsychrometrics } from "@/utils/helper";
import * as psychrolib from "@/utils/psychrolib";
import { MouseEventHandler, useState, useRef } from "react";
import { StatePanel } from "@/components/PsyChart/StatePanel";
import { PreviewPanel } from "@/components/PsyChart/PreviewPanel";
import { psychrometrics } from "@/utils/psychrometrics";

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
  const parameters = [
    "showDryBulb",
    "showRelativeHumidity",
    "showWetBulb",
    "showSpecificVolume",
    "showHumidityRatio",
    "showEnthalpy",
  ] as const;
  const [states, setStates] = useState<psychrometrics[]>([]);

  // preview state
  const [position, setPosition] = useState([0, 0]);
  const [previewState, setPreviewState] = useState(getPsychrometrics(25, 20));
  const getPsychrometricsFromPosition = (x: number, y: number) => {
    const xScale = d3.scaleLinear(
      [sizes.marginLeft, sizes.width - sizes.marginRight],
      [minTemp, maxTemp]
    );
    const yScale = d3.scaleLinear(
      [sizes.height - sizes.marginBottom, sizes.marginTop],
      [minW, maxW]
    );
    const t = xScale(x);
    const w = yScale(y);

    if (t <= maxTemp && t >= minTemp && w <= maxW && w >= minW) {
      const wetBulb = psychrolib.GetTWetBulbFromHumRatio(
        t,
        w,
        options.pressure
      );
      const state = getPsychrometrics(t, wetBulb, undefined, options.pressure);
      return state;
    } else return null;
  };

  const mouseMoveHandler: MouseEventHandler = (e) => {
    if (!ref.current || !e.target) return;
    const rect = ref.current.getBoundingClientRect();
    const [x, y] = [e.clientX - rect.left, e.clientY - rect.top];
    setPosition([x, y]);
    const state = getPsychrometricsFromPosition(x, y);
    if (state) setPreviewState(state);
  };

  const mouseClickHandler: MouseEventHandler = (e) => {
    if (!ref.current || !e.target) return;

    const [x, y] = position;
    const state = getPsychrometricsFromPosition(x, y);

    if (state) {
      state.name = `State ${states.length + 1}`;
      setStates([...states, state]);
    }
  };

  // add state by value
  const [manualState, setManualState] = useState<{
    dryBulb?: number;
    wetBulb?: number;
    relHum?: number;
  }>({ dryBulb: 25, wetBulb: 20 });

  return (
    <div className="w-full h-full flex flex-row overflow-y-hidden">
      <div className="flex items-center justify-center w-full">
        <div className="relative">
          <PsyChart
            ref={ref}
            states={states}
            {...visibility}
            {...options}
            {...sizes}
            previewState={previewState}
            mouseMoveHandler={mouseMoveHandler}
            mouseClickHandler={mouseClickHandler}
          />
          <PreviewPanel state={previewState} />
        </div>
      </div>

      <div className="flex flex-col border w-1/4 overflow-y-auto">
        <div className="p-4">
          <div className="font-semibold">Settings</div>
          <div className="flex-col flex">
            <label>
              Temp
              <input
                className="border mx-2"
                type="number"
                min={35}
                max={99}
                value={options.tempRange[1]}
                onChange={(e) => {
                  const temp = e.target.valueAsNumber;
                  if (isNaN(temp)) return;
                  if (
                    temp > parseFloat(e.target.max) ||
                    temp < parseFloat(e.target.min)
                  )
                    return;

                  setOptions({
                    ...options,
                    tempRange: [options.tempRange[0], temp],
                  });
                }}
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
                onChange={(e) => {
                  const w = e.target.valueAsNumber;
                  if (isNaN(w)) return;
                  if (
                    w > parseFloat(e.target.max) ||
                    w < parseFloat(e.target.min)
                  )
                    return;

                  setOptions({
                    ...options,
                    wRange: [options.wRange[0], e.target.valueAsNumber],
                  });
                }}
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
        </div>

        <div className="p-4">
          <div className="font-semibold">Define states by value</div>
          <div className="flex flex-col w-full space-y-2 py-2">
            <div className="flex flex-row">
              <div className="w-24">Dry Bulb</div>
              <input
                type="number"
                className="border w-16 text-center"
                onChange={(e) =>
                  setManualState({
                    ...manualState,
                    dryBulb: parseFloat(e.target.value),
                  })
                }
                min={minTemp}
                max={maxTemp}
                value={manualState.dryBulb}
              />
            </div>
            <div className="flex flex-row">
              <div className="w-24">Wet Bulb</div>
              <input
                type="number"
                className="border w-16 text-center"
                onChange={(e) =>
                  setManualState({
                    ...manualState,
                    wetBulb: parseFloat(e.target.value),
                  })
                }
                min={minTemp}
                max={maxTemp}
                value={manualState.wetBulb}
              />
            </div>
            <div className="flex flex-row w-full justify-between">
              <div className="w-full flex flex-row">
                <div className="w-24">Rel Hum.</div>
                <input
                  type="number"
                  className="border w-16 text-center"
                  onChange={(e) =>
                    setManualState({
                      ...manualState,
                      relHum: parseFloat(e.target.value),
                    })
                  }
                  min={0}
                  max={100}
                  value={manualState.relHum}
                />
              </div>
              <button
                onClick={() => {
                  if (
                    manualState.dryBulb &&
                    (manualState.wetBulb || manualState.relHum)
                  ) {
                    const state = getPsychrometrics(
                      manualState.dryBulb,
                      manualState.wetBulb,
                      manualState.relHum
                    );

                    state.name = `State ${states.length + 1}`;
                    setStates([...states, state]);
                  }
                }}
                className="border px-2 bg-slate-200 hover:bg-slate-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <>
          {states.map((state, i) => (
            <div key={`state-${i}`}>
              <StatePanel
                state={state}
                deleteHandler={() => {
                  setStates(states.filter((s) => s.name !== state.name));
                }}
              />
            </div>
          ))}
        </>
      </div>
    </div>
  );
}
