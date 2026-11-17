"""
Build the JSON datasets used by the meteorological project page.

Reads the cleaned Meteocat CSVs from the VO-evolution repository and writes
compact, web-ready aggregates to public/data/meteo/. Every number shown on the
website comes from this script: nothing is typed in by hand.

Trend statistics reuse the repository's own implementation
(scripts/statistical_tests.py: Mann-Kendall via Kendall's tau, Theil-Sen slope).
LOESS smoothing uses statsmodels' lowess.

Usage:
    python scripts/build_meteo_data.py <path-to-VO-evolution> [out_dir]
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from statsmodels.nonparametric.smoothers_lowess import lowess

REPO = Path(sys.argv[1]).resolve()
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else Path(__file__).parent.parent / "public/data/meteo")
OUT.mkdir(parents=True, exist_ok=True)

sys.path.insert(0, str(REPO / "scripts"))
from statistical_tests import mann_kendall, sens_slope  # noqa: E402  (repo module)

DATA = REPO / "Cleaned Data"

STATIONS = {
    "sbd-nord": {"file": "Sbd_nord_daily.csv", "index_col": None},
    "sbd-centre": {"file": "Sbd_Centre_daily.csv", "index_col": 0},
    "vacarisses": {"file": "Vacarisses_daily.csv", "index_col": None},
}

# variable id -> (column, aggregation)
VARIABLES = {
    "t_avg": ("T_avg", "mean"),
    "t_max": ("T_max", "mean"),
    "t_min": ("T_min", "mean"),
    "rain": ("rain_mm", "sum"),
    "humidity": ("humidity_avg", "mean"),
    "pressure": ("pressure_avg", "mean"),
}

MONTH_MIN_COVERAGE = 0.80
YEAR_MIN_COVERAGE = 0.90


def r(x, nd=2):
    if x is None or (isinstance(x, float) and not np.isfinite(x)):
        return None
    return round(float(x), nd)


def load(station: str) -> pd.DataFrame:
    cfg = STATIONS[station]
    df = pd.read_csv(DATA / cfg["file"], index_col=cfg["index_col"])
    df["date"] = pd.to_datetime(df["date"])
    df = df.drop_duplicates("date").set_index("date").sort_index()
    # Re-index to a full daily calendar so coverage is measured honestly.
    full = pd.date_range(df.index.min(), df.index.max(), freq="D")
    return df.reindex(full)


def calendar_days(index: pd.DatetimeIndex, freq: str) -> pd.Series:
    """Full calendar length of each period (so partial first/last years fail coverage)."""
    if freq == "YS":
        return pd.Series([366 if pd.Timestamp(d).is_leap_year else 365 for d in index], index=index)
    return pd.Series([pd.Timestamp(d).days_in_month for d in index], index=index)


def aggregate(series: pd.Series, how: str, freq: str, min_cov: float) -> pd.Series:
    grp = series.resample(freq)
    n_valid = grp.count()
    n_days = calendar_days(n_valid.index, freq)
    agg = grp.sum(min_count=1) if how == "sum" else grp.mean()
    if how == "sum":
        agg = agg.where(n_valid > 0)
    return agg.where(n_valid / n_days >= min_cov)


def trend_block(years: np.ndarray, values: np.ndarray) -> dict | None:
    mask = np.isfinite(values)
    if mask.sum() < 8:
        return None
    y, v = years[mask], values[mask]
    # Repo functions use the array index as time; pass a gap-free annual series
    # (NaN where a year failed coverage) so slopes are per year.
    full_years = np.arange(y.min(), y.max() + 1)
    series = pd.Series(v, index=y).reindex(full_years).to_numpy()
    mk = mann_kendall(series)
    ss = sens_slope(series)
    smooth = lowess(v, y, frac=0.6, return_sorted=True)
    return {
        "n_years": int(mask.sum()),
        "first_year": int(y.min()),
        "last_year": int(y.max()),
        "tau": r(mk["tau"], 3),
        "p_value": r(mk["p_value"], 4),
        "significant_05": bool(mk["sign_0.05"]),
        "trend": mk["trend"],
        "sen_slope_per_decade": r(ss["slope"] * 10, 3),
        "sen_ci_per_decade": [r(ss["ci_lower"] * 10, 3), r(ss["ci_upper"] * 10, 3)],
        "sen_intercept": r(ss["intercept"], 3),
        "loess": [[int(a), r(b, 3)] for a, b in smooth],
    }


def station_payload(station: str) -> dict:
    df = load(station)
    out: dict = {"id": station, "variables": {}, "indices": {}}
    out["period"] = [df.index.min().strftime("%Y-%m-%d"), df.index.max().strftime("%Y-%m-%d")]
    out["n_days_calendar"] = int(len(df))

    for vid, (col, how) in VARIABLES.items():
        if col not in df.columns or df[col].notna().sum() == 0:
            continue
        s = df[col].astype(float)
        monthly = aggregate(s, how, "MS", MONTH_MIN_COVERAGE)
        annual = aggregate(s, how, "YS", YEAR_MIN_COVERAGE)
        clim = monthly.groupby(monthly.index.month).mean()
        years = annual.index.year.to_numpy()
        vals = annual.to_numpy(dtype=float)
        out["variables"][vid] = {
            "coverage": r(s.notna().mean() * 100, 1),
            "monthly": [[d.strftime("%Y-%m"), r(v)] for d, v in monthly.items()],
            "annual": [[int(y), r(v)] for y, v in zip(years, vals)],
            "climatology": [r(clim.get(m)) for m in range(1, 13)],
            "trend": trend_block(years, vals),
        }

    # Threshold indices (days per year), only for years passing coverage on T.
    def count_index(col, cond, name):
        if col not in df.columns:
            return
        s = df[col].astype(float)
        n_valid = s.notna().resample("YS").sum()
        valid = n_valid / calendar_days(n_valid.index, "YS") >= YEAR_MIN_COVERAGE
        counts = cond(s).resample("YS").sum().where(valid)
        years = counts.index.year.to_numpy()
        vals = counts.to_numpy(dtype=float)
        out["indices"][name] = {
            "annual": [[int(y), None if not np.isfinite(v) else int(v)] for y, v in zip(years, vals)],
            "trend": trend_block(years, vals),
        }

    count_index("T_min", lambda s: s >= 20, "tropical_nights")
    count_index("T_max", lambda s: s >= 30, "hot_days")
    count_index("T_min", lambda s: s < 0, "frost_days")
    return out


def diurnal_samples() -> dict:
    """Real 30-min temperature curves at Sabadell Nord (the ML target)."""
    df = pd.read_csv(DATA / "Sbd_nord_hourly.csv", usecols=["datetime_utc", "T_avg"])
    df["datetime_utc"] = pd.to_datetime(df["datetime_utc"])
    df["day"] = df["datetime_utc"].dt.normalize()
    picks = {}
    targets = {"winter": "2023-01-18", "spring": "2023-04-19", "summer": "2023-07-19", "autumn": "2023-10-18"}
    for season, date in targets.items():
        d = pd.Timestamp(date)
        # walk forward until a complete 48-slot day is found
        for k in range(30):
            day = df[df["day"] == d + pd.Timedelta(days=k)]
            if len(day) == 48 and day["T_avg"].notna().all():
                t = day["T_avg"].to_numpy()
                picks[season] = {
                    "date": (d + pd.Timedelta(days=k)).strftime("%Y-%m-%d"),
                    "curve": [r(x, 1) for x in t],
                    "t_min": r(t.min(), 1),
                    "t_max": r(t.max(), 1),
                    "t_avg": r(t.mean(), 2),
                }
                break
    return picks


def main():
    stations = {s: station_payload(s) for s in STATIONS}
    (OUT / "stations.json").write_text(json.dumps(stations, separators=(",", ":")))
    (OUT / "diurnal.json").write_text(json.dumps(diurnal_samples(), separators=(",", ":")))

    # Short human-readable digest printed for review.
    for sid, st in stations.items():
        print(f"\n== {sid}  {st['period']}")
        for vid, v in st["variables"].items():
            t = v["trend"]
            if t:
                print(f"  {vid:9s} cov={v['coverage']:5}%  {t['first_year']}-{t['last_year']} n={t['n_years']:2d}  "
                      f"sen={t['sen_slope_per_decade']:+.3f}/dec  p={t['p_value']}  sig={t['significant_05']}")
        for name, ix in st["indices"].items():
            t = ix["trend"]
            if t:
                print(f"  {name:16s} sen={t['sen_slope_per_decade']:+.2f}/dec p={t['p_value']} sig={t['significant_05']}")
    size = sum(p.stat().st_size for p in OUT.glob("*.json"))
    print(f"\nwrote {OUT} ({size/1024:.0f} KB)")


if __name__ == "__main__":
    main()
