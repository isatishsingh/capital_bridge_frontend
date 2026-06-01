import { useEffect, useState } from "react";
import { creatorService } from "../services/creatorService";
import { formatKycError } from "../utils/errorMessages";
import { useToast } from "../components/feedback/ToastProvider";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { LoadingState } from "../components/feedback/LoadingState";
import { validateForm } from "../utils/validations";
import { Link, useNavigate } from "react-router-dom";
import { VerificationProgressTracker } from "../components/profile/VerificationProgressTracker";

export const CreatorKycPage = () => {
  const { notify } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState("NOT_SUBMITTED");
  const [statusMessage, setStatusMessage] = useState("");
  const [form, setForm] = useState({
    phoneNumber: "",
    panNumber: "",
    aadhaarNumber: "",
    gstNumber: "",
    passportNumber: "",
  });

  useEffect(() => {
    const loadStatus = async () => {
      setStatusLoading(true);
      try {
        const data = await creatorService.getProfileStatus();
        setKycStatus(data?.kycStatus || "NOT_SUBMITTED");
        setStatusMessage(data?.message || "");
      } catch {
        setKycStatus("NOT_SUBMITTED");
      } finally {
        setStatusLoading(false);
      }
    };
    loadStatus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (kycStatus === "APPROVED") {
      notify("Your profile is already verified.", "success");
      navigate("/creator/projects/create");
      return;
    }

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
      const nextStatus = data?.kycStatus || "PENDING";
      setKycStatus(nextStatus);
      setStatusMessage(
        data?.message ||
          "Verification submitted. An admin will review your application.",
      );
      notify(
        data?.message ||
          "Application submitted. Approval is in progress — we will notify you once an admin reviews it.",
        "success",
      );

      setForm({
        phoneNumber: "",
        panNumber: "",
        aadhaarNumber: "",
        gstNumber: "",
        passportNumber: "",
      });

      if (data?.isKycVerified && nextStatus === "APPROVED") {
        navigate("/creator/projects/create");
      }
    } catch (error) {
      notify(formatKycError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  const isApproved = kycStatus === "APPROVED";
  const isPending = kycStatus === "PENDING";

  return (
    <div className="page-shell py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
          Creator verification
        </p>
        <h1 className="mt-3 section-title">Apply for profile verification</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Submit your details for admin review. You cannot create projects until
          an admin approves your verification.
        </p>

        {/* {statusLoading ? (
          <div className="mt-8">
            <LoadingState label="Checking verification status..." />
          </div>
        ) : (
          <VerificationProgressTracker className="mt-8" kycStatus={kycStatus} />
        )}

        {!statusLoading && statusMessage ? (
          <p className="mt-4 text-center text-sm text-slate-600">{statusMessage}</p>
        ) : null}

        {!statusLoading ? (
          <p className="mt-2 text-center text-sm text-slate-500">
            <Link className="font-semibold text-accent hover:underline" to="/profile">
              View full journey on your profile
            </Link>
          </p>
        ) : null} */}

        <Card className="mt-8 p-8">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="field-label">Phone number</label>
              <input
                className="field-input"
                required
                disabled={isApproved || isPending}
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
                disabled={isApproved || isPending}
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
                required
                disabled={isApproved || isPending}
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
                disabled={isApproved || isPending}
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
                disabled={isApproved || isPending}
                value={form.passportNumber}
                onChange={(e) =>
                  setForm((c) => ({ ...c, passportNumber: e.target.value }))
                }
              />
            </div>
            {isApproved ? (
              <Button
                type="button"
                onClick={() => navigate("/creator/projects/create")}
              >
                Create a project
              </Button>
            ) : isPending ? (
              <Button disabled tone="slate" type="button" variant="outline">
                Approval in progress
              </Button>
            ) : (
              <Button disabled={loading} type="submit">
                {loading ? "Submitting..." : "Apply for verification"}
              </Button>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
