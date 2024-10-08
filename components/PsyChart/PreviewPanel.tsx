import { psychrometrics } from "@/utils/psychrometrics";

export const PreviewPanel = ({ state }: { state: psychrometrics }) => {
  return (
    <div className="absolute top-0 left-0 flex flex-row m-2 text-sm space-x-2">
      <div className="flex flex-col font-semibold">
        <div>
          T<sub>db</sub>:
        </div>
        <div>w: </div>
        <div>RH:</div>
        <div>
          T<sub>wb</sub>:
        </div>
        <div>
          T<sub>dew</sub>:
        </div>
        <div>
          P<sub>vap</sub>:
        </div>
        <div>h: </div>
        <div>
          V<sub>s</sub>:
        </div>
      </div>

      <div className="flex flex-col">
        <div>{(Math.round(state.dryBulb * 1000) / 1000).toFixed(3)}</div>
        <div>
          {(Math.round(state.humidityRatio * 1000 * 1000) / 1000).toFixed(3)}
        </div>
        <div>{(Math.round(state.relHum * 100 * 100) / 100).toFixed(3)}%</div>
        <div>{(Math.round(state.wetBulb * 1000) / 1000).toFixed(3)}</div>
        <div>{(Math.round(state.dewTemp * 1000) / 1000).toFixed(3)}</div>
        <div>{(Math.round(state.vapPressure * 1000) / 1000).toFixed(3)}</div>
        <div>{(Math.round(state.enthalpy) / 1000).toFixed(3)}</div>
        <div>{(Math.round(state.volume * 1000) / 1000).toFixed(3)}</div>
      </div>
    </div>
  );
};
