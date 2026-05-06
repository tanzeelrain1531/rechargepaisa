import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DEMO_CAREGIVERS, type DemoCaregiver } from "@/demoData";
import { useActor } from "@/hooks/useActor";
import { Mail, Phone, Plus, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const RELATIONSHIPS = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Friend",
  "Legal Guardian",
  "Healthcare Proxy",
  "Other",
];

const PERMISSION_LABELS: {
  key: keyof DemoCaregiver["permissions"];
  label: string;
}[] = [
  { key: "medicalDecisionMaker", label: "Medical Decision Maker" },
  { key: "accessToRecords", label: "Access to Records" },
  { key: "receiveCommunications", label: "Receive Communications" },
  { key: "emergencyContact", label: "Emergency Contact" },
];

interface BackendCaregiver extends DemoCaregiver {
  _backendId: bigint;
}

export default function CaregiversTab({
  activePatientId,
}: { activePatientId?: bigint }) {
  const { actor, isFetching } = useActor();
  const patientId = activePatientId ?? 1n;

  const [backendCaregivers, setBackendCaregivers] = useState<
    BackendCaregiver[]
  >([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    relationship: "Spouse",
    phone: "",
    email: "",
    permissions: {
      medicalDecisionMaker: false,
      accessToRecords: true,
      receiveCommunications: true,
      emergencyContact: false,
    } as DemoCaregiver["permissions"],
  });

  const seedCaregivers = DEMO_CAREGIVERS.filter(
    (c) => c.patientId === patientId,
  );
  const allCaregivers: (DemoCaregiver & { _backendId?: bigint })[] = [
    ...seedCaregivers,
    ...backendCaregivers.filter((c) => c.patientId === patientId),
  ];

  useEffect(() => {
    if (isFetching || !actor) return;
    const a = actor;
    const pid = patientId;
    a.listCaregivers()
      .then((results) => {
        const mapped: BackendCaregiver[] = results
          .filter((c) => c.patientId === pid)
          .map((c) => {
            let permissions: DemoCaregiver["permissions"] = {
              medicalDecisionMaker: false,
              accessToRecords: true,
              receiveCommunications: true,
              emergencyContact: false,
            };
            try {
              permissions = JSON.parse(c.permissionsJson);
            } catch {
              // keep defaults
            }
            return {
              id: `cg-backend-${String(c.id)}`,
              patientId: c.patientId,
              name: c.name,
              relationship: c.relationship,
              phone: c.phone,
              email: c.email,
              permissions,
              _backendId: c.id,
            };
          });
        setBackendCaregivers(mapped);
      })
      .catch(() => {})
      .finally(() => setIsLoadingBackend(false));
  }, [actor, isFetching, patientId]);

  function loadFromBackend() {
    if (!actor) return;
    actor
      .listCaregivers()
      .then((results) => {
        const mapped: BackendCaregiver[] = results
          .filter((c) => c.patientId === patientId)
          .map((c) => {
            let permissions: DemoCaregiver["permissions"] = {
              medicalDecisionMaker: false,
              accessToRecords: true,
              receiveCommunications: true,
              emergencyContact: false,
            };
            try {
              permissions = JSON.parse(c.permissionsJson);
            } catch {
              // keep defaults
            }
            return {
              id: `cg-backend-${String(c.id)}`,
              patientId: c.patientId,
              name: c.name,
              relationship: c.relationship,
              phone: c.phone,
              email: c.email,
              permissions,
              _backendId: c.id,
            };
          });
        setBackendCaregivers(mapped);
      })
      .catch(() => {})
      .finally(() => setIsLoadingBackend(false));
  }

  async function handleAdd() {
    if (!form.name.trim()) return;
    if (actor) {
      try {
        await actor.addCaregiver({
          id: 0n,
          patientId,
          name: form.name,
          relationship: form.relationship,
          phone: form.phone,
          email: form.email,
          permissionsJson: JSON.stringify(form.permissions),
        });
        loadFromBackend();
      } catch {
        // fall back to local if backend fails
        setBackendCaregivers((prev) => [
          ...prev,
          {
            id: `cg-new-${Date.now()}`,
            patientId,
            ...form,
            _backendId: 0n,
          },
        ]);
      }
    } else {
      setBackendCaregivers((prev) => [
        ...prev,
        {
          id: `cg-new-${Date.now()}`,
          patientId,
          ...form,
          _backendId: 0n,
        },
      ]);
    }
    setForm({
      name: "",
      relationship: "Spouse",
      phone: "",
      email: "",
      permissions: {
        medicalDecisionMaker: false,
        accessToRecords: true,
        receiveCommunications: true,
        emergencyContact: false,
      },
    });
    setShowForm(false);
  }

  function handleRemove(backendId: bigint) {
    if (!actor) return;
    actor
      .removeCaregiver(backendId)
      .then(() => {
        setBackendCaregivers((prev) =>
          prev.filter((c) => c._backendId !== backendId),
        );
      })
      .catch(() => {});
  }

  return (
    <div className="p-5 space-y-4" data-ocid="caregivers.page">
      <div className="flex items-center gap-3">
        <UserCheck className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">
          Caregivers &amp; Family
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => setShowForm((v) => !v)}
          data-ocid="caregivers.add_caregiver.open_modal_button"
        >
          <Plus className="w-3 h-3 mr-1" />
          {showForm ? "Cancel" : "Add Caregiver"}
        </Button>
      </div>

      {showForm && (
        <Card data-ocid="caregivers.add_caregiver.panel">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm font-semibold">
              New Caregiver
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Jane Doe"
                  data-ocid="caregivers.name.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Relationship</Label>
                <Select
                  value={form.relationship}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, relationship: v }))
                  }
                >
                  <SelectTrigger data-ocid="caregivers.relationship.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIPS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="(555) 000-0000"
                  data-ocid="caregivers.phone.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="jane@example.com"
                  data-ocid="caregivers.email.input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Permissions</Label>
              <div className="grid grid-cols-2 gap-2">
                {PERMISSION_LABELS.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={key}
                      checked={form.permissions[key]}
                      onCheckedChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          permissions: { ...f.permissions, [key]: !!v },
                        }))
                      }
                      data-ocid={`caregivers.permission_${key}.checkbox`}
                    />
                    <Label htmlFor={key} className="text-xs cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAdd}
              size="sm"
              data-ocid="caregivers.save.button"
            >
              Add Caregiver
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoadingBackend ? (
        <div className="space-y-3" data-ocid="caregivers.loading_state">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : allCaregivers.length === 0 ? (
        <div
          className="py-10 text-center text-muted-foreground text-sm"
          data-ocid="caregivers.empty_state"
        >
          No caregivers on file for this patient.
        </div>
      ) : (
        <div className="space-y-3" data-ocid="caregivers.list">
          {allCaregivers.map((cg, idx) => {
            const backendCg = cg as BackendCaregiver;
            const isBackend =
              backendCg._backendId !== undefined && backendCg._backendId !== 0n;
            return (
              <Card key={cg.id} data-ocid={`caregivers.item.${idx + 1}`}>
                <CardContent className="px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {cg.name}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {cg.relationship}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {cg.phone && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {cg.phone}
                          </span>
                        )}
                        {cg.email && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {cg.email}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {PERMISSION_LABELS.filter(
                          ({ key }) => cg.permissions[key],
                        ).map(({ key, label }) => (
                          <span
                            key={key}
                            className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isBackend && (
                      <button
                        type="button"
                        onClick={() => handleRemove(backendCg._backendId)}
                        className="text-muted-foreground hover:text-destructive"
                        data-ocid={`caregivers.delete_button.${idx + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
