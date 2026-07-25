import json
import pickle
import sys
from pathlib import Path

import numpy as np
import pandas as pd

MODEL_PATH = Path(__file__).resolve().parent / "sarimax_model.pkl"
DATA_PATH = Path(__file__).resolve().parent / "tirupati_post_covid_processed.csv"


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


def normalize_date(value):
    return pd.Timestamp(value).normalize()


def get_feature_rows(df, features, dates):
    requested_dates = [normalize_date(date) for date in dates]
    indexed = df.set_index("date")

    missing = [
        date.strftime("%Y-%m-%d")
        for date in requested_dates
        if date not in indexed.index
    ]
    if missing:
        raise ValueError(
            "Exogenous feature rows are missing for date(s): "
            + ", ".join(missing)
        )

    return indexed.loc[requested_dates, features].astype(float).to_numpy()


def sequential_dates(start_date, count):
    start = normalize_date(start_date)
    return [start + pd.Timedelta(days=offset) for offset in range(count)]


def main():
    payload = read_payload()
    append_actual = payload.get("appendActual")
    append_actuals = payload.get("appendActuals")
    forecast_start_date = payload.get("forecastStartDate")
    steps = payload.get("steps", 1)

    with MODEL_PATH.open("rb") as model_file:
        model_data = pickle.load(model_file)

    if not isinstance(model_data, dict) or "model" not in model_data:
        raise ValueError("Unexpected model file structure")

    model = model_data["model"]
    features = model_data.get("features")
    buffer = float(model_data.get("buffer", 0))

    if not features:
        raise ValueError("Model artifact does not include feature metadata")

    df = pd.read_csv(DATA_PATH)
    df["date"] = pd.to_datetime(df["date"]).dt.normalize()

    model_end_date = df.iloc[model.nobs - 1]["date"]

    appended_dates = []
    appended_values = []

    if append_actuals is not None:
        if not isinstance(append_actuals, list):
            raise ValueError("appendActuals must be a list")
        for item in append_actuals:
            appended_dates.append(normalize_date(item["date"]))
            appended_values.append(normalize_actual_value(item["actualCount"]))
    elif append_actual is not None:
        if isinstance(append_actual, list):
            appended_values = [normalize_actual_value(v) for v in append_actual]
        else:
            appended_values = [normalize_actual_value(append_actual)]
        appended_dates = sequential_dates(
            model_end_date + pd.Timedelta(days=1),
            len(appended_values),
        )

    if appended_values:
        # Prepare exogenous features for the appended dates
        append_exog = get_feature_rows(df, features, appended_dates)
        new_endog = np.asarray(appended_values, dtype=float)
        model = model.append(new_endog, exog=append_exog, refit=False)
        # Extend the original dataframe with the new actual entries to keep feature alignment
        # Create a DataFrame for the new rows (dates and features)
        new_rows = pd.DataFrame({
            "date": appended_dates,
        })
        # Populate feature columns from the exogenous matrix
        for idx, feat in enumerate(features):
            # Handle case where exogenous matrix is 1D
            if append_exog.ndim == 1:
                new_rows[feat] = append_exog
            else:
                new_rows[feat] = append_exog[:, idx]
        # Concatenate and ensure date column is normalized
        df = pd.concat([df, new_rows], ignore_index=True)
        df["date"] = pd.to_datetime(df["date"]).dt.normalize()

    if forecast_start_date is None:
        last_observed_date = (
            max(appended_dates)
            if appended_dates
            else model_end_date
        )
        forecast_start_date = last_observed_date + pd.Timedelta(days=1)

    forecast_dates = sequential_dates(forecast_start_date, steps)
    next_exog = get_feature_rows(df, features, forecast_dates)
    forecast_values = model.forecast(steps, exog=next_exog)

    if hasattr(forecast_values, "to_list"):
        forecast_list = [int(round(x + buffer)) for x in forecast_values.to_list()]
    elif hasattr(forecast_values, "iloc"):
        forecast_list = [int(round(x + buffer)) for x in forecast_values.iloc]
    elif isinstance(forecast_values, (list, tuple, np.ndarray)):
        forecast_list = [int(round(x + buffer)) for x in forecast_values]
    else:
        forecast_list = [int(round(forecast_values + buffer))]

    if steps == 1:
        result = {
            "predictedCount": forecast_list[0],
            "forecastDate": forecast_dates[0].strftime("%Y-%m-%d"),
        }
    else:
        result = {
            "predictedCounts": forecast_list,
            "forecastDates": [date.strftime("%Y-%m-%d") for date in forecast_dates],
        }
    sys.stdout.write(json.dumps(result))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.write(json.dumps({"error": str(exc)}))
        sys.exit(1)
