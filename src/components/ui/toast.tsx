import { toast as hotToast, Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastOptions {
  duration?: number;
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
}

const toast = {
  success: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <div
          className={cn(
            'flex items-center gap-4 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded-xl shadow-xl p-6 max-w-lg transition-all duration-300',
            t.visible ? 'animate-in slide-in-from-top-2' : 'animate-out slide-out-to-top-2'
          )}
        >
          <CheckCircle className="h-7 w-7 text-green-500 flex-shrink-0" />
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {message}
          </p>
          <button
            onClick={() => hotToast.dismiss(t.id)}
            className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      ),
      {
        duration: options?.duration || 4000,
        position: options?.position || 'top-right',
      }
    );
  },

  error: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <div
          className={cn(
            'flex items-center gap-4 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-xl shadow-xl p-6 max-w-lg transition-all duration-300',
            t.visible ? 'animate-in slide-in-from-top-2' : 'animate-out slide-out-to-top-2'
          )}
        >
          <XCircle className="h-7 w-7 text-red-500 flex-shrink-0" />
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {message}
          </p>
          <button
            onClick={() => hotToast.dismiss(t.id)}
            className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: options?.duration || 5000,
        position: options?.position || 'top-right',
      }
    );
  },

  warning: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <div
          className={cn(
            'flex items-center gap-4 bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-800 rounded-xl shadow-xl p-6 max-w-lg transition-all duration-300',
            t.visible ? 'animate-in slide-in-from-top-2' : 'animate-out slide-out-to-top-2'
          )}
        >
          <AlertCircle className="h-7 w-7 text-yellow-500 flex-shrink-0" />
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {message}
          </p>
          <button
            onClick={() => hotToast.dismiss(t.id)}
            className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: options?.duration || 4000,
        position: options?.position || 'top-right',
      }
    );
  },

  info: (message: string, options?: ToastOptions) => {
    return hotToast.custom(
      (t) => (
        <div
          className={cn(
            'flex items-center gap-4 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-xl shadow-xl p-6 max-w-lg transition-all duration-300',
            t.visible ? 'animate-in slide-in-from-top-2' : 'animate-out slide-out-to-top-2'
          )}
        >
          <Info className="h-7 w-7 text-blue-500 flex-shrink-0" />
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {message}
          </p>
          <button
            onClick={() => hotToast.dismiss(t.id)}
            className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      ),
      {
        duration: options?.duration || 4000,
        position: options?.position || 'top-right',
      }
    );
  },

  loading: (message: string) => {
    return hotToast.loading(message, {
      style: {
        background: '#fff',
        color: '#374151',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },

  dismiss: hotToast.dismiss,
  remove: hotToast.remove,
};

function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  );
}

export { toast, ToastProvider };