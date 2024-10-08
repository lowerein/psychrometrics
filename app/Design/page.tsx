export default function Page() {
  return (
    <div className="flex flex-row overflow-y-hidden">
      <div className="border p-4 flex flex-col space-y-5 overflow-y-scroll">
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
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
              </tr>

              <tr>
                <td className="p-2">Winter</td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
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
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
              </tr>

              <tr>
                <td className="p-2">Winter</td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
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
                    value={"Cooling off-coil"}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">
                  <input
                    className="border w-16 text-center bg-cyan-100"
                    type="number"
                    value={35}
                  />
                </td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
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
                      value={35}
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
                      value={35}
                    />
                  </td>
                  <td className="p-2">kW</td>
                </tr>
                <tr>
                  <td className="p-2">Space SHR</td>
                  <td className="p-2 text-center">0.64</td>
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
                      value={35}
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
                  <td className="p-2">47.5</td>
                  <td className="p-2">=</td>
                  <td className="p-2 text-center">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2">×</td>
                  <td colSpan={3} className="p-2 text-center">
                    1.22
                  </td>
                  <td className="p-2">×</td>
                  <td className="p-2 text-center">(22.00</td>
                  <td className="p-2"> - </td>
                  <td className="p-2 text-center">13.50)</td>
                </tr>

                <tr>
                  <td className="p-2">
                    V<sub>s</sub>
                  </td>
                  <td className="p-2"> = </td>
                  <td className="p-2 text-center text-red-500">11</td>
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
                      value={11}
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
                      value={11}
                      className="bg-cyan-100 border w-16 text-center"
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
                  <td className="p-2 text-blue-500">4.600</td>
                  <td className="p-2"> = </td>
                  <td className="p-2 text-center">
                    V<sub>r</sub>
                  </td>
                  <td className="p-2">+</td>
                  <td className="p-2 text-blue-500">3.500</td>
                </tr>

                <tr>
                  <td className="p-2">
                    Return air V<sub>r</sub>
                  </td>
                  <td className="p-2"> = </td>
                  <td className="p-2 text-center text-red-500">1.100</td>
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
                      value={7}
                    />
                  </td>
                  <td className="p-2 w-min">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                      value={12.5}
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
                      value={7}
                    />
                  </td>
                  <td className="p-2 w-min">
                    <input
                      className="border w-16 text-center bg-cyan-100"
                      type="number"
                      value={12.5}
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
                      value={2.5}
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
                      value={300}
                    />
                  </td>

                  <td className="p-2">Pa/m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grow"></div>
    </div>
  );
}
