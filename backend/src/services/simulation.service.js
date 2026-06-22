import dotenv from "dotenv";
dotenv.config();

let isSimulationMode = process.env.SIMULATION_MODE === "true";
let simulatedDate = process.env.SIMULATED_DATE 
  ? new Date(Date.UTC(
      Number(process.env.SIMULATED_DATE.split("-")[0]),
      Number(process.env.SIMULATED_DATE.split("-")[1]) - 1,
      Number(process.env.SIMULATED_DATE.split("-")[2]),
      0, 0, 0, 0
    ))
  : new Date(Date.UTC(2025, 4, 31, 0, 0, 0, 0)); // Default: 2025-05-31

export const normalizeToUTC = (dateInput) => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
};

export const isSimulationModeEnabled = () => {
  return isSimulationMode;
};

export const getSimulatedDate = () => {
  return simulatedDate;
};

export const setSimulationConfig = ({ enabled, date }) => {
  if (enabled !== undefined) {
    isSimulationMode = !!enabled;
  }
  if (date) {
    simulatedDate = normalizeToUTC(date);
  }
  return {
    simulationMode: isSimulationMode,
    simulatedDate: simulatedDate.toISOString().split("T")[0]
  };
};

export const getCurrentDate = () => {
  if (isSimulationMode) {
    return new Date(simulatedDate);
  }
  const now = new Date();
  return normalizeToUTC(now);
};
