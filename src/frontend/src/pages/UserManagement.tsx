import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, Pencil, Plus, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
type Role = string;
import { StatusBadge } from "../components/StatusBadge";
import { DEMO_USERS } from "../demoData";
import { useDemoMode } from "../hooks/useDemoMode";

type UserStatus = "active" | "inactive";

interface AppUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
}

const mockUsers: AppUser[] = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    email: "s.chen@stmichaels.org",
    role: "Doctor",
    status: "active",
  },
  {
    id: 2,
    name: "James Nguyen",
    email: "j.nguyen@stmichaels.org",
    role: "Nurse",
    status: "active",
  },
  {
    id: 3,
    name: "Maria Santos",
    email: "m.santos@stmichaels.org",
    role: "Pharmacist",
    status: "active",
  },
  {
    id: 4,
    name: "Tom Bradley",
    email: "t.bradley@stmichaels.org",
    role: "Receptionist",
    status: "active",
  },
  {
    id: 5,
    name: "Linda Park",
    email: "l.park@stmichaels.org",
    role: "Billing",
    status: "active",
  },
  {
    id: 6,
    name: "Dr. Ahmed Hassan",
    email: "a.hassan@stmichaels.org",
    role: "Doctor",
    status: "active",
  },
  {
    id: 7,
    name: "System Admin",
    email: "admin@stmichaels.org",
    role: "Admin",
    status: "active",
  },
];

const roleVariant: Record<Role, "info" | "warning" | "danger" | "neutral"> = {
  Doctor: "info",
  Nurse: "info",
  Pharmacist: "info",
  Receptionist: "warning",
  Billing: "warning",
  Admin: "danger",
  LabTech: "info",
  Radiologist: "info",
};

const allRoles: Role[] = [
  "Doctor",
  "Nurse",
  "Pharmacist",
  "Receptionist",
  "Billing",
  "Admin",
  "LabTech",
  "Radiologist",
];

interface EditForm {
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
}

export default function UserManagement() {
  const { isDemoMode } = useDemoMode();
  const loading = false;
  const [users, setUsers] = useState<AppUser[]>(() =>
    isDemoMode
      ? DEMO_USERS.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as AppUser["role"],
          status: u.status as AppUser["status"],
        }))
      : mockUsers,
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Doctor",
    status: "active",
  });
  // editingId: which user row is expanded for inline edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    email: "",
    role: "Doctor",
    status: "active",
  });

  const handleAdd = () => {
    if (!form.name || !form.email) {
      toast.error("Name and email required");
      return;
    }
    setUsers((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: form.name,
        email: form.email,
        role: form.role as Role,
        status: form.status as UserStatus,
      },
    ]);
    toast.success("User added");
    setShowForm(false);
    setForm({ name: "", email: "", role: "Doctor", status: "active" });
  };

  const startEdit = (user: AppUser) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const saveEdit = (userId: number) => {
    if (!editForm.name || !editForm.email) {
      toast.error("Name and email required");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...editForm } : u)),
    );
    toast.success("User updated");
    setEditingId(null);
  };

  const toggleStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const next = u.status === "active" ? "inactive" : "active";
        toast.success(`${u.name} set to ${next}`);
        return { ...u, status: next };
      }),
    );
  };

  return (
    <div className="space-y-5" data-ocid="users.page">
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="users.primary_button"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <ChevronUp className="w-3.5 h-3.5 mr-1.5" />
          ) : (
            <Plus className="w-3.5 h-3.5 mr-1.5" />
          )}
          Add User
        </Button>
      </div>

      {showForm && (
        <div
          className="border border-border bg-card p-5"
          data-ocid="users.panel"
        >
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Add User
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name
              </Label>
              <Input
                data-ocid="users.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
                placeholder="Full name"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Input
                data-ocid="users.email.input"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="mt-1 h-8 text-sm"
                placeholder="user@hospital.org"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}
              >
                <SelectTrigger
                  data-ocid="users.role.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allRoles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger
                  data-ocid="users.status.select"
                  className="mt-1 h-8 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              data-ocid="users.submit_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAdd}
            >
              Add User
            </Button>
            <Button
              size="sm"
              data-ocid="users.cancel_button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="border border-border bg-card">
        <Table data-ocid="users.table">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Email
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Role
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground h-9 px-4 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              [1, 2, 3, 4, 5, 6].map((k) => (
                <TableRow
                  key={`sk-${k}`}
                  data-ocid="user_management.loading_state"
                >
                  {[1, 2, 3, 4, 5].map((c) => (
                    <TableCell key={c} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading &&
              users.map((user, i) => (
                <>
                  <TableRow
                    key={user.id}
                    data-ocid={`users.row.${i + 1}`}
                    className="hover:bg-muted/30 even:bg-muted/20 border-l-2 border-l-transparent hover:border-l-accent transition-all"
                  >
                    <TableCell className="font-medium text-sm px-4 py-2.5">
                      {user.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm px-4 py-2.5 text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={roleVariant[user.role]}
                        label={user.role}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <StatusBadge
                        variant={
                          user.status === "active" ? "success" : "neutral"
                        }
                        label={user.status}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          data-ocid={`users.edit_button.${i + 1}`}
                          className="h-7 px-2 text-xs gap-1"
                          onClick={() =>
                            editingId === user.id
                              ? setEditingId(null)
                              : startEdit(user)
                          }
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          data-ocid={`users.delete_button.${i + 1}`}
                          className="h-7 px-2 text-xs gap-1"
                          style={{
                            color:
                              user.status === "active"
                                ? "var(--destructive)"
                                : "var(--success)",
                          }}
                          onClick={() => toggleStatus(user.id)}
                        >
                          {user.status === "active" ? (
                            <>
                              <UserX className="w-3 h-3" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Inline edit row */}
                  {editingId === user.id && (
                    <TableRow
                      key={`edit-${user.id}`}
                      data-ocid={`users.edit_button.${i + 1}`}
                      className="bg-muted/30 border-l-2 border-l-primary"
                    >
                      <TableCell colSpan={5} className="px-4 py-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                          <div>
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Name
                            </Label>
                            <Input
                              data-ocid="users.name.input"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  name: e.target.value,
                                }))
                              }
                              className="mt-1 h-7 text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Email
                            </Label>
                            <Input
                              data-ocid="users.email.input"
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm((p) => ({
                                  ...p,
                                  email: e.target.value,
                                }))
                              }
                              className="mt-1 h-7 text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Role
                            </Label>
                            <Select
                              value={editForm.role}
                              onValueChange={(v) =>
                                setEditForm((p) => ({ ...p, role: v as Role }))
                              }
                            >
                              <SelectTrigger className="mt-1 h-7 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {allRoles.map((r) => (
                                  <SelectItem key={r} value={r}>
                                    {r}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Status
                            </Label>
                            <Select
                              value={editForm.status}
                              onValueChange={(v) =>
                                setEditForm((p) => ({
                                  ...p,
                                  status: v as UserStatus,
                                }))
                              }
                            >
                              <SelectTrigger className="mt-1 h-7 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            data-ocid={`users.save_button.${i + 1}`}
                            className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => saveEdit(user.id)}
                          >
                            Save Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            data-ocid={`users.cancel_button.${i + 1}`}
                            className="h-7 text-xs"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
