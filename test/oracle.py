#!/usr/bin/env python3
"""Independent numeric oracle for the Survey Analyser.

Computes the expected KPIs / breakdowns from a fixture CSV WITHOUT running or
importing any of the app's JavaScript, so the app's rendered output can be
diffed against a genuinely second source of truth (Coding V2, Laws 2-3).

Pure standard library (csv, re) — no pandas dependency, so it runs anywhere.

Usage:  python oracle.py [path/to/fixture.csv]   # defaults to clean-survey.csv
Emits a JSON object on stdout.
"""
import csv
import json
import re
import sys
from pathlib import Path

DEFAULT_FIXTURE = Path(__file__).parent / "fixtures" / "clean-survey.csv"

# Independent sentiment lexicon, hand-written HERE (not imported from the app),
# so the sentiment cross-check is a real second opinion.
POS = {
    "supportive", "helpful", "great", "friendly", "love", "inspiring",
    "excellent", "amazing", "fun", "engaging", "wonderful", "fantastic",
    "enjoy", "happy", "support",
}
NEG = {
    "slow", "confusing", "overwhelming", "stressful", "poor", "bad",
    "terrible", "difficult", "frustrating", "unclear", "concern", "problem",
}
NEGATORS = {"not", "no", "never", "dont", "didnt", "cant", "wont", "isnt", "arent"}


def to_number(value):
    stripped = re.sub(r"[,%$ ]", "", str(value))
    try:
        return float(stripped)
    except ValueError:
        return None


def split_multi(value):
    return [t.strip() for t in re.split(r"[;,/|]", str(value)) if t.strip()]


def tally(rows, column):
    out = {}
    for row in rows:
        key = str(row[column]).strip()
        out[key] = out.get(key, 0) + 1
    return out


def sentiment_row(text):
    words = re.sub(r"[^a-z0-9\s'-]", " ", str(text).lower()).split()
    score = 0
    for i, word in enumerate(words):
        value = 1 if word in POS else (-1 if word in NEG else 0)
        if value and i > 0 and words[i - 1] in NEGATORS:
            value = -value
        score += value
    return score


def compute(fixture):
    with open(fixture, newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        headers = reader.fieldnames

    n = len(rows)
    cols = len(headers)

    filled = sum(1 for r in rows for h in headers if str(r[h]).strip() != "")
    completion = round(filled / (n * cols) * 100) if n and cols else 0

    sat = [to_number(r["Overall Satisfaction"]) for r in rows]
    sat = [x for x in sat if x is not None]
    satisfaction = {
        "mean": round(sum(sat) / len(sat), 1) if sat else None,
        "min": min(sat) if sat else None,
        "max": max(sat) if sat else None,
    }

    devices = {}
    for r in rows:
        for token in split_multi(r["Devices"]):
            devices[token] = devices.get(token, 0) + 1

    pos = neu = neg = 0
    for r in rows:
        score = sentiment_row(r["Enjoyed"])
        if score > 0:
            pos += 1
        elif score < 0:
            neg += 1
        else:
            neu += 1
    sent_total = pos + neu + neg
    sentiment = {
        "pos": pos,
        "neu": neu,
        "neg": neg,
        "pos_pct": round(pos / sent_total * 100) if sent_total else 0,
    }

    return {
        "responses": n,
        "columns": cols,
        "completion_pct": completion,
        "satisfaction": satisfaction,
        "would_recommend": tally(rows, "Would Recommend"),
        "year_level": tally(rows, "Year Level"),
        "devices": devices,
        "sentiment": sentiment,
    }


def main():
    fixture = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_FIXTURE
    json.dump(compute(fixture), sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
