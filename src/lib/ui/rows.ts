/**
 * Repeating input rows (debts, credit cards…). Markup contract:
 *
 * <div data-rows data-key="d_bal" data-min="1" data-max="10">
 *   <div class="rows" data-rows-list> …rows (each .row-card[data-row])… </div>
 *   <template data-rows-template> …one row… </template>
 *   <button type="button" data-rows-add>Add</button>
 * </div>
 *
 * Each row has a remove button [data-row-remove] and a [data-row-title] whose
 * text gets "{label} {n}". `data-key` is a field name present once per row,
 * used to count rows when restoring a shared link.
 */
import { FormReader } from './form';

export function initRows(form: HTMLFormElement) {
  form.querySelectorAll<HTMLElement>('[data-rows]').forEach((box) => {
    const list = box.querySelector<HTMLElement>('[data-rows-list]')!;
    const tpl = box.querySelector<HTMLTemplateElement>('template[data-rows-template]')!;
    const addBtn = box.querySelector<HTMLButtonElement>('[data-rows-add]');
    const min = Number(box.dataset.min ?? 1);
    const max = Number(box.dataset.max ?? 10);
    const label = box.dataset.label ?? 'Item';

    const rows = () => Array.from(list.querySelectorAll<HTMLElement>('[data-row]'));

    const refresh = () => {
      rows().forEach((r, i) => {
        const t = r.querySelector('[data-row-title]');
        if (t) t.textContent = `${label} ${i + 1}`;
        const rm = r.querySelector<HTMLButtonElement>('[data-row-remove]');
        if (rm) rm.hidden = rows().length <= min;
      });
      if (addBtn) addBtn.hidden = rows().length >= max;
    };

    const add = (focus = true) => {
      if (rows().length >= max) return;
      const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
      list.appendChild(node);
      refresh();
      if (focus) node.querySelector<HTMLInputElement>('input')?.focus();
    };

    addBtn?.addEventListener('click', () => {
      add();
      form.dispatchEvent(new Event('calc:rows'));
    });

    list.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('[data-row-remove]');
      if (!btn) return;
      if (rows().length <= min) return;
      btn.closest('[data-row]')?.remove();
      refresh();
      form.dispatchEvent(new Event('calc:rows'));
    });

    // Shared-link restore: create/remove rows to match the saved count.
    form.addEventListener('calc:restore', (e) => {
      const params = (e as CustomEvent<URLSearchParams>).detail;
      const key = box.dataset.key;
      if (!key) return;
      const want = Math.min(Math.max(params.getAll(key).length, min), max);
      while (rows().length < want) add(false);
      while (rows().length > want) rows().at(-1)!.remove();
      refresh();
    });

    refresh();
  });
}

/** A FormReader for each row inside the rows box that contains `key`. */
export function rowReaders(form: HTMLFormElement, key: string): FormReader[] {
  const box = form.querySelector<HTMLElement>(`[data-rows][data-key="${key}"]`);
  if (!box) return [];
  return Array.from(box.querySelectorAll<HTMLElement>('[data-row]')).map((r) => new FormReader(r));
}
