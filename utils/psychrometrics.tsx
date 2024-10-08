export interface psychrometrics {
  name?: string;
  isVisible?: boolean;
  dryBulb: number;
  wetBulb: number;
  humidityRatio: number;
  dewTemp: number;
  relHum: number;
  vapPressure: number;
  enthalpy: number;
  volume: number;
  degreeOfSat: number;
}
