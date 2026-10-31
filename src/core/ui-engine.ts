// ============================================================================
// VetLink — High Performance UI Engine (60 FPS, Zero CLS, Anti-Glitch, Robust)
// ============================================================================

import { AsyncExecutionOptions, OptimisticMutationOptions } from '../types';

export class UIEngine {
  private static activeLocks = new WeakSet<HTMLElement>();
  private static lastClickTime = new WeakMap<HTMLElement, number>();
  private static SPAM_THRESHOLD_MS = 350;

  /**
   * Debounce utility with full typing and immediate option
   */
  public static debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delayMs = 250,
    immediate = false
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: unknown, ...args: Parameters<T>): void {
      const callNow = immediate && !timeoutId;

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (!immediate) {
          fn.apply(this, args);
        }
      }, delayMs);

      if (callNow) {
        fn.apply(this, args);
      }
    };
  }

  /**
   * Throttle utility for scroll, resize and high frequency inputs
   */
  public static throttle<T extends (...args: unknown[]) => void>(
    fn: T,
    intervalMs = 100
  ): (...args: Parameters<T>) => void {
    let lastExecution = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    return function (this: unknown, ...args: Parameters<T>): void {
      const now = Date.now();
      const remaining = intervalMs - (now - lastExecution);

      if (remaining <= 0) {
        if (timerId !== null) {
          clearTimeout(timerId);
          timerId = null;
        }
        lastExecution = now;
        fn.apply(this, args);
      } else if (!timerId) {
        timerId = setTimeout(() => {
          lastExecution = Date.now();
          timerId = null;
          fn.apply(this, args);
        }, remaining);
      }
    };
  }

  /**
   * Prevents spam clicks and double submits with instant execution lock
   */
  public static isClickSpam(element: HTMLElement): boolean {
    const now = performance.now();
    const last = this.lastClickTime.get(element) || 0;

    if (now - last < this.SPAM_THRESHOLD_MS) {
      return true;
    }

    this.lastClickTime.set(element, now);
    return false;
  }

  /**
   * Locks an interactive element, adding loading spinner and disabling pointer events
   * Preserves exact width & height to guarantee ZERO Layout Shift (CLS = 0)
   */
  public static lockElement(
    element: HTMLElement,
    loadingText?: string
  ): void {
    if (this.activeLocks.has(element)) return;

    this.activeLocks.add(element);

    // Freeze exact dimensions to eliminate layout shifts
    const rect = element.getBoundingClientRect();
    element.style.minWidth = `${rect.width}px`;
    element.style.minHeight = `${rect.height}px`;

    element.setAttribute('aria-busy', 'true');
    element.setAttribute('aria-disabled', 'true');
    element.classList.add('is-loading');

    if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
      element.disabled = true;
    }

    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;

    if (loadingText) {
      element.innerHTML = `
        <span class="btn-spinner" aria-hidden="true"></span>
        <span class="btn-label">${loadingText}</span>
      `;
    } else {
      element.innerHTML = `
        <span class="btn-spinner" aria-hidden="true"></span>
        <span class="btn-label" style="opacity: 0.2;">${originalContent}</span>
      `;
    }
  }

  /**
   * Unlocks an interactive element, cleanly restoring its content and attributes
   */
  public static unlockElement(element: HTMLElement): void {
    if (!this.activeLocks.has(element)) return;

    this.activeLocks.delete(element);

    element.removeAttribute('aria-busy');
    element.removeAttribute('aria-disabled');
    element.classList.remove('is-loading');

    if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
      element.disabled = false;
    }

    if (element.dataset.originalContent !== undefined) {
      element.innerHTML = element.dataset.originalContent;
      delete element.dataset.originalContent;
    }

    // Release dimension freeze
    element.style.minWidth = '';
    element.style.minHeight = '';
  }

  /**
   * Reliable Async Lifecycle Wrapper:
   * Guarantees loading state resets even if exceptions occur (try...catch...finally)
   */
  public static async executeAsyncSafe<T>(
    asyncFn: () => Promise<T>,
    options?: AsyncExecutionOptions<T>
  ): Promise<T | null> {
    const btn = options?.button;

    if (btn) {
      if (this.isClickSpam(btn) || this.activeLocks.has(btn)) {
        return null;
      }
      this.lockElement(btn, options?.loadingText);
    }

    try {
      const result = await asyncFn();
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      console.error('[UIEngine] Operation Failed:', errorObj);
      if (options?.onError) {
        options.onError(errorObj);
      }
      return null;
    } finally {
      if (btn) {
        this.unlockElement(btn);
      }
      if (options?.onFinally) {
        options.onFinally();
      }
    }
  }

  /**
   * Optimistic UI Updates with Snapshot-Based Rollback Engine
   */
  public static async optimisticMutate<T>(
    options: OptimisticMutationOptions<T>
  ): Promise<boolean> {
    const { key, getCurrent, mutate, commit, rollbackMessage, onRollback } = options;

    // Capture clean deep snapshot for rollback
    const currentSnapshot = JSON.parse(JSON.stringify(getCurrent())) as T;

    try {
      // 1. Instantly apply optimistic update for zero UI lag
      const optimisticState = mutate(currentSnapshot);

      // 2. Perform async commit / sync
      const result = await Promise.resolve(commit(optimisticState));

      if (result === false) {
        throw new Error(`Commit returned failure for ${key}`);
      }

      return true;
    } catch (error) {
      console.warn(`[UIEngine] Optimistic mutation failed for ${key}, rolling back.`, error);

      // 3. Rollback seamlessly to snapshot
      if (onRollback) {
        onRollback(currentSnapshot);
      }

      if (typeof window !== 'undefined' && 'showToast' in window) {
        const toastFn = (window as unknown as { showToast: (msg: string, type: string) => void }).showToast;
        toastFn(rollbackMessage || 'Action failed. Changes have been restored.', 'error');
      }

      return false;
    }
  }

  /**
   * Generates Zero-CLS skeleton placeholders with exact reserved dimensions
   */
  public static renderSkeletonGrid(
    container: HTMLElement,
    count = 3,
    template: 'pet-card' | 'patient-card' | 'vet-card' | 'table-row' = 'pet-card'
  ): void {
    let skeletonHtml = '';

    for (let i = 0; i < count; i++) {
      if (template === 'pet-card') {
        skeletonHtml += `
          <div class="card skeleton-card" style="min-height: 240px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="skeleton-avatar skeleton-shimmer mx-auto mb-15"></div>
              <div class="skeleton-line skeleton-shimmer mb-10" style="width: 60%; margin: 0 auto 10px;"></div>
              <div class="skeleton-line skeleton-shimmer mb-15" style="width: 40%; margin: 0 auto 15px;"></div>
              <div class="skeleton-box skeleton-shimmer" style="height: 60px; border-radius: 8px;"></div>
            </div>
            <div class="skeleton-button skeleton-shimmer mt-15" style="height: 38px;"></div>
          </div>
        `;
      } else if (template === 'vet-card') {
        skeletonHtml += `
          <div class="card skeleton-card flex items-start gap-15" style="min-height: 140px;">
            <div class="skeleton-avatar skeleton-shimmer" style="width: 56px; height: 56px; flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <div class="skeleton-line skeleton-shimmer mb-10" style="width: 50%;"></div>
              <div class="skeleton-line skeleton-shimmer mb-10" style="width: 70%;"></div>
              <div class="skeleton-line skeleton-shimmer" style="width: 30%;"></div>
            </div>
          </div>
        `;
      } else if (template === 'table-row') {
        skeletonHtml += `
          <tr>
            <td colspan="5" style="padding: 14px;">
              <div class="skeleton-line skeleton-shimmer" style="height: 20px; width: 100%;"></div>
            </td>
          </tr>
        `;
      }
    }

    container.innerHTML = skeletonHtml;
  }

  /**
   * Initializes global double-click and button interaction guards
   */
  public static initInteractionGuards(): void {
    if (typeof document === 'undefined') return;

    // Attach passive listener on all forms for double-submit prevention
    document.addEventListener('submit', (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (!form || !(form instanceof HTMLFormElement)) return;

      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]') as HTMLElement | null;
      if (submitBtn) {
        if (this.isClickSpam(submitBtn)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
      }
    }, true);

    // Global tactile micro-feedback visual enhancer
    document.addEventListener('pointerdown', (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest('button, .btn, [role="button"]') as HTMLElement | null;
      if (target && !target.hasAttribute('aria-disabled') && !target.classList.contains('is-loading')) {
        target.classList.add('is-pressed');
      }
    }, { passive: true });

    const releasePress = (e: Event): void => {
      const target = (e.target as HTMLElement)?.closest('button, .btn, [role="button"]') as HTMLElement | null;
      if (target) {
        target.classList.remove('is-pressed');
      }
    };

    document.addEventListener('pointerup', releasePress, { passive: true });
    document.addEventListener('pointercancel', releasePress, { passive: true });
  }
}

