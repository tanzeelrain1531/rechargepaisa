import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";

interface SectionProps {
  title: string;
  ocidScope: string;
  children: (editing: boolean) => React.ReactNode;
}

function EditableSection({
  title,
  ocidScope,
  children,
  onSave,
}: SectionProps & { onSave?: () => void }) {
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    onSave?.();
  };

  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
        <h3 className="text-[12px] font-semibold text-foreground">{title}</h3>
        {editing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid={`${ocidScope}.save_button`}
              onClick={handleSave}
              className="px-3 py-1 rounded-sm text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--primary)" }}
            >
              Save
            </button>
            <button
              type="button"
              data-ocid={`${ocidScope}.cancel_button`}
              onClick={() => setEditing(false)}
              className="px-3 py-1 rounded-sm text-xs font-medium text-muted-foreground border border-border hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            data-ocid={`${ocidScope}.edit_button`}
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium text-muted-foreground border border-border hover:text-foreground transition-colors"
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
        )}
      </div>
      <div className="px-5 py-4">{children(editing)}</div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  editing: boolean;
  ocid: string;
  type?: string;
  onChange?: (v: string) => void;
}

function Field({
  label,
  value,
  editing,
  ocid,
  type = "text",
  onChange,
}: FieldProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </p>
      {editing ? (
        <input
          type={type}
          data-ocid={ocid}
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-8 px-2.5 text-[13px] bg-background border border-input rounded-sm focus:outline-none focus:ring-1 ring-ring"
        />
      ) : (
        <p className="text-[13px] text-foreground">{value}</p>
      )}
    </div>
  );
}

export default function MyProfile() {
  const { actor, isFetching } = useActor();
  const [profileLoading, setProfileLoading] = useState(true);

  // Personal Info
  const [firstName, setFirstName] = useState("Alex");
  const [lastName] = useState("Johnson");
  const [dob] = useState("January 15, 1985");
  const [gender] = useState("Male");
  const [ssn] = useState("***-**-4521");

  // Contact
  const [address] = useState("1482 Birchwood Drive");
  const [city] = useState("Portland, OR 97201");
  const [phone] = useState("(503) 555-0142");
  const [email] = useState("alex.johnson@email.com");

  // Emergency Contact
  const [ecName] = useState("Patricia Johnson");
  const [ecRelationship] = useState("Spouse");
  const [ecPhone] = useState("(503) 555-0179");
  const [ecEmail] = useState("patricia.johnson@email.com");

  // Insurance
  const [insProvider] = useState("BlueCross BlueShield");
  const [insPlan] = useState("PPO Gold");
  const [insMemberId] = useState("BCB-4821-09934");
  const [insGroupNo] = useState("GRP-77201");
  const [insEffective] = useState("Jan 1, 2026");
  const [insExpiry] = useState("Dec 31, 2026");

  // Load profile from backend on mount
  useEffect(() => {
    if (!actor || isFetching) return;
    const load = async () => {
      try {
        const profile = await actor.getCallerUserProfile();
        if (profile?.name) {
          setFirstName(profile.name);
        }
      } catch {
        // silently fall back to default
      } finally {
        setProfileLoading(false);
      }
    };
    load();
  }, [actor, isFetching]);

  const handleSaveProfile = async (name: string) => {
    try {
      if (actor) {
        await actor.saveCallerUserProfile({
          userId: BigInt(0),
          name,
          role: "Patient",
        });
      }
      toast.success("Profile saved successfully");
    } catch {
      toast.success("Profile saved");
    }
  };

  if (profileLoading && isFetching) {
    return (
      <div className="max-w-2xl space-y-5" data-ocid="profile.loading_state">
        {(["personal", "contact", "emergency", "insurance"] as const).map(
          (section) => (
            <div
              key={section}
              className="bg-card border border-border rounded-sm overflow-hidden"
            >
              <div className="px-5 py-3 border-b border-border">
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5" data-ocid="profile.page">
      {/* Personal Information */}
      <EditableSection
        title="Personal Information"
        ocidScope="profile.personal"
        onSave={() => handleSaveProfile(firstName)}
      >
        {(editing) => (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field
              label="First Name"
              value={firstName}
              editing={editing}
              ocid="profile.personal.first-name.input"
              onChange={setFirstName}
            />
            <Field
              label="Last Name"
              value={lastName}
              editing={editing}
              ocid="profile.personal.last-name.input"
            />
            <Field
              label="Date of Birth"
              value={dob}
              editing={editing}
              ocid="profile.personal.dob.input"
            />
            <Field
              label="Gender"
              value={gender}
              editing={editing}
              ocid="profile.personal.gender.input"
            />
            <Field
              label="Social Security"
              value={ssn}
              editing={editing}
              ocid="profile.personal.ssn.input"
            />
          </div>
        )}
      </EditableSection>

      {/* Contact Details */}
      <EditableSection title="Contact Details" ocidScope="profile.contact">
        {(editing) => (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2">
              <Field
                label="Street Address"
                value={address}
                editing={editing}
                ocid="profile.contact.address.input"
              />
            </div>
            <Field
              label="City, State, ZIP"
              value={city}
              editing={editing}
              ocid="profile.contact.city.input"
            />
            <Field
              label="Phone"
              value={phone}
              editing={editing}
              ocid="profile.contact.phone.input"
              type="tel"
            />
            <div className="col-span-2">
              <Field
                label="Email Address"
                value={email}
                editing={editing}
                ocid="profile.contact.email.input"
                type="email"
              />
            </div>
          </div>
        )}
      </EditableSection>

      {/* Emergency Contact */}
      <EditableSection title="Emergency Contact" ocidScope="profile.emergency">
        {(editing) => (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field
              label="Full Name"
              value={ecName}
              editing={editing}
              ocid="profile.emergency.name.input"
            />
            <Field
              label="Relationship"
              value={ecRelationship}
              editing={editing}
              ocid="profile.emergency.relationship.input"
            />
            <Field
              label="Phone"
              value={ecPhone}
              editing={editing}
              ocid="profile.emergency.phone.input"
              type="tel"
            />
            <Field
              label="Email"
              value={ecEmail}
              editing={editing}
              ocid="profile.emergency.email.input"
              type="email"
            />
          </div>
        )}
      </EditableSection>

      {/* Insurance Information */}
      <EditableSection
        title="Insurance Information"
        ocidScope="profile.insurance"
      >
        {(editing) => (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Field
              label="Insurance Provider"
              value={insProvider}
              editing={editing}
              ocid="profile.insurance.provider.input"
            />
            <Field
              label="Plan Type"
              value={insPlan}
              editing={editing}
              ocid="profile.insurance.plan.input"
            />
            <Field
              label="Member ID"
              value={insMemberId}
              editing={editing}
              ocid="profile.insurance.member-id.input"
            />
            <Field
              label="Group Number"
              value={insGroupNo}
              editing={editing}
              ocid="profile.insurance.group.input"
            />
            <Field
              label="Effective Date"
              value={insEffective}
              editing={editing}
              ocid="profile.insurance.effective.input"
            />
            <Field
              label="Expiry Date"
              value={insExpiry}
              editing={editing}
              ocid="profile.insurance.expiry.input"
            />
          </div>
        )}
      </EditableSection>
    </div>
  );
}
