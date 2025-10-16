// ============================================
// useNotify Composable - Quasar Notify wrapper
// ============================================

import { Notify, QNotifyCreateOptions } from 'quasar';

export function useNotify() {
  /**
   * Show success notification
   */
  function notifySuccess(
    message: string,
    caption?: string,
    options?: Partial<QNotifyCreateOptions>
  ) {
    Notify.create({
      type: 'positive',
      message,
      caption,
      position: 'top-right',
      timeout: 3000,
      ...options,
    });
  }

  /**
   * Show error notification
   */
  function notifyError(
    message: string,
    caption?: string,
    options?: Partial<QNotifyCreateOptions>
  ) {
    Notify.create({
      type: 'negative',
      message,
      caption,
      position: 'top-right',
      timeout: 5000,
      ...options,
    });
  }

  /**
   * Show warning notification
   */
  function notifyWarning(
    message: string,
    caption?: string,
    options?: Partial<QNotifyCreateOptions>
  ) {
    Notify.create({
      type: 'warning',
      message,
      caption,
      position: 'top-right',
      timeout: 4000,
      ...options,
    });
  }

  /**
   * Show info notification
   */
  function notifyInfo(
    message: string,
    caption?: string,
    options?: Partial<QNotifyCreateOptions>
  ) {
    Notify.create({
      type: 'info',
      message,
      caption,
      position: 'top-right',
      timeout: 3000,
      ...options,
    });
  }

  /**
   * Show custom notification
   */
  function notify(options: QNotifyCreateOptions) {
    Notify.create(options);
  }

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notify,
  };
}
