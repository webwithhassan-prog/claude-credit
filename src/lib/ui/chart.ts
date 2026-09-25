/**
 * Tiny dependency-free SVG/HTML charts. Colours come from CSS custom
 * properties so charts follow light/dark mode automatically.
 */
import { esc, moneyCompact } from './format';

export interface Series {
  name: string;
  values: number[];
  /** CSS colour, e.g. 'var(--chart-1)'. */
  color: string;
  dashed?: boolean;
  area?: boolean;
}

export interface LineChartOptions {
  series: Series[];
  /** Label for x index i (e.g. month → "Yr 3"). */
  xLabel: (i: number) => string;
  yFormat?: (n: number) => string;
  ariaLabel: string;
  height?: number;
}

function niceMax(v: number): number {
  if (v <= 0 || !Number.isFinite(v)) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

export function lineChart(el: HTMLElement | null, o: LineChartOptions) {
  if (!el) return;
  // Draw at the element's real width so text renders at true size on phones.
  const W = Math.max(280, Math.round(el.clientWidth || 640));
  const H = o.height ?? (W < 480 ? 210 : 250);
  const padL = 54;
  const padR = 14;
  const padT = 12;
  const padB = 30;
  const n = Math.max(...o.series.map((s) => s.values.length));
  if (n < 2) {
    el.innerHTML = '';
    return;
  }
  const maxV = niceMax(Math.max(...o.series.flatMap((s) => s.values.filter(Number.isFinite))));
  const x = (i: number) => padL + (i / (n - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / maxV) * (H - padT - padB);
  const yFmt = o.yFormat ?? moneyCompact;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxV);
  const xCount = Math.min(W < 480 ? 4 : 6, n);
  const xTicks = Array.from({ length: xCount }, (_, k) => Math.round((k / (xCount - 1)) * (n - 1)));

  const grid = yTicks
    .map((v) => `<line x1="${padL}" x2="${W - padR}" y1="${y(v)}" y2="${y(v)}" />`)
    .join('');
  const yLabels = yTicks
    .map((v) => `<text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end">${esc(yFmt(v))}</text>`)
    .join('');
  const xLabels = xTicks
    .map((i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${esc(o.xLabel(i))}</text>`)
    .join('');

  const paths = o.series
    .map((s) => {
      const pts = s.values.map((v, i) => `${x(i).toFixed(1)},${y(Math.max(0, v)).toFixed(1)}`);
      const line = `<polyline fill="none" style="stroke:${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" ${
        s.dashed ? 'stroke-dasharray="6 5"' : ''
      } points="${pts.join(' ')}" />`;
      const area = s.area
        ? `<polygon style="fill:${s.color};opacity:.12" points="${x(0)},${y(0)} ${pts.join(' ')} ${x(s.values.length - 1)},${y(0)}" />`
        : '';
      return area + line;
    })
    .join('');

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.ariaLabel)}">
      <g class="grid">${grid}</g>
      <g class="axis">${yLabels}${xLabels}</g>
      ${paths}
    </svg>
    <div class="legend">${o.series
      .map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`)
      .join('')}</div>`;
}

export interface Part {
  label: string;
  value: number;
  color: string;
}

/** Horizontal 100% split bar with a legend (e.g. principal vs interest). */
export function splitBar(parts: Part[], fmt: (n: number) => string): string {
  const total = parts.reduce((s, p) => s + Math.max(0, p.value), 0) || 1;
  return `
    <div class="bar-split" role="img" aria-label="${esc(parts.map((p) => `${p.label} ${fmt(p.value)}`).join(', '))}">
      ${parts.map((p) => `<div style="width:${(Math.max(0, p.value) / total) * 100}%;background:${p.color}"></div>`).join('')}
    </div>
    <div class="legend">${parts
      .map((p) => `<span><i style="background:${p.color}"></i>${esc(p.label)}: <strong>${esc(fmt(p.value))}</strong></span>`)
      .join('')}</div>`;
}

/** Horizontal comparison bars, scaled to the largest value. */
export function compareBars(parts: Part[], fmt: (n: number) => string): string {
  const max = Math.max(...parts.map((p) => (Number.isFinite(p.value) ? p.value : 0)), 1);
  return `<div class="hbars">${parts
    .map(
      (p) => `<div class="hbar">
        <div class="hbar-label"><span>${esc(p.label)}</span><strong>${esc(fmt(p.value))}</strong></div>
        <div class="hbar-track"><div style="width:${Number.isFinite(p.value) ? Math.max(1, (p.value / max) * 100) : 100}%;background:${p.color}"></div></div>
      </div>`,
    )
    .join('')}</div>`;
}
