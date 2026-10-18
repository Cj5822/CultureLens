#!/usr/bin/env python3
"""Response analysis for the CultureLens user evaluation (report Sections 5.6
and 5.7).

Marks the exported Google Forms responses and computes:
  * per-view task accuracy, self-reported time and mean ratings (Table 9)
  * participant profile counts (role, familiarity, chart use)
  * System Usability Scale scores (Brooke's scoring), with the mean's 95%
    t-based confidence interval and a breakdown by chart-use frequency
  * the two coherence items (mean and % agreeing, i.e. 4 or 5), the forced
    ranking (mean rank) and the fastest / most difficult / most enjoyable
    counts
  * for the word cloud vs bar chart comparison (RQ4): accuracy per task type
    and format with exact McNemar tests (Table 10); time, ease and confidence
    with Wilcoxon signed-rank tests, Holm-corrected across those three tests
    (Table 11), reporting the median time and mean ease and confidence, with
    effect size r = |Z| / sqrt(n) from the normal approximation; format
    preferences

Usage
  python3 analyse.py --round1 data/round1.csv --round2 data/round2.csv
  python3 analyse.py --round2 data/round2.csv            (second round only)

Each CSV is a response export (Responses tab > Download responses (.csv)).
Round 1 used the first version of the form without the RQ4 sections; its
per-view, SUS, coherence and ranking columns are analysed together with round
2. Column headers are matched through config.json; fields that cannot be found
are listed, and missing optional sections are skipped with a warning.

Outputs (in --out, default results/): results.md, results.json, and
marked.csv (one row per participant with marks and SUS score). marked.csv
contains free-text answers; keep it out of the public repository.

Requires Python 3.9+ and SciPy (pip install -r requirements.txt).
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import re
import statistics as st
import sys
from pathlib import Path

try:
    from scipy.stats import binomtest, wilcoxon, t as t_dist
except ImportError:  # pragma: no cover
    sys.exit("SciPy is required: pip install -r requirements.txt")

HERE = Path(__file__).resolve().parent


# ─── Loading and column matching ────────────────────────────────────────────

class Columns:
    """Finds response-export columns by regular expression."""

    def __init__(self, headers: list[str]):
        self.headers = headers
        self.missing: list[str] = []

    def find(self, pattern: str, nth: int | None = None, label: str = "", required: bool = True) -> int | None:
        rx = re.compile(pattern, re.IGNORECASE)
        hits = [i for i, h in enumerate(self.headers) if rx.search(h.strip())]
        if nth is not None:
            if len(hits) >= nth:
                return hits[nth - 1]
        elif len(hits) == 1:
            return hits[0]
        elif len(hits) > 1:
            raise SystemExit(f"Pattern for {label or pattern!r} matches {len(hits)} columns: "
                             f"{[self.headers[i] for i in hits]}. Make it more specific or set 'nth' in config.json.")
        if required:
            self.missing.append(f"{label}: /{pattern}/")
        return None


def read_csv(path: Path) -> tuple[list[str], list[list[str]]]:
    with path.open(newline="", encoding="utf-8-sig") as f:
        rows = list(csv.reader(f))
    if not rows:
        raise SystemExit(f"{path} is empty")
    return rows[0], [r + [""] * (len(rows[0]) - len(r)) for r in rows[1:] if any(c.strip() for c in r)]


def number(s: str) -> float | None:
    m = re.search(r"-?\d+(?:[.,]\d+)?", s or "")
    return float(m.group(0).replace(",", ".")) if m else None


def mean(xs):
    xs = [x for x in xs if x is not None]
    return st.mean(xs) if xs else None


def sd(xs):
    xs = [x for x in xs if x is not None]
    return st.stdev(xs) if len(xs) > 1 else None


def median(xs):
    xs = [x for x in xs if x is not None]
    return st.median(xs) if xs else None


def fmt(x, d=2):
    return "–" if x is None else (f"{x:.{d}f}" if isinstance(x, float) else str(x))


def all_of(patterns: list[str], text: str) -> bool:
    return all(re.search(p, text or "", re.IGNORECASE) for p in patterns)


# ─── Per-round extraction ───────────────────────────────────────────────────

def extract(path: Path, round_label: str, cfg: dict, want_rq4: bool) -> tuple[list[dict], list[str]]:
    headers, rows = read_csv(path)
    cols = Columns(headers)
    views = cfg["views"]

    vf = {}
    for view in views:
        for key, spec in cfg["view_fields"].items():
            vf[(view, key)] = cols.find(spec["match"].replace("{view}", re.escape(view)), spec.get("nth"), f"{view} / {key}")
    sus = [cols.find(cfg["sus"]["match"].replace("{i}", str(i)), None, f"SUS item {i}") for i in range(1, 11)]
    coh = {c["key"]: cols.find(c["match"], c.get("nth"), f"coherence / {c['key']}") for c in cfg["coherence"]}
    rank = {v: cols.find(cfg["ranking"]["match"].replace("{view}", re.escape(v)), None, f"ranking / {v}") for v in views}
    fav = {k: cols.find(s["match"], s.get("nth"), f"favourite / {k}") for k, s in cfg["favourites"].items()}
    prof = {k: cols.find(s["match"], s.get("nth"), f"profile / {k}", required=False) for k, s in cfg.get("profile", {}).items()}

    rq = cfg["rq4"]
    rq4cols = {}
    if want_rq4:
        rq4cols["routing"] = cols.find(rq["routing"]["match"], None, "RQ4 routing")
        for section in ("A1", "A2", "B1", "B2"):
            for key, spec in rq["fields"].items():
                rq4cols[(section, key)] = cols.find(spec["match"].replace("{section}", section), spec.get("nth"), f"RQ4 {section} / {key}")
        for key, spec in rq["preference"].items():
            rq4cols[("pref", key)] = cols.find(spec["match"], spec.get("nth"), f"RQ4 preference / {key}")

    get = lambda row, i: row[i].strip() if i is not None else ""
    people = []
    for n, row in enumerate(rows, 1):
        p = {"id": f"{round_label}-{n:02d}", "round": round_label, "views": {}, "rq4": None,
             "profile": {k: get(row, i) or None for k, i in prof.items()}}
        for view in views:
            task = get(row, vf[(view, "task")])
            p["views"][view] = {
                "answer": task,
                "correct": all_of(cfg["view_answers"][view]["all_of"], task) if vf[(view, "task")] is not None else None,
                "time": number(get(row, vf[(view, "time")])),
                "ease": number(get(row, vf[(view, "ease")])),
                "confidence": number(get(row, vf[(view, "confidence")])),
                "reuse": number(get(row, vf[(view, "reuse")])),
                "accurate": number(get(row, vf[(view, "accurate")])),
                "spreadsheet": get(row, vf[(view, "spreadsheet")]) or None,
            }
        items = [number(get(row, i)) for i in sus]
        if all(x is not None for x in items):
            # Brooke: odd items contribute (x - 1), even items (5 - x); sum x 2.5
            p["sus"] = 2.5 * sum((x - 1) if i % 2 == 0 else (5 - x) for i, x in enumerate(items))
        else:
            p["sus"] = None
        p["coherence"] = {k: number(get(row, i)) for k, i in coh.items()}
        p["rank"] = {v: number(get(row, i)) for v, i in rank.items()}
        p["favourites"] = {k: get(row, i) or None for k, i in fav.items()}

        if want_rq4 and rq4cols.get("routing") is not None:
            routing = get(row, rq4cols["routing"])
            group = rq["group_of_routing_answer"].get(routing)
            if group:
                r = {"group": group}
                for fmt_name in ("cloud", "bar"):
                    sec = rq["sections"][group][fmt_name]
                    r[fmt_name] = {"pair": sec["pair"], **{k: get(row, rq4cols[(sec["section"], k)]) for k in rq["fields"]}}
                r["preference"] = {k: get(row, rq4cols[("pref", k)]) for k in rq["preference"]}
                p["rq4"] = r
        people.append(p)
    return people, cols.missing


# ─── RQ4 marking ────────────────────────────────────────────────────────────

def load_rq4_key(cfg: dict) -> dict:
    path = (HERE / cfg["rq4"]["answer_key"]).resolve()
    if not path.exists():
        raise SystemExit(f"RQ4 answer key not found at {path}; run `npm run stimuli` first.")
    key = json.loads(path.read_text(encoding="utf-8"))
    out = {}
    for pair, slug in cfg["rq4"]["pair_keys"].items():
        k = key[slug]
        out[pair] = {"c1": k["c1"]["answer"], "c2": k["c2"]["answer"], "c3": k["c3"]["answer"]}
    return out


def mark_rq4(people: list[dict], key: dict) -> None:
    for p in people:
        r = p.get("rq4")
        if not r:
            continue
        for fmt_name in ("cloud", "bar"):
            a = r[fmt_name]
            k = key[a["pair"]]
            a["marks"] = {
                "c1": bool(re.search(rf"\b{re.escape(k['c1'])}\b", a["c1"], re.IGNORECASE)),
                "c2": a["c2"].strip().lower() == (k["c2"] or "").lower(),
                "c3": a["c3"].strip().lower() == (k["c3"] or "").lower(),
            }
            for f in ("time", "ease", "confidence"):
                a[f] = number(a[f])


# ─── Statistics ─────────────────────────────────────────────────────────────

def mcnemar_exact(pairs: list[tuple[bool, bool]]) -> dict:
    """Exact (binomial) McNemar test on discordant pairs. pairs = (cloud, bar)."""
    b = sum(1 for c, r in pairs if c and not r)   # cloud correct, bar wrong
    c = sum(1 for cl, r in pairs if r and not cl)  # bar correct, cloud wrong
    n = b + c
    p = binomtest(b, n, 0.5).pvalue if n else 1.0
    return {"cloud_only": b, "bar_only": c, "discordant": n, "p": p}


def wilcoxon_paired(cloud: list[float], bar: list[float]) -> dict:
    pairs = [(x, y) for x, y in zip(cloud, bar) if x is not None and y is not None]
    d = [y - x for x, y in pairs]  # bar minus cloud
    nz = [v for v in d if v != 0]
    res = {"n": len(pairs), "nonzero": len(nz), "median_cloud": median([x for x, _ in pairs]),
           "median_bar": median([y for _, y in pairs]), "mean_cloud": mean([x for x, _ in pairs]),
           "mean_bar": mean([y for _, y in pairs]), "median_difference_bar_minus_cloud": median(d)}
    if len(nz) == 0:
        res.update(W=None, p=1.0, Z=0.0, r=0.0, rank_biserial=0.0)
        return res
    xs, ys = [x for x, _ in pairs], [y for _, y in pairs]
    t = wilcoxon(xs, ys, zero_method="wilcox")
    z = abs(float(wilcoxon(xs, ys, zero_method="wilcox", method="approx").zstatistic))
    res.update(Z=z, r=z / math.sqrt(len(pairs)))
    # Matched-pairs rank-biserial correlation (positive: bar > cloud)
    ranks = _ranks([abs(v) for v in nz])
    w_pos = sum(r for r, v in zip(ranks, nz) if v > 0)
    w_neg = sum(r for r, v in zip(ranks, nz) if v < 0)
    res.update(W=float(t.statistic), p=float(t.pvalue), rank_biserial=(w_pos - w_neg) / (w_pos + w_neg))
    return res


def _ranks(xs: list[float]) -> list[float]:
    order = sorted(range(len(xs)), key=lambda i: xs[i])
    ranks = [0.0] * len(xs)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and xs[order[j + 1]] == xs[order[i]]:
            j += 1
        for k in range(i, j + 1):
            ranks[order[k]] = (i + j) / 2 + 1
        i = j + 1
    return ranks


def holm(pvalues: dict[str, float]) -> dict[str, float]:
    items = sorted(pvalues.items(), key=lambda kv: kv[1])
    m = len(items)
    adjusted, running = {}, 0.0
    for i, (k, p) in enumerate(items):
        running = max(running, min(1.0, (m - i) * p))
        adjusted[k] = running
    return adjusted


# ─── Report ─────────────────────────────────────────────────────────────────

def summarise(people: list[dict], cfg: dict, rq4_key: dict | None) -> tuple[dict, list[str]]:
    views = cfg["views"]
    out: dict = {"n": len(people), "rounds": {}}
    md: list[str] = ["# User-evaluation results", ""]
    rounds = sorted({p["round"] for p in people})
    for r in rounds:
        out["rounds"][r] = sum(1 for p in people if p["round"] == r)
    md.append(f"Participants: {len(people)} ({', '.join(f'{r}: {out['rounds'][r]}' for r in rounds)}).")
    md.append("")

    def view_table(group: list[dict], title: str):
        rows = {}
        md.extend([f"## Per-view tasks — {title} (N = {len(group)})", "",
                   "| View | Correct | Accuracy | Median time (s) | Ease | Confidence | Re-use | Accurate picture | Spreadsheet: yes | Mean rank |",
                   "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|"])
        for v in views:
            vs = [p["views"][v] for p in group]
            marked = [x["correct"] for x in vs if x["correct"] is not None]
            yes = [x["spreadsheet"] for x in vs if x["spreadsheet"]]
            row = {
                "correct": sum(marked), "answered": len(marked),
                "accuracy": (sum(marked) / len(marked)) if marked else None,
                "median_time_s": median([x["time"] for x in vs]),
                "mean_time_s": mean([x["time"] for x in vs]),
                "ease": mean([x["ease"] for x in vs]), "confidence": mean([x["confidence"] for x in vs]),
                "reuse": mean([x["reuse"] for x in vs]), "accurate": mean([x["accurate"] for x in vs]),
                "spreadsheet_yes": (sum(1 for y in yes if y.lower() == "yes") / len(yes)) if yes else None,
                "mean_rank": mean([p["rank"][v] for p in group]),
            }
            rows[v] = row
            acc = "–" if row["accuracy"] is None else f"{row['accuracy'] * 100:.0f}%"
            sy = "–" if row["spreadsheet_yes"] is None else f"{row['spreadsheet_yes'] * 100:.0f}%"
            md.append(f"| {v} | {row['correct']}/{row['answered']} | {acc} | {fmt(row['median_time_s'], 0)} | {fmt(row['ease'])} | "
                      f"{fmt(row['confidence'])} | {fmt(row['reuse'])} | {fmt(row['accurate'])} | {sy} | {fmt(row['mean_rank'])} |")
        md.append("")
        return rows

    out["views"] = {"all": view_table(people, "all participants")}
    for r in rounds if len(rounds) > 1 else []:
        out["views"][r] = view_table([p for p in people if p["round"] == r], r)

    # Text Analysis diagnostic: answers naming Māori for New Zealand
    maori = sum(1 for p in people if re.search(r"m[aā]ori|\bori\b", p["views"]["Text Analysis"]["answer"] or "", re.IGNORECASE))
    out["text_analysis_maori_answers"] = maori
    md.append(f"Text Analysis answers mentioning Māori/“ori” for New Zealand: {maori} "
              "(“bicultural” and “ori” tie at 11 occurrences in the demonstration data; see the stimuli tool's tokenisation check).")
    md.append("")

    # SUS
    # Profile
    out["profile"] = {}
    for k in cfg.get("profile", {}):
        counts: dict[str, int] = {}
        for p in people:
            v = (p.get("profile") or {}).get(k)
            if v:
                counts[v] = counts.get(v, 0) + 1
        out["profile"][k] = dict(sorted(counts.items(), key=lambda kv: -kv[1]))
    if any(out["profile"].values()):
        md.extend(["## Participants", ""] + [f"- {k}: " + ", ".join(f"{v} {n}" for v, n in c.items()) for k, c in out["profile"].items() if c] + [""])

    md.extend(["## System Usability Scale", "", "| Group | n | Mean | SD | 95% CI | Median | Min | Max | ≥ 68 |", "|---|---:|---:|---:|---:|---:|---:|---:|---:|"])
    out["sus"] = {}
    for label, group in [("all", people)] + ([(r, [p for p in people if p["round"] == r]) for r in rounds] if len(rounds) > 1 else []):
        s = [p["sus"] for p in group if p["sus"] is not None]
        ci = None
        if len(s) > 1:
            half = t_dist.ppf(0.975, len(s) - 1) * st.stdev(s) / math.sqrt(len(s))
            ci = [st.mean(s) - half, st.mean(s) + half]
        out["sus"][label] = {"n": len(s), "mean": mean(s), "sd": sd(s), "median": median(s), "ci95": ci,
                             "min": min(s) if s else None, "max": max(s) if s else None,
                             "at_or_above_68": sum(1 for x in s if x >= 68)}
        o = out["sus"][label]
        ci_txt = f"{o['ci95'][0]:.1f} to {o['ci95'][1]:.1f}" if o["ci95"] else "–"
        md.append(f"| {label} | {o['n']} | {fmt(o['mean'], 1)} | {fmt(o['sd'], 1)} | {ci_txt} | {fmt(o['median'], 1)} | "
                  f"{fmt(o['min'], 1)} | {fmt(o['max'], 1)} | {o['at_or_above_68']} |")
    md.append("")
    by_use: dict[str, list[float]] = {}
    for p in people:
        u = (p.get("profile") or {}).get("chart_use")
        if u and p["sus"] is not None:
            by_use.setdefault(u, []).append(p["sus"])
    out["sus_by_chart_use"] = {u: {"n": len(v), "mean": mean(v)} for u, v in by_use.items()}
    if by_use:
        md.append("SUS by chart-use frequency (descriptive): " + ", ".join(f"{u} {mean(v):.1f} (n = {len(v)})" for u, v in by_use.items()))
        md.append("")

    # Coherence, ranking, favourites
    out["coherence"] = {}
    for k in (c["key"] for c in cfg["coherence"]):
        vals = [p["coherence"][k] for p in people if p["coherence"][k] is not None]
        out["coherence"][k] = {"mean": mean(vals), "sd": sd(vals), "n": len(vals),
                               "agree_pct": (100 * sum(1 for v in vals if v >= 4) / len(vals)) if vals else None}
    md.extend(["## Coherence", ""] + [f"- {k}: mean {fmt(v['mean'])} (SD {fmt(v['sd'])}); {fmt(v['agree_pct'], 0)}% agree (4 or 5)" for k, v in out["coherence"].items()] + [""])
    out["mean_rank"] = {v: mean([p["rank"][v] for p in people]) for v in views}
    md.extend(["## Ranking (1 = most useful)", "", "| View | Mean rank |", "|---|---:|"]
              + [f"| {v} | {fmt(r)} |" for v, r in sorted(out["mean_rank"].items(), key=lambda kv: (kv[1] is None, kv[1]))] + [""])
    out["favourites"] = {}
    for k in cfg["favourites"]:
        counts: dict[str, int] = {}
        for p in people:
            if p["favourites"].get(k):
                counts[p["favourites"][k]] = counts.get(p["favourites"][k], 0) + 1
        out["favourites"][k] = dict(sorted(counts.items(), key=lambda kv: -kv[1]))
        md.append(f"- {k}: " + ", ".join(f"{v} {n}" for v, n in out["favourites"][k].items()))
    md.append("")

    # RQ4
    rq = [p for p in people if p.get("rq4")]
    if rq and rq4_key:
        groups = {g: sum(1 for p in rq if p["rq4"]["group"] == g) for g in ("A", "B")}
        out["rq4"] = {"n": len(rq), "groups": groups, "key": rq4_key, "accuracy": {}, "ratings": {}, "preference": {}}
        md.extend([f"## Word cloud vs bar chart (n = {len(rq)}; group A {groups['A']}, group B {groups['B']})", "",
                   "| Task | Word cloud correct | Bar chart correct | Cloud only | Bar only | Exact McNemar p |",
                   "|---|---:|---:|---:|---:|---:|"])
        for t in ("c1", "c2", "c3"):
            pairs = [(p["rq4"]["cloud"]["marks"][t], p["rq4"]["bar"]["marks"][t]) for p in rq]
            test = mcnemar_exact(pairs)
            out["rq4"]["accuracy"][t] = {"cloud": sum(c for c, _ in pairs), "bar": sum(b for _, b in pairs), "n": len(pairs), **test}
            a = out["rq4"]["accuracy"][t]
            md.append(f"| {t.upper()} | {a['cloud']}/{a['n']} | {a['bar']}/{a['n']} | {a['cloud_only']} | {a['bar_only']} | {a['p']:.3f} |")
        md.extend(["", "| Measure | Cloud (median / mean) | Bar (median / mean) | Median paired difference (bar − cloud) | W | p | Holm p | r = Z/√n | Rank-biserial |",
                   "|---|---:|---:|---:|---:|---:|---:|---:|---:|"])
        tests = {f: wilcoxon_paired([p["rq4"]["cloud"][f] for p in rq], [p["rq4"]["bar"][f] for p in rq]) for f in ("time", "ease", "confidence")}
        adj = holm({f: t["p"] for f, t in tests.items()})
        for f, t in tests.items():
            t["p_holm"] = adj[f]
            out["rq4"]["ratings"][f] = t
            md.append(f"| {f} | {fmt(t['median_cloud'], 1)} / {fmt(t['mean_cloud'])} | {fmt(t['median_bar'], 1)} / {fmt(t['mean_bar'])} | "
                      f"{fmt(t['median_difference_bar_minus_cloud'], 1)} | {fmt(t['W'], 1)} | {t['p']:.4f} | {t['p_holm']:.4f} | {fmt(t['r'])} | {fmt(t['rank_biserial'])} |")
        md.append("")
        for k in cfg["rq4"]["preference"]:
            counts: dict[str, int] = {}
            for p in rq:
                v = p["rq4"]["preference"].get(k) or "(no answer)"
                counts[v] = counts.get(v, 0) + 1
            out["rq4"]["preference"][k] = counts
            md.append(f"- Preferred format, {k}: " + ", ".join(f"{v} {n}" for v, n in sorted(counts.items(), key=lambda kv: -kv[1])))
        md.append("")
    return out, md


def write_marked(people: list[dict], cfg: dict, path: Path) -> None:
    views = cfg["views"]
    header = ["id", "round", "sus"] + [f"{v} correct" for v in views] + [f"{v} answer" for v in views]
    header += ["rq4 group"] + [f"{f} {t}" for f in ("cloud", "bar") for t in ("c1", "c2", "c3")]
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(header)
        for p in people:
            row = [p["id"], p["round"], fmt(p["sus"], 1)]
            row += [p["views"][v]["correct"] for v in views] + [p["views"][v]["answer"] for v in views]
            r = p.get("rq4")
            row += [r["group"] if r else ""]
            row += [(r[f]["marks"][t] if r and "marks" in r[f] else "") for f in ("cloud", "bar") for t in ("c1", "c2", "c3")]
            w.writerow(row)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--round1", type=Path, help="first-round export (form version 1, no RQ4 sections)")
    ap.add_argument("--round2", type=Path, help="second-round export (form version 2)")
    ap.add_argument("--config", type=Path, default=HERE / "config.json")
    ap.add_argument("--out", type=Path, default=HERE / "results")
    args = ap.parse_args()
    if not args.round1 and not args.round2:
        ap.error("give --round1 and/or --round2")
    cfg = json.loads(args.config.read_text(encoding="utf-8"))

    people, problems = [], []
    if args.round1:
        p, miss = extract(args.round1, "round1", cfg, want_rq4=False)
        people += p
        problems += [f"round1: {m}" for m in miss]
    if args.round2:
        p, miss = extract(args.round2, "round2", cfg, want_rq4=True)
        people += p
        problems += [f"round2: {m}" for m in miss]
    if problems:
        print("Columns not found (edit config.json to match your export):", file=sys.stderr)
        for m in problems:
            print("  " + m, file=sys.stderr)
        if any("task" in m or "SUS" in m for m in problems):
            sys.exit(1)

    rq4_key = None
    if any(p.get("rq4") for p in people):
        rq4_key = load_rq4_key(cfg)
        mark_rq4(people, rq4_key)

    out, md = summarise(people, cfg, rq4_key)
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "results.json").write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    (args.out / "results.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    write_marked(people, cfg, args.out / "marked.csv")
    print("\n".join(md))


if __name__ == "__main__":
    main()
