import { psychrometrics } from "@/utils/psychrometrics";

export const StatePoint = ({
  states,
  xScale,
  yScale,
  line,
}: {
  states: psychrometrics[];
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  line: d3.Line<[number, number]>;
}) => {
  return (
    <>
      {states.map((state, index) => {
        const nextState = states[index < states.length - 1 ? index + 1 : 0];
        const linePath = [
          [state.dryBulb, state.humidityRatio],
          [nextState.dryBulb, nextState.humidityRatio],
        ] as [number, number][];

        return (
          <path
            d={line(linePath)!}
            className="stroke-black stroke-1"
            key={`state-${index}-line`}
            fill="none"
          />
        );
      })}

      {states.map((state, index) => (
        <circle
          className="z-50"
          fill="red"
          key={`state-${index}-dot`}
          cx={xScale(state.dryBulb)}
          cy={yScale(state.humidityRatio)}
          r={6}
        />
      ))}
    </>
  );
};
