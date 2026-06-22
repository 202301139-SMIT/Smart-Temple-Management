import json
import pickle
import sys
from pathlib import Path

import numpy as np

MODEL_PATH = Path(__file__).resolve().parent / "sarimax_model.pkl"


def read_payload():
    raw = sys.stdin.read()
    if not raw.strip():
        return {}

    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON payload: {exc}")


def normalize_actual_value(value):
    return float(value)


def main():
    payload = read_payload()
    append_actual = payload.get("appendActual")
    steps = payload.get("steps", 1)

    with MODEL_PATH.open("rb") as model_file:
        model_data = pickle.load(model_file)

    if not isinstance(model_data, dict) or "model" not in model_data:
        raise ValueError("Unexpected model file structure")

    model = model_data["model"]
    last_exog = model.model.exog[-1:]

    if append_actual is not None:
        if isinstance(append_actual, list):
            actual_values = [normalize_actual_value(v) for v in append_actual]
        else:
            actual_values = [normalize_actual_value(append_actual)]

        for actual_value in actual_values:
            new_endog = np.array([[actual_value]], dtype=float)
            model = model.append(new_endog, exog=last_exog, refit=False)

    next_exog = np.repeat(last_exog, steps, axis=0)
    forecast_values = model.forecast(steps, exog=next_exog)

    if hasattr(forecast_values, "to_list"):
        forecast_list = [int(round(x)) for x in forecast_values.to_list()]
    elif hasattr(forecast_values, "iloc"):
        forecast_list = [int(round(x)) for x in forecast_values.iloc]
    elif isinstance(forecast_values, (list, tuple, np.ndarray)):
        forecast_list = [int(round(x)) for x in forecast_values]
    else:
        forecast_list = [int(round(forecast_values))]

    if steps == 1:
        result = {"predictedCount": forecast_list[0]}
    else:
        result = {"predictedCounts": forecast_list}
    sys.stdout.write(json.dumps(result))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.write(json.dumps({"error": str(exc)}))
        sys.exit(1)
