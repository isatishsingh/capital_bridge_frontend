import { useState } from 'react';
import { Button } from '../ui/Button';

export const InvestmentRequestForm = ({ onSubmit, loading, maxEquity = 100 }) => {
  const [form, setForm] = useState({ amount: '', equityPercentage: '' });
  const effectiveMaxEquity = Math.max(Number(maxEquity) || 0, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const equityPercentage = Number(form.equityPercentage);
    if (effectiveMaxEquity <= 0 || equityPercentage > effectiveMaxEquity) {
      return;
    }
    await onSubmit({
      amount: Number(form.amount),
      equityPercentage
    });
    setForm({ amount: '', equityPercentage: '' });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="field-label">Investment amount</label>
        <input
          className="field-input"
          min="1"
          placeholder="Enter amount in INR"
          required
          type="number"
          value={form.amount}
          onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
        />
      </div>
      <div>
        <label className="field-label">Equity percentage</label>
        <input
          className="field-input"
          disabled={effectiveMaxEquity <= 0}
          max={effectiveMaxEquity}
          min="0.1"
          placeholder="Enter requested equity"
          required
          step="0.1"
          type="number"
          value={form.equityPercentage}
          onChange={(event) =>
            setForm((current) => ({ ...current, equityPercentage: event.target.value }))
          }
        />
        <p className="mt-1 text-xs text-slate-500">Remaining equity: {effectiveMaxEquity}%</p>
      </div>
      <Button className="w-full" disabled={loading || effectiveMaxEquity <= 0} type="submit">
        {loading ? 'Submitting...' : effectiveMaxEquity > 0 ? 'Send investment request' : 'No equity left'}
      </Button>
    </form>
  );
};
