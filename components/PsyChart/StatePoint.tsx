import { psychrometrics } from "@/utils/psychrometrics";

export const StatePoint = ({
  states,
  xScale,
  yScale,
  line,
  color = "red",
}: {
  states: psychrometrics[];
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  line: d3.Line<[number, number]>;
  color?: string;
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
        <>
          <circle
            className="z-50"
            fill={color}
            key={`state-${index}-dot`}
            cx={xScale(state.dryBulb)}
            cy={yScale(state.humidityRatio)}
            r={6}
          />

          {state.name && state.name.length > 0 && (
            <text
              key={`state-${index}-text`}
              x={xScale(state.dryBulb)}
              y={yScale(state.humidityRatio)}
              className="stroke-black"
              textAnchor="middle"
              dominantBaseline="hanging"
              transform="translate(0,6)"
            >
              {state.name}
            </text>
          )}
        </>
      ))}
    </>
  );
};
