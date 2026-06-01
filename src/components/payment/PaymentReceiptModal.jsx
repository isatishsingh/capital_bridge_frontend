import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { currency, formatDate, percent } from '../../utils/formatters';

export const PaymentReceiptModal = ({ open, receipt, onClose }) => {
  if (!receipt) {
    return null;
  }

  const rows = [
    ['Receipt no.', receipt.receiptNumber || '—'],
    ['Status', receipt.status || 'SUCCESS'],
    ['Amount', currency(receipt.amount)],
    ['Currency', receipt.currency || 'INR'],
    ['Project', receipt.projectTitle || 'Membership'],
    receipt.equityPercentage != null
      ? ['Equity', percent(receipt.equityPercentage)]
      : null,
    ['Razorpay order', receipt.razorpayOrderId || '—'],
    ['Razorpay payment', receipt.razorpayPaymentId || '—'],
    ['Paid on', formatDate(receipt.paidAt)],
    ['Investor', receipt.investorName || '—']
  ].filter(Boolean);

  return (
    <Modal open={open} title="Payment receipt" onClose={onClose}>
      <p className="mb-6 text-sm text-slate-600">
        Save this receipt for your records. You can reopen it anytime from your investment history.
      </p>
      <dl className="space-y-3 rounded-3xl bg-slate-50 p-5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1 sm:flex-row sm:justify-between">
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="text-sm font-semibold text-slate-900 sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <Button className="mt-6 w-full" type="button" onClick={onClose}>
        Done
      </Button>
    </Modal>
  );
};
