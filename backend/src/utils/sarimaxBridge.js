import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_SCRIPT = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "forecaste_model",
  "predict_sarimax.py"
);

export const predictWithSarimax = ({
  appendActualCount,
  appendActuals,
  forecastStartDate,
  steps = 1,
} = {}) => {
  const payload = JSON.stringify({
    ...(appendActualCount !== undefined ? { appendActual: appendActualCount } : {}),
    ...(appendActuals !== undefined ? { appendActuals } : {}),
    ...(forecastStartDate !== undefined ? { forecastStartDate } : {}),
    steps,
  });

  const pythonExecutable = process.env.PYTHON_EXECUTABLE || "python3";

  const result = spawnSync(pythonExecutable, [MODEL_SCRIPT], {
    input: payload,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) {
    throw new Error(`SARIMAX prediction failed: ${result.error.message}`);
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    throw new Error(
      `SARIMAX script failed with status ${result.status}: ${stderr || stdout}`
    );
  }

  let response;
  try {
    response = JSON.parse(result.stdout);
  } catch (parseError) {
    throw new Error(
      `Unable to parse SARIMAX response: ${parseError.message} - output: ${result.stdout}`
    );
  }

  if (response.error) {
    throw new Error(`SARIMAX error: ${response.error}`);
  }

  if (steps === 1) {
    if (typeof response.predictedCount !== "number") {
      throw new Error("SARIMAX response did not include predictedCount");
    }
    return response.predictedCount;
  } else {
    if (!Array.isArray(response.predictedCounts)) {
      throw new Error("SARIMAX response did not include predictedCounts");
    }
    return response.predictedCounts;
  }
};
