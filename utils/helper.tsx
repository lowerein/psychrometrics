import psychrolib from "./psychrolib";
import { psychrometrics } from "./psychrometrics";

const range = (min: number, max: number, stepsize: number) => {
  var toReturn = min % stepsize === 0 ? [] : [min];
  var n = 0;
  var baseValue = stepsize * Math.ceil(min / stepsize);
  while (baseValue + n * stepsize < max) {
    toReturn.push(baseValue + n * stepsize);
    n = n + 1;
  }

  toReturn.push(max);
  return toReturn;
};

const getIntersection = (a: number, b: number, c: number, d: number) => {
  let x = (d - c) / (a - b);
  let y = a * x + c;
  return { x, y };
};

const getPsychrometrics = (
  dryBulb?: number,
  wetBulb?: number,
  rh?: number,
  pressure = 101325
) => {
  if (dryBulb === undefined && wetBulb === undefined)
    throw new Error("Incorrect parameter");

  if (dryBulb === undefined && rh === undefined)
    throw new Error("Incorrect parameter");

  if (wetBulb != undefined && !isNaN(Number(wetBulb))) {
    const psychrometrics = psychrolib.CalcPsychrometricsFromTWetBulb(
      dryBulb,
      wetBulb,
      pressure
    );

    return {
      dryBulb: dryBulb,
      wetBulb: wetBulb,
      humidityRatio: psychrometrics[0],
      dewTemp: psychrometrics[1],
      relHum: psychrometrics[2],
      vapPressure: psychrometrics[3],
      enthalpy: psychrometrics[4],
      volume: psychrometrics[5],
      degreeOfSat: psychrometrics[6],
    } as psychrometrics;
  } else {
    const psychrometrics = psychrolib.CalcPsychrometricsFromRelHum(
      dryBulb,
      rh! * 0.01,
      pressure
    );

    return {
      dryBulb: dryBulb,
      wetBulb: psychrometrics[1],
      humidityRatio: psychrometrics[0],
      dewTemp: psychrometrics[2],
      relHum: rh! / 100,
      vapPressure: psychrometrics[3],
      enthalpy: psychrometrics[4],
      volume: psychrometrics[5],
      degreeOfSat: psychrometrics[6],
    } as psychrometrics;
  }
};

export { range, getIntersection, getPsychrometrics };
