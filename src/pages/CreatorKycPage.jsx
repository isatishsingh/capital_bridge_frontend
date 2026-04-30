import { useState } from "react";
import { creatorService } from "../services/creatorService";
import { useToast } from "../components/feedback/ToastProvider";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { validateForm } from "../utils/validations";

export const CreatorKycPage = () => {
  const { notify } = useToast();
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
      const data = await creatorService.saveProfile(form);
      console.log("data => ", data, data?.success, data?.message);
      if (data?.message) {
        notify(data.message, "success");
      } else{
        notify("Verification done successfully", "success");
      }
      // setForm({
      //   phoneNumber: "",
      //   panNumber: "",
      //   aadhaarNumber: "",
      //   gstNumber: "",
      //   passportNumber: "",
      // });
    } catch (error) {
      notify(error?.message || "Unable to save profile.", "error");
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
          Your Spring Boot service requires a verified creator profile before
          project creation succeeds. Submit the identifiers below; verification
          status is enforced on the server.
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
