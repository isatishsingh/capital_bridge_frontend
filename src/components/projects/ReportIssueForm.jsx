import { useState } from 'react';
import { REPORT_REASONS } from '../../utils/constants';
import { Button } from '../ui/Button';

export const ReportIssueForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    reason: REPORT_REASONS[0],
    details: ''
  });

  const submit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm((current) => ({ ...current, details: '' }));
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div>
        <label className="field-label">Reason</label>
        <select
          className="field-input"
          value={form.reason}
          onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
        >
          {REPORT_REASONS.map((reason) => (
            <option key={reason}>{reason}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">Details</label>
        <textarea
          className="field-input min-h-28"
          placeholder="Add context for the admin team"
          required
          value={form.details}
          onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))}
        />
      </div>
      <Button className="w-full" disabled={loading} type="submit">
        {loading ? 'Sending...' : 'Submit report'}
      </Button>
    </form>
  );
};
