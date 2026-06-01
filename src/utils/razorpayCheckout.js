import { getRazorpayKeyIdError } from './razorpayKey';

export const openRazorpayCheckout = ({
  orderId,
  description,
  user,
  onSuccess,
  onFailure
}) => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY?.trim();
  const keyError = getRazorpayKeyIdError(keyId);
  if (keyError) {
    throw new Error(keyError);
  }

  if (!window.Razorpay) {
    throw new Error('Razorpay checkout could not load. Refresh the page and try again.');
  }

  if (!orderId) {
    throw new Error('Payment could not start because the order id was missing.');
  }

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: keyId,
      name: 'CapitalBridge',
      description: description || 'Payment',
      order_id: orderId,
      handler: async (response) => {
        try {
          const result = await onSuccess(response);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          if (onFailure) {
            onFailure(new Error('Payment window was closed before completion.'));
          }
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email
      },
      theme: {
        color: '#0f766e'
      }
    });

    razorpay.on('payment.failed', (event) => {
      const description =
        event?.error?.description ||
        event?.error?.reason ||
        'Payment failed. Please try again or use another method.';
      reject(new Error(description));
    });

    razorpay.open();
  });
};
