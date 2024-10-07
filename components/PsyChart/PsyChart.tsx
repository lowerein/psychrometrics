import * as d3 from "d3";
import { DryBulb } from "./DryBulb";
import { RelativeHumidity } from "./RelativeHumidity";
import { WetBulb } from "./WetBulb";
import { SpecificVolume } from "./SpecificVolume";
import { HumidityRatio } from "./HumidityRatio";
import { BoundaryLine } from "./BoundaryLine";
import { Enthalpy } from "./Enthalpy";
import { StatePoint } from "./StatePoint";
import { psychrometrics } from "@/utils/psychrometrics";
import { MouseEventHandler } from "react";
import React from "react";

interface PsyChartProps {
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  showDryBulb?: boolean;
  showRelativeHumidity?: boolean;
  showWetBulb?: boolean;
  showSpecificVolume?: boolean;
  showHumidityRatio?: boolean;
  showEnthalpy?: boolean;
  tempRange?: number[];
  wRange?: number[];
  pressure?: number;
  states?: psychrometrics[];
  mouseMoveHandler?: MouseEventHandler;
  mouseClickHandler?: MouseEventHandler;
}

const PsyChart = React.forwardRef<SVGSVGElement, PsyChartProps>(
  (props, ref) => {
    const {
      width = 1000,
      height = 800,
      marginTop = 50,
      marginRight = 80,
      marginBottom = 80,
      marginLeft = 20,
      showDryBulb = true,
      showRelativeHumidity = true,
      showWetBulb = true,
      showSpecificVolume = true,
      showHumidityRatio = true,
      showEnthalpy = true,
      tempRange = [-10, 50],
      wRange = [0, 30 / 1000],
      pressure = 101325,
      states = [],
      mouseMoveHandler = undefined,
      mouseClickHandler = undefined,
    } = props;

    const [minTemp, maxTemp] = tempRange;
    const [minW, maxW] = wRange;

    const xScale = d3.scaleLinear(
      [minTemp, maxTemp],
      [marginLeft, width - marginRight]
    );
    const yScale = d3.scaleLinear(
      [minW, maxW],
      [height - marginBottom, marginTop]
    );
    const line = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    const params = {
      tempRange,
      wRange,
      pressure,
      line,
      xScale,
      yScale,
    };

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        className="border cursor-crosshair"
        onMouseMove={mouseMoveHandler}
        onMouseDown={mouseClickHandler}
      >
        <BoundaryLine {...params} />
        {showDryBulb && <DryBulb {...params} />}
        {showRelativeHumidity && <RelativeHumidity {...params} />}
        {showWetBulb && <WetBulb {...params} />}
        {showSpecificVolume && <SpecificVolume {...params} />}
        {showHumidityRatio && <HumidityRatio {...params} />}
        {showEnthalpy && <Enthalpy {...params} />}
        <StatePoint states={states} {...params} />
      </svg>
    );
  }
);

PsyChart.displayName = "PsyChart";

export default PsyChart;
