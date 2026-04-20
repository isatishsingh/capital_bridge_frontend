/**
 * Razorpay Standard Checkout calls `api.razorpay.com/.../preferences?key_id=...`.
 * A placeholder Key Id (e.g. from .env.example) causes 401 Unauthorized and a broken modal.
 */

const PLACEHOLDER_KEYS = new Set(
  ['rzp_test_example', 'rzp_live_example', 'your_razorpay_key', 'rzp_test_xxxxx', 'rzp_live_xxxxx'].map((k) =>
    k.toLowerCase()
  )
);

export function getRazorpayKeyIdError(key) {
  const k = (key ?? '').trim();
  if (!k) {
    return 'Set VITE_RAZORPAY_KEY in .env to your Razorpay Key Id (Dashboard → API Keys). It must match the same value as razorpay.key in the Spring app. Restart npm run dev after editing.';
  }
  if (PLACEHOLDER_KEYS.has(k.toLowerCase())) {
    return 'VITE_RAZORPAY_KEY is still a placeholder (e.g. rzp_test_example). Replace it with your real Key Id from the Razorpay Dashboard — the same one configured on the backend.';
  }
  if (!/^rzp_(test|live)_/.test(k)) {
    return 'VITE_RAZORPAY_KEY must start with rzp_test_ or rzp_live_ (Key Id from Razorpay Dashboard).';
  }
  return null;
}
