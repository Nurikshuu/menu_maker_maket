/**
 * Shared common types used across multiple layers of the application.
 */

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
