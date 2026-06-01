import { useState } from "react";
import { creatorService } from "../services/creatorService";
import { formatKycError } from "../utils/errorMessages";
import { useToast } from "../components/feedback/ToastProvider";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { validateForm } from "../utils/validations";
import { useNavigate } from "react-router-dom";

export const CreatorKycPage = () => {
  const { notify } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    phoneNumber: "",
    panNumber: "",
    aadhaarNumber: "",
    gstNumber: "",
    passportNumber: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorMsg = validateForm(form);

    if (errorMsg) {
      notify(errorMsg, "error");
      return;
    }

    setLoading(true);
    try {
      const gst = form.gstNumber.trim();
      const passport = form.passportNumber.trim();
      const payload = {
        phoneNumber: form.phoneNumber.trim(),
        panNumber: form.panNumber.trim().toUpperCase(),
        aadhaarNumber: form.aadhaarNumber.trim(),
        ...(gst ? { gstNumber: gst.toUpperCase() } : {}),
        ...(passport ? { passportNumber: passport.toUpperCase() } : {}),
      };
      const data = await creatorService.saveProfile(payload);
      if (data?.message) {
        notify(data.message, "success");
      } else if (data?.isKycVerified) {
        notify("Verification completed successfully.", "success");
      } else {
        notify(
          "Profile saved. Complete all required fields to finish verification.",
          "success",
        );
      }
      setForm({
        phoneNumber: "",
        panNumber: "",
        aadhaarNumber: "",
        gstNumber: "",
        passportNumber: "",
      });

      if (data?.isKycVerified) {
        navigate("/creator/projects/create");
      }
    } catch (error) {
      notify(formatKycError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
          Creator verification
        </p>
        <h1 className="mt-3 section-title">
          Complete KYC before launching a campaign.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Complete your KYC verification to unlock project creation and
          fundraising features. This helps us maintain a secure and trusted
          platform for all creators and investors.
        </p>

        <Card className="mt-10 p-8">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="field-label">Phone number</label>
              <input
                className="field-input"
                required
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm((c) => ({ ...c, phoneNumber: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label">PAN</label>
              <input
                className="field-input"
                required
                value={form.panNumber}
                onChange={(e) =>
                  setForm((c) => ({ ...c, panNumber: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label">Aadhaar number</label>
              <input
                className="field-input"
                value={form.aadhaarNumber}
                onChange={(e) =>
                  setForm((c) => ({ ...c, aadhaarNumber: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label">GST number (optional)</label>
              <input
                className="field-input"
                value={form.gstNumber}
                onChange={(e) =>
                  setForm((c) => ({ ...c, gstNumber: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="field-label">Passport number (optional)</label>
              <input
                className="field-input"
                value={form.passportNumber}
                onChange={(e) =>
                  setForm((c) => ({ ...c, passportNumber: e.target.value }))
                }
              />
            </div>
            <Button disabled={loading} type="submit">
              {loading ? "Saving..." : "Save verification profile"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
