import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { DEMO_APPOINTMENTS, DEMO_PATIENTS } from "@/demoData";
import {
  AlertTriangle,
  Building2,
  FlaskConical,
  Heart,
  Lock,
  Pill,
  Shield,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { usePortalContext } from "../../contexts/PortalContext";

type ConsentState = {
  labs: boolean;
  medications: boolean;
  vitals: boolean;
  mentalHealth: boolean;
  billing: boolean;
  analyticsOptIn: boolean;
  revokedProviders: string[];
  lastUpdated: string | null;
};

const DEFAULT_CONSENT: ConsentState = {
  labs: true,
  medications: true,
  vitals: true,
  mentalHealth: false,
  billing: true,
  analyticsOptIn: false,
  revokedProviders: [],
  lastUpdated: null,
};

const DATA_CATEGORIES: {
  key: keyof Pick<
    ConsentState,
    "labs" | "medications" | "vitals" | "mentalHealth" | "billing"
  >;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}[] = [
  {
    key: "labs",
    icon: FlaskConical,
    label: "Labs & Test Results",
    description:
      "Blood work, urine tests, cultures, and diagnostic lab panels.",
  },
  {
    key: "medications",
    icon: Pill,
    label: "Medications",
    description:
      "Prescriptions, dosage history, refills, and pharmacy records.",
  },
  {
    key: "vitals",
    icon: Heart,
    label: "Vitals & Measurements",
    description:
      "Blood pressure, weight, heart rate, and temperature readings.",
  },
  {
    key: "mentalHealth",
    icon: Shield,
    label: "Mental Health Notes",
    description:
      "Therapy notes, psychiatric assessments, and behavioral health records.",
  },
  {
    key: "billing",
    icon: Building2,
    label: "Billing & Insurance",
    description: "Invoices, insurance claims, co-pays, and payment history.",
  },
];

// Derive providers from appointments for demo patient
function getProviders(patientId: bigint) {
  const patientAppts = DEMO_APPOINTMENTS.filter(
    (a) => a.patientId === patientId,
  );
  const providerIds = [
    ...new Set(patientAppts.map((a) => String(a.providerId))),
  ];
  const providerNames: Record<string, string> = {
    "10": "Dr. Sarah Chen",
  };
  return providerIds.map((id) => ({
    id,
    name: providerNames[id] ?? `Provider ${id}`,
    specialty: "Primary Care",
  }));
}

export default function PrivacyControls() {
  const { id: PORTAL_PATIENT_ID } = usePortalContext();
  const STORAGE_KEY = `medunite_consent_${PORTAL_PATIENT_ID}`;
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const providers = getProviders(PORTAL_PATIENT_ID);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConsent({ ...DEFAULT_CONSENT, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, [STORAGE_KEY]);

  function toggleCategory(
    key: keyof Pick<
      ConsentState,
      "labs" | "medications" | "vitals" | "mentalHealth" | "billing"
    >,
  ) {
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
    setDirty(true);
  }

  function toggleAnalytics() {
    setConsent((prev) => ({ ...prev, analyticsOptIn: !prev.analyticsOptIn }));
    setDirty(true);
  }

  function revokeProvider(id: string) {
    setConsent((prev) => ({
      ...prev,
      revokedProviders: prev.revokedProviders.includes(id)
        ? prev.revokedProviders.filter((p) => p !== id)
        : [...prev.revokedProviders, id],
    }));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    const updated: ConsentState = {
      ...consent,
      lastUpdated: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* storage unavailable */
    }
    setConsent(updated);
    setDirty(false);
    setSaving(false);
    toast.success("Privacy settings saved.");
  }

  return (
    <div className="space-y-6" data-ocid="privacy.page">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Privacy &amp; Data Controls
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          You decide who sees your health information.
        </p>
      </div>

      {/* Data Category Access */}
      <Card data-ocid="privacy.categories.card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Data Category Access
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Control which categories of your health data providers can view.
          </p>
        </CardHeader>
        <CardContent className="space-y-0 divide-y divide-border">
          {DATA_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isOn = consent[cat.key] as boolean;
            return (
              <div
                key={cat.key}
                data-ocid={`privacy.category.item.${idx + 1}`}
                className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="w-8 h-8 rounded flex items-center justify-center bg-muted flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={`category-${cat.key}`}
                    className="text-sm font-semibold text-foreground cursor-pointer"
                  >
                    {cat.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cat.description}
                  </p>
                  {!isOn && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-warning">
                      <AlertTriangle className="w-3 h-3" />
                      Restricting this may limit your care team's ability to
                      treat you.
                    </div>
                  )}
                </div>
                <Switch
                  id={`category-${cat.key}`}
                  data-ocid={`privacy.category.${cat.key}.switch`}
                  checked={isOn}
                  onCheckedChange={() => toggleCategory(cat.key)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Analytics Contribution */}
      <Card data-ocid="privacy.analytics.card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Research Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <Label
                htmlFor="analytics-switch"
                className="text-sm font-semibold text-foreground cursor-pointer"
              >
                Contribute anonymous data to research
              </Label>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                When enabled, your de-identified health trends (no name, date of
                birth, or contact info) are included in population health
                analytics that help improve care for everyone.
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                Your identity is never shared. You can opt out at any time.
              </div>
            </div>
            <Switch
              id="analytics-switch"
              data-ocid="privacy.analytics.switch"
              checked={consent.analyticsOptIn}
              onCheckedChange={toggleAnalytics}
            />
          </div>
        </CardContent>
      </Card>

      {/* Provider Access */}
      <Card data-ocid="privacy.providers.card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Provider Access
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Providers who currently have access to your records.
          </p>
        </CardHeader>
        <CardContent>
          {providers.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-4"
              data-ocid="privacy.providers.empty_state"
            >
              No providers have accessed your records.
            </p>
          ) : (
            <div
              className="space-y-0 divide-y divide-border"
              data-ocid="privacy.providers.list"
            >
              {providers.map((provider, idx) => {
                const isRevoked = consent.revokedProviders.includes(
                  provider.id,
                );
                return (
                  <div
                    key={provider.id}
                    data-ocid={`privacy.providers.item.${idx + 1}`}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                      {provider.name
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {provider.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {provider.specialty}
                      </p>
                    </div>
                    {isRevoked ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground italic">
                          Access revoked
                        </span>
                        <button
                          type="button"
                          data-ocid={`privacy.providers.restore.button.${idx + 1}`}
                          onClick={() => revokeProvider(provider.id)}
                          className="text-xs font-semibold text-primary hover:underline transition-colors"
                        >
                          Restore
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        data-ocid={`privacy.providers.revoke.button.${idx + 1}`}
                        onClick={() => revokeProvider(provider.id)}
                        className="text-xs font-semibold text-destructive border border-destructive/30 px-2.5 py-1 rounded hover:bg-destructive/5 transition-colors"
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <Separator />
      <div
        className="flex items-center justify-between"
        data-ocid="privacy.save.panel"
      >
        <div className="space-y-0.5">
          {consent.lastUpdated ? (
            <p className="text-xs text-muted-foreground">
              Last updated:{" "}
              {new Date(consent.lastUpdated).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Changes not yet saved
            </p>
          )}
        </div>
        <Button
          data-ocid="privacy.save.button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="gap-1.5"
        >
          {saving ? (
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <Lock className="w-3.5 h-3.5" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
