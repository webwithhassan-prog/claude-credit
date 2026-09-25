/**
 * Calculator form plumbing: reading values, live recalculation, shareable
 * links (state lives in the URL #fragment, which browsers never send to a
 * server), reset, print, and money-field formatting.
 */

type Field = HTMLInputElement | HTMLSelectElement;

export function parseNumber(raw: string): number {
  const cleaned = raw.replace(/[^0-9.\-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return NaN;
  return Number(cleaned);
}

export class FormReader {
  constructor(private root: HTMLElement) {}

  private field(name: string): Field | null {
    return this.root.querySelector<Field>(`[name="${name}"]`);
  }

  /** Numeric value; falls back to `fallback` when empty/invalid. Clamps to data-min/data-max. */
  num(name: string, fallback = 0): number {
    const el = this.field(name);
    if (!el) return fallback;
    let v = parseNumber(el.value);
    if (Number.isNaN(v)) return fallback;
    const min = el.dataset.min !== undefined ? Number(el.dataset.min) : -Infinity;
    const max = el.dataset.max !== undefined ? Number(el.dataset.max) : Infinity;
    v = Math.min(Math.max(v, min), max);
    return v;
  }

  str(name: string): string {
    const radios = this.root.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${name}"]`);
    if (radios.length) return Array.from(radios).find((r) => r.checked)?.value ?? '';
    return this.field(name)?.value ?? '';
  }

  bool(name: string): boolean {
    const el = this.field(name) as HTMLInputElement | null;
    return Boolean(el?.checked);
  }

  /** Marks a field invalid (with its .error message) when `bad` is true. */
  flag(name: string, bad: boolean) {
    const el = this.field(name);
    el?.closest('.field')?.classList.toggle('invalid', bad);
    el?.setAttribute('aria-invalid', bad ? 'true' : 'false');
  }
}

/* ------------------------------------------------------------------------ */
/* State <-> URL fragment                                                     */
/* ------------------------------------------------------------------------ */

function serialize(form: HTMLFormElement): string {
  const params = new URLSearchParams();
  for (const el of Array.from(form.elements) as Field[]) {
    if (!el.name || el.type === 'button' || el.type === 'submit') continue;
    if (el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox')) {
      if (el.type === 'radio' && el.checked) params.append(el.name, el.value);
      if (el.type === 'checkbox') params.append(el.name, el.checked ? '1' : '0');
      continue;
    }
    params.append(el.name, el.value);
  }
  return params.toString();
}

function applyState(form: HTMLFormElement, query: string) {
  const params = new URLSearchParams(query);
  // Repeating rows: make sure enough rows exist before filling values.
  form.dispatchEvent(new CustomEvent('calc:restore', { detail: params }));
  const seen = new Map<string, number>();
  for (const el of Array.from(form.elements) as Field[]) {
    if (!el.name || !params.has(el.name)) continue;
    const all = params.getAll(el.name);
    if (el instanceof HTMLInputElement && el.type === 'radio') {
      el.checked = all.includes(el.value);
      continue;
    }
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      el.checked = all[0] === '1';
      continue;
    }
    const k = seen.get(el.name) ?? 0;
    if (k < all.length) el.value = all[k];
    seen.set(el.name, k + 1);
  }
}

/* ------------------------------------------------------------------------ */
/* Money formatting on blur                                                   */
/* ------------------------------------------------------------------------ */

const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export function formatMoneyInput(el: HTMLInputElement) {
  const v = parseNumber(el.value);
  if (!Number.isNaN(v)) el.value = fmt.format(v);
}

/* ------------------------------------------------------------------------ */
/* Binding                                                                    */
/* ------------------------------------------------------------------------ */

export interface BindOptions {
  /** Called with a reader every time an input changes (and once on load). */
  compute: (read: FormReader) => void;
}

export function bindCalculator(formId: string, { compute }: BindOptions) {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;
  const read = new FormReader(form);
  const defaults = serialize(form);

  let queued = false;
  const run = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      syncVisibility(form, read);
      try {
        compute(read);
      } catch (err) {
        console.error(err);
      }
    });
  };

  form.addEventListener('input', run);
  form.addEventListener('change', run);
  form.addEventListener('calc:rows', run);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run();
    form.querySelector<HTMLElement>('[data-results]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  form.addEventListener(
    'blur',
    (e) => {
      const t = e.target as HTMLInputElement;
      if (t?.dataset?.format === 'money') formatMoneyInput(t);
    },
    true,
  );

  // Restore a shared link, then remove the fragment so the address bar stays clean.
  if (location.hash.length > 1) {
    try {
      applyState(form, location.hash.slice(1));
      history.replaceState(null, '', location.pathname + location.search);
    } catch {
      /* ignore malformed links */
    }
  }

  form.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    applyState(form, defaults);
    run();
  });

  form.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print());

  const shareBtn = form.querySelector<HTMLButtonElement>('[data-action="share"]');
  shareBtn?.addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}#${serialize(form)}`;
    const label = shareBtn.querySelector('span');
    const original = label?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(url);
      if (label) label.textContent = 'Link copied';
    } catch {
      window.prompt('Copy this link to share your results:', url);
    }
    setTimeout(() => {
      if (label) label.textContent = original;
    }, 2200);
  });

  // Charts are drawn at their real pixel width: redraw when the width changes.
  let lastWidth = window.innerWidth;
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(run, 150);
  });

  run();
  return { run, form, read };
}

/**
 * Conditional fields: an element with data-when="mode=payment" (or "mode=a|b")
 * is shown only while the named field has one of those values.
 */
function syncVisibility(form: HTMLFormElement, read: FormReader) {
  form.querySelectorAll<HTMLElement>('[data-when]').forEach((el) => {
    const [name, values] = (el.dataset.when ?? '').split('=');
    const current = read.str(name);
    const checkbox = form.querySelector<HTMLInputElement>(`input[type="checkbox"][name="${name}"]`);
    const value = checkbox ? (checkbox.checked ? 'on' : 'off') : current;
    el.hidden = !values.split('|').includes(value);
  });
}

/** Sets innerHTML of the element matching `sel` inside the calculator. */
export function render(formId: string, sel: string, html: string) {
  const el = document.getElementById(formId)?.querySelector<HTMLElement>(sel);
  if (el) el.innerHTML = html;
}

/** Output helpers bound to one calculator: text(key, value) / html(key, markup) target [data-out="key"]. */
export function outputs(formId: string) {
  const form = document.getElementById(formId);
  const find = (key: string) => form?.querySelector<HTMLElement>(`[data-out="${key}"]`) ?? null;
  return {
    el: find,
    text(key: string, value: string) {
      const el = find(key);
      if (el) el.textContent = value;
    },
    html(key: string, markup: string) {
      const el = find(key);
      if (el) el.innerHTML = markup;
    },
    /** Adds good/bad colouring to a stat value. */
    tone(key: string, tone: 'good' | 'bad' | null) {
      const el = find(key);
      if (!el) return;
      el.classList.toggle('good', tone === 'good');
      el.classList.toggle('bad', tone === 'bad');
    },
  };
}

/** Standard verdict box markup. */
export function verdict(kind: 'good' | 'warn' | 'bad' | 'info', html: string): string {
  const icon =
    kind === 'good'
      ? '<path d="m5 12.5 4.5 4.5L19 7.5"/>'
      : kind === 'info'
        ? '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5h.01"/>'
        : '<path d="M10.3 3.9 2.6 17.4A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3.1L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4M12 17h.01"/>';
  return `<div class="verdict ${kind}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg><div>${html}</div></div>`;
}
