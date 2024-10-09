"use client";

import PsyChart from "@/components/PsyChart/PsyChart";
import { getPsychrometrics } from "@/utils/helper";
import psychrolib, { SI } from "@/utils/psychrolib";
import { psychrometrics } from "@/utils/psychrometrics";
import { useState } from "react";
import useResizeObserver from "use-resize-observer";

interface calculationCondition {
  dryBulb?: number;
  wetBulb?: number;
  relHum?: number;
}

interface parameterProps {
  outdoorCondition: calculationCondition;
  roomCondition: calculationCondition;
  coolingCoilCondition: calculationCondition;

  sensibleHeat: number;
  latentHeat: number;

  supplyAirVolume: number;
  freshAirVolume: number;

  chilledWaterTemperature: [number, number];

  maxVelocity: number;
  maxPressureDrop: number;
  pressure: number;
}

psychrolib.SetUnitSystem(SI);

export default function Page() {
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const pipeSizingTable = [
    {
      dia: 20,
      flow: 0,
    },
    {
      dia: 20,
      flow: 0.16,
    },
    {
      dia: 25,
      flow: 0.281946643717078,
    },
    {
      dia: 32,
      flow: 0.539688349190864,
    },
    {
      dia: 40,
      flow: 0.970574630693786,
    },
    {
      dia: 50,
      flow: 1.74547980359166,
    },
    {
      dia: 65,
      flow: 3.48017121460963,
    },
    {
      dia: 80,
      flow: 6.00864898911307,
    },
    {
      dia: 100,
      flow: 10.8059443608899,
    },
    {
      dia: 125,
      flow: 19.433392388575,
    },
    {
      dia: 150,
      flow: 31.3910294219446,
    },
    {
      dia: 200,
      flow: 66.8976136477631,
    },
    {
      dia: 250,
      flow: 120.308557258683,
    },
    {
      dia: 300,
      flow: 176.714586764426,
    },
    {
      dia: 350,
      flow: 240.528187540469,
    },
    {
      dia: 400,
      flow: 314.159265358979,
    },
  ];

  // const cdpSizingTable = [
  //   {
  //     dia: 25,
  //     coolingCap: 17.6,
  //   },
  //   {
  //     dia: 32,
  //     coolingCap: 101,
  //   },
  //   {
  //     dia: 40,
  //     coolingCap: 176,
  //   },
  //   {
  //     dia: 50,
  //     coolingCap: 598,
  //   },
  //   {
  //     dia: 65,
  //     coolingCap: 800,
  //   },
  //   {
  //     dia: 80,
  //     coolingCap: 1055,
  //   },
  //   {
  //     dia: 100,
  //     coolingCap: 1512,
  //   },
  //   {
  //     dia: 125,
  //     coolingCap: 2462,
  //   },
  //   {
  //     dia: 150,
  //     coolingCap: 3500,
  //   },
  // ];

  const [parameters, setParameters] = useState<parameterProps>({
    outdoorCondition: { dryBulb: 35, wetBulb: 29 },
    roomCondition: { dryBulb: 22, relHum: 60 },
    coolingCoilCondition: { dryBulb: 13.5, relHum: 90 },
    sensibleHeat: 47.5,
    latentHeat: 27,
    supplyAirVolume: 4.6,
    freshAirVolume: 3.5,
    chilledWaterTemperature: [7, 12.5],
    maxVelocity: 2.5,
    maxPressureDrop: 300,
    pressure: 101325,
  });

  const sensibleHeatRatio =
    parameters.sensibleHeat / (parameters.sensibleHeat + parameters.latentHeat);
  const returnAirVolume =
    parameters.supplyAirVolume - parameters.freshAirVolume;

  const outdoorState = getPsychrometrics(
    parameters.outdoorCondition.dryBulb,
    parameters.outdoorCondition.wetBulb,
    parameters.outdoorCondition.relHum
  );
  outdoorState.name = "O";

  const roomState = getPsychrometrics(
    parameters.roomCondition.dryBulb,
    parameters.roomCondition.wetBulb,
    parameters.roomCondition.relHum
  );
  roomState.name = "R";

  const coolingCoilState = getPsychrometrics(
    parameters.coolingCoilCondition.dryBulb,
    parameters.coolingCoilCondition.wetBulb,
    parameters.coolingCoilCondition.relHum
  );
  coolingCoilState.name = "s1";

  let caclulatedSupplyAir: number | undefined;
  let mixingDryBulb: number | undefined,
    mixingEnthalpy: number | undefined,
    mixingHumidityRatio: number | undefined,
    mixingWetBulb: number | undefined;
  let qVent: number | undefined,
    qS: number | undefined,
    qL: number | undefined,
    roomSHR: number | undefined;
  let qCoil: number | undefined,
    qSC: number | undefined,
    coilSHR: number | undefined;
  let tR: number | undefined,
    wR: number | undefined,
    relHumR: number | undefined;
  let mCHWSR: number | undefined,
    wP: number | undefined,
    wPHr: number | undefined;
  let pipeSize: number | undefined;
  //cdpSize: number | undefined;

  let states: psychrometrics[] = [];

  if (roomState && coolingCoilState) {
    caclulatedSupplyAir =
      parameters.sensibleHeat /
      (1.22 * (roomState?.dryBulb - coolingCoilState.dryBulb));

    mixingDryBulb =
      (returnAirVolume * roomState.dryBulb +
        parameters.freshAirVolume * outdoorState.dryBulb) /
      parameters.supplyAirVolume;

    mixingEnthalpy =
      (returnAirVolume * roomState.enthalpy +
        parameters.freshAirVolume * outdoorState.enthalpy) /
      parameters.supplyAirVolume;

    mixingHumidityRatio =
      (returnAirVolume * roomState.humidityRatio +
        parameters.freshAirVolume * outdoorState.humidityRatio) /
      parameters.supplyAirVolume;

    mixingWetBulb = psychrolib.GetTWetBulbFromHumRatio(
      mixingDryBulb,
      mixingHumidityRatio,
      parameters.pressure
    );

    const mixingState = getPsychrometrics(mixingDryBulb, mixingWetBulb);
    mixingState.name = "M";

    qVent =
      (parameters.freshAirVolume *
        1.2 *
        (outdoorState.enthalpy - roomState.enthalpy)) /
      1000;
    qS =
      parameters.supplyAirVolume *
      1.22 *
      (roomState.dryBulb - coolingCoilState.dryBulb);
    qL =
      parameters.supplyAirVolume *
      1.2 *
      (roomState.humidityRatio - coolingCoilState.humidityRatio) *
      2500.8;

    roomSHR = qS / (qS + qL);

    qCoil =
      (parameters.supplyAirVolume *
        1.2 *
        (mixingEnthalpy - coolingCoilState.enthalpy)) /
      1000;

    qSC =
      parameters.supplyAirVolume *
      1.22 *
      (mixingDryBulb - coolingCoilState.dryBulb);

    coilSHR = qSC / qCoil;

    tR =
      coolingCoilState.dryBulb +
      parameters.sensibleHeat / (parameters.supplyAirVolume * 1.22);
    wR =
      parameters.latentHeat / (parameters.supplyAirVolume * 1.2 * 2500.8) +
      coolingCoilState.humidityRatio;

    relHumR =
      100 * psychrolib.GetRelHumFromHumRatio(tR, wR, parameters.pressure);

    mCHWSR =
      qCoil /
      4.185 /
      (parameters.chilledWaterTemperature[1] -
        parameters.chilledWaterTemperature[0]);

    wP =
      parameters.supplyAirVolume *
      1.2 *
      (mixingHumidityRatio - coolingCoilState.humidityRatio);

    wPHr = wP * 3600;

    pipeSize =
      mCHWSR && pipeSizingTable.findLast((p) => mCHWSR! >= p.flow)!.dia;

    states = [outdoorState, mixingState, coolingCoilState, roomState];
  }

  return (
    <div className="flex flex-row overflow-y-hidden">
      <div className="border p-4 flex flex-col space-y-5 overflow-y-auto">
        <div className="w-auto">
          <table className="table-fixed">
            <thead>
              <tr>
                <th className="text-left italic" colSpan={10}>
                  Design Conditions:
                </th>
              </tr>
              <tr className="border-b">
                <th className="font-normal p-2"></th>
                <th className="font-normal p-2">Seasons</th>
                <th className="font-normal p-2">DB (°C)</th>
                <th className="font-normal p-2">WB (°C)</th>
                <th className="font-normal p-2">RH (%)</th>
                <th className="font-normal p-2">WB (°C)</th>
                <th className="font-normal p-2">w (kg/kg)</th>
                <th className="font-normal p-2">h (kJ/kg)</th>
                <th className="font-normal p-2">Dew pt. (°C)</th>
                <th className="font-normal p-2">RH (%)</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td rowSpan={2} className="p-2 w-28 font-semibold">
                  Outdoor / Pre-treated
                </td>
                <td className="p-2">Summer</td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    step={0.1}
                    value={parameters.outdoorCondition.dryBulb?.toFixed(1)}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.valueAsNumber))) return;
                      setParameters({
                        ...parameters,
                        outdoorCondition: {
                          ...parameters.outdoorCondition,
                          dryBulb: e.target.valueAsNumber,
                        },
                      });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    step={0.1}
                    value={parameters.outdoorCondition.wetBulb?.toFixed(1)}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.valueAsNumber))) return;
                      setParameters({
                        ...parameters,
                        outdoorCondition: {
                          ...parameters.outdoorCondition,
                          wetBulb: e.target.valueAsNumber,
                        },
                      });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    min={0}
                    max={100}
                    value={parameters.outdoorCondition.relHum}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.valueAsNumber))) return;
                      setParameters({
                        ...parameters,
                        outdoorCondition: {
                          ...parameters.outdoorCondition,
                          relHum: e.target.valueAsNumber,
                        },
                      });
                    }}
                  />
                </td>
                <td className="p-2 text-center text-red-500">
                  {outdoorState?.wetBulb.toFixed(1)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {outdoorState?.humidityRatio.toFixed(4)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {(outdoorState?.enthalpy / 1000).toFixed(3)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {outdoorState?.dewTemp.toFixed(1)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {(outdoorState?.relHum * 100).toFixed(1)}
                </td>
              </tr>

              <tr>
                <td className="p-2">Winter</td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                  />
                </td>
                <td className="p-2 text-center">-</td>
                <td className="p-2 text-center">-</td>
                <td className="p-2 text-center">-</td>
                <td className="p-2 text-center">-</td>
                <td className="p-2 text-center">-</td>
              </tr>

              <tr>
                <td rowSpan={2} className="p-2 font-semibold">
                  Room (Design)
                </td>
                <td className="p-2">Summer</td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    step={0.1}
                    value={parameters.roomCondition.dryBulb?.toFixed(1)}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.valueAsNumber))) return;
                      setParameters({
                        ...parameters,
                        roomCondition: {
                          ...parameters.roomCondition,
                          dryBulb: e.target.valueAsNumber,
                        },
                      });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    step={0.1}
                    value={parameters.roomCondition.wetBulb?.toFixed(1)}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.valueAsNumber))) return;
                      setParameters({
                        ...parameters,
                        roomCondition: {
                          ...parameters.roomCondition,
                          wetBulb: e.target.valueAsNumber,
                        },
                      });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    min={0}
                    max={100}
                    value={parameters.roomCondition.relHum}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.valueAsNumber))) return;
                      setParameters({
                        ...parameters,
                        roomCondition: {
                          ...parameters.roomCondition,
                          relHum: e.target.valueAsNumber,
                        },
                      });
                    }}
                  />
                </td>
                <td className="p-2 text-center text-red-500">
                  {roomState?.wetBulb.toFixed(1)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {roomState?.humidityRatio.toFixed(4)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {(roomState?.enthalpy / 1000).toFixed(3)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {roomState?.dewTemp.toFixed(1)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {(roomState?.relHum * 100).toFixed(1)}
                </td>
              </tr>

              <tr>
                <td className="p-2">Winter</td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                  />
                </td>
                <td className="p-2 text-center">-</td>
                <td className="p-2 text-center">-</td>
                <td className="p-2 text-center">-</td>
                <td className="p-2 text-center">-</td>
                <td className="p-2 text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="w-auto">
          <table className="table-fixed">
            <thead>
              <tr>
                <th className="text-left italic" colSpan={10}>
                  Coil Conditions:
                </th>
              </tr>
              <tr className="border-b">
                <th className="font-normal p-2"></th>
                <th className="font-normal p-2">DB (°C)</th>
                <th className="font-normal p-2">WB (°C)</th>
                <th className="font-normal p-2">RH (%)</th>
                <th className="font-normal p-2">WB (°C)</th>
                <th className="font-normal p-2">w (kg/kg)</th>
                <th className="font-normal p-2">h (kJ/kg)</th>
                <th className="font-normal p-2">Dew pt. (°C)</th>
                <th className="font-normal p-2">RH (%)</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-2">
                  <input
                    type="text"
                    className="border bg-cyan-100"
                    defaultValue={"Cooling off-coil"}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    step={0.1}
                    value={parameters.coolingCoilCondition.dryBulb?.toFixed(1)}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.valueAsNumber))) return;
                      setParameters({
                        ...parameters,
                        coolingCoilCondition: {
                          ...parameters.coolingCoilCondition,
                          dryBulb: e.target.valueAsNumber,
                        },
                      });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    step={0.1}
                    value={parameters.coolingCoilCondition.wetBulb?.toFixed(1)}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.valueAsNumber))) return;
                      setParameters({
                        ...parameters,
                        coolingCoilCondition: {
                          ...parameters.coolingCoilCondition,
                          wetBulb: e.target.valueAsNumber,
                        },
                      });
                    }}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    min={0}
                    max={100}
                    value={parameters.coolingCoilCondition.relHum}
                    onChange={(e) => {
                      if (isNaN(Number(e.target.valueAsNumber))) return;
                      setParameters({
                        ...parameters,
                        coolingCoilCondition: {
                          ...parameters.coolingCoilCondition,
                          relHum: e.target.valueAsNumber,
                        },
                      });
                    }}
                  />
                </td>
                <td className="p-2 text-center text-red-500">
                  {coolingCoilState?.wetBulb.toFixed(1)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {coolingCoilState?.humidityRatio.toFixed(4)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {(coolingCoilState?.enthalpy / 1000).toFixed(3)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {coolingCoilState?.dewTemp.toFixed(1)}
                </td>
                <td className="p-2 text-center text-red-500">
                  {(coolingCoilState?.relHum * 100).toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="w-full flex flex-row space-x-8">
          <div className="w-auto">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={4} className="text-left italic border-b">
                    Calculated Space Load
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={3} className="p-2 border-r font-semibold">
                    Cooling
                  </td>
                  <td className="p-2 w-min">Sensible</td>
                  <td className="p-2 w-min">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                      value={parameters.sensibleHeat}
                      step={0.1}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.valueAsNumber))) return;
                        setParameters({
                          ...parameters,
                          sensibleHeat: e.target.valueAsNumber,
                        });
                      }}
                    />
                  </td>
                  <td className="p-2">kW</td>
                </tr>

                <tr>
                  <td className="p-2">Latent</td>
                  <td className="p-2">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                      value={parameters.latentHeat}
                      step={0.1}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.valueAsNumber))) return;
                        setParameters({
                          ...parameters,
                          latentHeat: e.target.valueAsNumber,
                        });
                      }}
                    />
                  </td>
                  <td className="p-2">kW</td>
                </tr>
                <tr>
                  <td className="p-2">Space SHR</td>
                  <td className="p-2 text-center text-red-500">
                    {Math.round(sensibleHeatRatio * 1000) / 1000}
                  </td>
                </tr>

                <tr>
                  <td className="p-2 border-r border-t font-semibold">
                    Heating
                  </td>
                  <td className="p-2 border-t">Total Space</td>
                  <td className="p-2 border-t">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                    />
                  </td>
                  <td className="p-2 border-t">kW</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="items-start w-full">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={4} className="text-left italic">
                    Air Flow Rates
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2">
                    Q<sub>s</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2">ρ</td>
                  <td className="p-2">×</td>
                  <td className="p-2">C</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (t<sub>r</sub>
                  </td>
                  <td className="p-2"> - </td>
                  <td className="p-2  text-center">
                    t<sub>s1</sub>)
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-red-500">
                    {parameters.sensibleHeat}
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td colSpan={3} className="p-2 text-center">
                    1.22
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center text-red-500">
                    ({roomState.dryBulb?.toFixed(2)}
                  </td>
                  <td className="p-2"> - </td>
                  <td className="p-2 text-center text-red-500">
                    {coolingCoilState.dryBulb?.toFixed(2)})
                  </td>
                </tr>

                <tr>
                  <td className="p-2">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2"> = </td>
                  <td className="p-2 text-center text-red-500">
                    {caclulatedSupplyAir ? caclulatedSupplyAir.toFixed(3) : "-"}
                  </td>
                  <td className="p-2">
                    m<sup>3</sup>/s
                  </td>
                </tr>

                <tr>
                  <td className="p-2">
                    Supply air V<sub>s</sub>
                  </td>
                  <td className="p-2"> = </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={parameters.supplyAirVolume}
                      step={0.1}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.valueAsNumber))) return;
                        setParameters({
                          ...parameters,
                          supplyAirVolume: e.target.valueAsNumber,
                        });
                      }}
                      className="bg-cyan-100 border w-16 text-center"
                    />
                  </td>
                  <td className="p-2">
                    m<sup>3</sup>/s
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-2">
                    Fresh air V<sub>o</sub>
                  </td>
                  <td className="p-2"> = </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={parameters.freshAirVolume}
                      className="bg-cyan-100 border w-16 text-center"
                      step={0.1}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.valueAsNumber))) return;
                        setParameters({
                          ...parameters,
                          freshAirVolume: e.target.valueAsNumber,
                        });
                      }}
                    />
                  </td>
                  <td className="p-2">
                    m<sup>3</sup>/s
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-2">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2"> = </td>
                  <td className="p-2 text-center">
                    V<sub>r</sub>
                  </td>
                  <td className="p-2">+</td>
                  <td className="p-2">
                    V<sub>o</sub>
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-blue-500">
                    {parameters.supplyAirVolume}
                  </td>
                  <td className="p-2"> = </td>
                  <td className="p-2 text-center">
                    V<sub>r</sub>
                  </td>
                  <td className="p-2">+</td>
                  <td className="p-2 text-blue-500">
                    {parameters.freshAirVolume}
                  </td>
                </tr>

                <tr>
                  <td className="p-2">
                    Return air V<sub>r</sub>
                  </td>
                  <td className="p-2"> = </td>
                  <td className="p-2 text-center text-red-500">
                    {(Math.round(returnAirVolume * 1000) / 1000).toFixed(3)}
                  </td>
                  <td className="p-2">
                    m<sup>3</sup>/s
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full flex flex-row space-x-8">
          <div className="w-auto">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={4} className="text-left italic">
                    Water Temperatures
                  </th>
                </tr>
                <tr className="border-b">
                  <th className="font-normal"></th>
                  <th className="font-normal">Supply</th>
                  <th className="font-normal">Return</th>
                  <th className="font-normal"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-r font-semibold">CHWS/R</td>
                  <td className="p-2 w-min">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                      value={parameters.chilledWaterTemperature[0].toFixed(1)}
                      step={0.1}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.valueAsNumber))) return;
                        setParameters({
                          ...parameters,
                          chilledWaterTemperature: [
                            e.target.valueAsNumber,
                            parameters.chilledWaterTemperature[1],
                          ],
                        });
                      }}
                    />
                  </td>
                  <td className="p-2 w-min">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                      value={parameters.chilledWaterTemperature[1].toFixed(1)}
                      step={0.1}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.valueAsNumber))) return;
                        setParameters({
                          ...parameters,
                          chilledWaterTemperature: [
                            parameters.chilledWaterTemperature[0],
                            e.target.valueAsNumber,
                          ],
                        });
                      }}
                    />
                  </td>
                  <td className="p-2">°C</td>
                </tr>

                <tr>
                  <td className="p-2 border-r font-semibold">HWS/R</td>
                  <td className="p-2 w-min">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                    />
                  </td>
                  <td className="p-2 w-min">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                    />
                  </td>
                  <td className="p-2">°C</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-auto">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={4} className="text-left italic border-b">
                    Water Pipe Sizing Criteria
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-r font-semibold">Max. Velocity</td>
                  <td className="p-2 w-min">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                      value={parameters.maxVelocity}
                      step={0.1}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.valueAsNumber))) return;
                        setParameters({
                          ...parameters,
                          maxVelocity: e.target.valueAsNumber,
                        });
                      }}
                    />
                  </td>

                  <td className="p-2">m/s</td>
                </tr>

                <tr>
                  <td className="p-2 border-r font-semibold">
                    Max. Pressure Drop
                  </td>
                  <td className="p-2 w-min">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                      value={parameters.maxPressureDrop}
                      min={0}
                      step={10}
                      onChange={(e) => {
                        if (isNaN(Number(e.target.valueAsNumber))) return;
                        setParameters({
                          ...parameters,
                          maxPressureDrop: e.target.valueAsNumber,
                        });
                      }}
                    />
                  </td>

                  <td className="p-2">Pa/m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        ref={ref}
        className="grow flex flex-col p-4 space-y-5 overflow-y-auto"
      >
        <div className="flex flex-row space-x-4 w-full">
          <div className="w-full">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={4} className="text-left italic">
                    On-Coil Status (Mixing Point)
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2 text-center">
                    t<sub>m,DB</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>r</sub>
                  </td>
                  <td className="p-2 text-center">
                    t<sub>r,DB</sub>
                  </td>
                  <td className="p-2">+</td>
                  <td className="p-2 text-center">
                    V<sub>o</sub>
                  </td>
                  <td className="p-2 text-center">
                    t<sub>o,DB</sub>
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2 text-center">
                    t<sub>m,DB</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {returnAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2 text-center">
                    {roomState?.dryBulb.toFixed(1)}
                  </td>
                  <td className="p-2">+</td>
                  <td className="p-2 text-center">
                    {parameters.freshAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2 text-center">
                    {outdoorState.dryBulb.toFixed(1)}
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2 text-center text-red-500">
                    t<sub>m,DB</sub>
                  </td>
                  <td className="p-2 text-red-500">=</td>
                  <td className="p-2 text-red-500" colSpan={3}>
                    {mixingDryBulb?.toFixed(1)} °C
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2 text-center">
                    h<sub>m</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>r</sub>
                  </td>
                  <td className="p-2 text-center">
                    h<sub>r</sub>
                  </td>
                  <td className="p-2">+</td>
                  <td className="p-2 text-center">
                    V<sub>o</sub>
                  </td>
                  <td className="p-2 text-center">
                    h<sub>o</sub>
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2 text-center">
                    h<sub>m</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {returnAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2 text-center">
                    {(roomState?.enthalpy / 1000).toFixed(2)}
                  </td>
                  <td className="p-2">+</td>
                  <td className="p-2 text-center">
                    {parameters.freshAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2 text-center">
                    {(outdoorState.enthalpy / 1000).toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2 text-center text-red-500">
                    h<sub>m</sub>
                  </td>
                  <td className="p-2 text-red-500">=</td>
                  <td className="p-2 text-red-500" colSpan={3}>
                    {(mixingEnthalpy! / 1000).toFixed(1)} kJ/kg
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2 text-center">
                    w<sub>m</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>r</sub>
                  </td>
                  <td className="p-2 text-center">
                    w<sub>r</sub>
                  </td>
                  <td className="p-2">+</td>
                  <td className="p-2 text-center">
                    V<sub>o</sub>
                  </td>
                  <td className="p-2 text-center">
                    w<sub>o</sub>
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2 text-center">
                    w<sub>m</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {returnAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2 text-center">
                    {(roomState?.humidityRatio).toFixed(4)}
                  </td>
                  <td className="p-2">+</td>
                  <td className="p-2 text-center">
                    {parameters.freshAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2 text-center">
                    {(outdoorState?.humidityRatio).toFixed(4)}
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2 text-center text-red-500">
                    h<sub>m</sub>
                  </td>
                  <td className="p-2 text-red-500">=</td>
                  <td className="p-2 text-red-500" colSpan={3}>
                    {mixingHumidityRatio?.toFixed(4)} kJ/kg dry air
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-2 text-center text-blue-500" colSpan={5}>
                    Wet Bulb Temperature by Psy.Chart
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2 text-center text-red-500">
                    t<sub>m,WB</sub>
                  </td>
                  <td className="p-2 text-red-500">=</td>
                  <td className="p-2 text-red-500" colSpan={3}>
                    {mixingWetBulb?.toFixed(1)} °C
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full flex flex-col">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={4} className="text-left italic">
                    Ventilation Load
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2 text-center">
                    Q<sub>vent</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>o</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">ρ</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (h<sub>o</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    h<sub>r</sub>)
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {parameters.freshAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">1.20</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    ({(outdoorState.enthalpy / 1000).toFixed(3)}
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    {(roomState.enthalpy / 1000).toFixed(3)})
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-red-500">
                    {qVent?.toFixed(3)}
                  </td>
                  <td className="p-2 text-red-500">kW</td>
                </tr>
              </tbody>
            </table>

            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={10} className="text-left italic">
                    Available Space Sensible Load from AHU
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2 text-center">
                    Q<sub>S,space</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">ρ</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">C</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (t<sub>r</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    t<sub>s1</sub>)
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center" colSpan={3}>
                    1.22
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    ({roomState.dryBulb.toFixed(3)}
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    {coolingCoilState.dryBulb.toFixed(3)})
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-red-500">
                    {qS?.toFixed(3)}
                  </td>
                  <td className="p-2 text-red-500">kW</td>
                </tr>
              </tbody>
            </table>

            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={10} className="text-left italic">
                    Available Space Latent Load from AHU
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2 text-center">
                    Q<sub>L,space</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">ρ</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (w<sub>r</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    w<sub>s1</sub>)
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    h<sub>fg</sub>
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">1.2</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    ({roomState.humidityRatio.toFixed(4)}
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    {coolingCoilState.humidityRatio.toFixed(4)})
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">2500.8</td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-red-500">
                    {qL?.toFixed(3)}
                  </td>
                  <td className="p-2 text-red-500">kW</td>
                  <td colSpan={10} className="p-2 text-green-500 font-semibold">
                    Available Room SHR = {roomSHR?.toFixed(3)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-row space-x-4 w-full">
          <div className="w-full">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={4} className="text-left italic">
                    Coil Load
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td colSpan={10} className="p-2 font-semibold">
                    Total Cooling Coil Load
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">
                    Q<sub>coil</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">ρ</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (h<sub>m</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    h<sub>s1</sub>)
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">1.20</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    ({mixingEnthalpy && (mixingEnthalpy / 1000).toFixed(3)}
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    {(roomState.enthalpy / 1000).toFixed(3)})
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-red-500">
                    {qCoil?.toFixed(3)}
                  </td>
                  <td className="p-2 text-red-500">kW</td>
                </tr>

                <tr className="border-t">
                  <td colSpan={10} className="p-2 font-semibold">
                    Sensible Cooling Coil Load
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">
                    Q<sub>sc</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">ρ</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">C</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (t<sub>m</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    t<sub>s1</sub>)
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center" colSpan={3}>
                    1.22
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    ({mixingDryBulb && mixingDryBulb.toFixed(1)}
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    {coolingCoilState.dryBulb.toFixed(1)})
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-red-500">
                    {qSC?.toFixed(3)}
                  </td>
                  <td className="p-2 text-red-500">kW</td>
                  <td colSpan={10} className="p-2 text-green-500 font-semibold">
                    Coil SHR = {coilSHR?.toFixed(3)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full flex-col space-y-5 flex">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={10} className="text-left italic">
                    Actual Achievable Room Temperature
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2 text-center">
                    Q<sub>S,space</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">ρ</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">C</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (t<sub>r</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    t<sub>s1</sub>)
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">{qS?.toFixed(3)}</td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center" colSpan={3}>
                    1.22
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (t<sub>r</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    {coolingCoilState.dryBulb.toFixed(3)})
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">
                    t<sub>r</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-orange-500">
                    {tR?.toFixed(3)}
                  </td>
                  <td className="p-2 text-orange-500">°C</td>
                </tr>
              </tbody>
            </table>

            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={10} className="text-left italic">
                    Actual Achievable Room Relative Humidity
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2 text-center">
                    Q<sub>L,space</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">ρ</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (w<sub>r</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    w<sub>s1</sub>)
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    h<sub>fg</sub>
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">{qL?.toFixed(3)}</td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">1.2</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (w<sub>r</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    {coolingCoilState.humidityRatio.toFixed(4)})
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">2500.8</td>
                </tr>

                <tr>
                  <td className="p-2 text-center">
                    w<sub>r</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-orange-500">
                    {wR?.toFixed(4)}
                  </td>
                  <td className="p-2 text-orange-500">kg/kg</td>
                  <td className="p-2 text-purple-500" colSpan={3}>
                    RH = {relHumR?.toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-row space-x-4 w-full">
          <div className="w-full flex flex-col space-y-5">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={4} className="text-left italic">
                    Water Flow Rate
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td colSpan={10} className="p-2 font-semibold">
                    Cooling Coil
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">
                    Q<sub>coil</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">m (L/s)</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    C<sub>w</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (t<sub>CHWR</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    t<sub>CHWS</sub>)
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">{qCoil?.toFixed(3)}</td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">m (L/s)</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">4.185</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    ({parameters.chilledWaterTemperature[1].toFixed(1)}
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    {parameters.chilledWaterTemperature[0].toFixed(1)})
                  </td>
                </tr>

                <tr>
                  <td className="p-2 text-center">
                    m<sub>CHWS/R</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-red-500">
                    {mCHWSR?.toFixed(1)}
                  </td>
                  <td className="p-2 text-red-500">L/s</td>
                  <td className="p-2 text-blue-500">(⌀{pipeSize})</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full">
            <table className="table-fixed">
              <thead>
                <tr>
                  <th colSpan={10} className="text-left italic border-b">
                    Available Dehumidifcation (Condensate)
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-2 text-center">
                    W<sub>p</sub>
                  </td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">ρ</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    (w<sub>m</sub>
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    w<sub>s1</sub>)
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    {parameters.supplyAirVolume.toFixed(3)}
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">1.20</td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">
                    ({mixingHumidityRatio?.toFixed(4)}
                  </td>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">
                    {coolingCoilState.humidityRatio.toFixed(4)})
                  </td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-red-500">
                    {wP?.toFixed(4)}
                  </td>
                  <td className="p-2 text-red-500">kg/s</td>
                </tr>

                <tr>
                  <td />
                  <td className="p-2">=</td>
                  <td className="p-2 text-center text-blue-500">
                    {wPHr?.toFixed(1)}
                  </td>
                  <td className="p-2 text-blue-500">kg/hr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full">
          <div className="italic font-bold">Results </div>
          {roomSHR && roomSHR >= sensibleHeatRatio ? (
            <span className="px-4 font-bold text-4xl text-green-500">OK</span>
          ) : (
            <span className="px-4 font-bold text-4xl text-red-500">NOT OK</span>
          )}
        </div>

        <div className="w-full">
          {width && (
            <PsyChart states={states} width={width} height={(width * 4) / 5} />
          )}
        </div>
      </div>
    </div>
  );
}
