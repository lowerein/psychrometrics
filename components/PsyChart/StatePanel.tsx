import { psychrometrics } from "@/utils/psychrometrics";
import { MouseEventHandler } from "react";

export const StatePanel = ({
  state,
  deleteHandler,
}: {
  state: psychrometrics;
  deleteHandler?: MouseEventHandler;
}) => {
  return (
    <div className="rounded-lg w-full p-4">
      <div className="">
        <div className="w-full flex flex-row justify-between">
          <div className="font-semibold">{state.name}</div>
          {deleteHandler && (
            <div
              onClick={deleteHandler}
              className="text-red-500 cursor-pointer hover:font-bold"
            >
              Delete
            </div>
          )}
        </div>
        <table className="table-auto w-full">
          <thead className="border-b border-neutral-200 text-left">
            <tr>
              <th className="font-normal">Property</th>
              <th className="font-normal">Value</th>
              <th className="font-normal">Units</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-2">
                T<sub>db</sub>
              </td>
              <td>{(Math.round(state.dryBulb * 1000) / 1000).toFixed(3)}</td>
              <td>°C</td>
            </tr>
            <tr>
              <td className="px-2">W</td>
              <td>
                {(Math.round(state.humidityRatio * 1000 * 1000) / 1000).toFixed(
                  3
                )}
              </td>
              <td>g / kg</td>
            </tr>
            <tr>
              <td className="px-2">RH</td>
              <td>{(Math.round(state.relHum * 100 * 100) / 100).toFixed(3)}</td>
              <td>%</td>
            </tr>

            <tr>
              <td className="px-2">
                T<sub>wb</sub>
              </td>
              <td>{(Math.round(state.wetBulb * 1000) / 1000).toFixed(3)}</td>
              <td>°C</td>
            </tr>

            <tr>
              <td className="px-2">
                T<sub>dew</sub>
              </td>
              <td>{(Math.round(state.dewTemp * 1000) / 1000).toFixed(3)}</td>
              <td>°C</td>
            </tr>

            <tr>
              <td className="px-2">
                T<sub>vap</sub>
              </td>
              <td>
                {(Math.round(state.vapPressure * 1000) / 1000).toFixed(3)}
              </td>
              <td>Pa</td>
            </tr>

            <tr>
              <td className="px-2">S</td>
              <td>
                {(Math.round(state.degreeOfSat * 100 * 1000) / 1000).toFixed(3)}
              </td>
              <td>%</td>
            </tr>

            <tr>
              <td className="px-2">h</td>
              <td>{(Math.round(state.enthalpy) / 1000).toFixed(3)}</td>
              <td>kJ / kg</td>
            </tr>
            <tr>
              <td className="px-2">
                V<sub>s</sub>
              </td>
              <td>{(Math.round(state.volume * 1000) / 1000).toFixed(3)}</td>
              <td>m³ / kg</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
