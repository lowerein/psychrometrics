import { psychrometrics } from "@/utils/psychrometrics";

export const StatePanel = ({ state }: { state: psychrometrics }) => {
  return (
    <div className="p-4 rounded-lg">
      <table className="table-fixed ">
        <thead className="border-b border-neutral-200 text-left font-normal">
          <tr>
            <th>Proprety</th>
            <th>Value</th>
            <th>Units</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-neutral-200">
            <td className="py-2">Dry Bulb Temperature</td>
            <td>{(Math.round(state.dryBulb * 1000) / 1000).toFixed(3)}</td>
            <td>1961</td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="py-2">Humidity Ratio</td>
            <td>
              {(Math.round(state.humidityRatio * 1000 * 1000) / 1000).toFixed(
                3
              )}
            </td>
            <td>g / kg</td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="py-2">Relative Humidity</td>
            <td>{(Math.round(state.relHum * 100 * 100) / 100).toFixed(3)}</td>
            <td>%</td>
          </tr>

          <tr className="border-b border-neutral-200">
            <td className="py-2">Wet Bulb Temperature</td>
            <td>{(Math.round(state.wetBulb * 1000) / 1000).toFixed(3)}</td>
            <td>C</td>
          </tr>

          <tr className="border-b border-neutral-200">
            <td className="py-2">Dew Point</td>
            <td>{(Math.round(state.dewTemp * 1000) / 1000).toFixed(3)}</td>
            <td>C</td>
          </tr>

          <tr className="border-b border-neutral-200">
            <td className="py-2">Vapoure Pressure</td>
            <td>{(Math.round(state.vapPressure * 1000) / 1000).toFixed(3)}</td>
            <td>Pa</td>
          </tr>

          <tr className="border-b border-neutral-200">
            <td className="py-2">Degree of Saturation</td>
            <td>
              {(Math.round(state.degreeOfSat * 100 * 1000) / 1000).toFixed(3)}
            </td>
            <td>%</td>
          </tr>

          <tr className="border-b border-neutral-200">
            <td className="py-2">Enthalpy</td>
            <td>{(Math.round(state.enthalpy) / 1000).toFixed(3)}</td>
            <td>kJ / kg</td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="py-2">Specific Volume</td>
            <td>{(Math.round(state.volume * 1000) / 1000).toFixed(3)}</td>
            <td>m^3 / kg</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
