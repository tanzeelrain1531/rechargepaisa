import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
type Role = string;
import { ReportingAnalytics } from "../components/reporting/ReportingAnalytics";
import { ReportingCensusTab } from "../components/reporting/ReportingCensusTab";
import { ReportingPayerMix } from "../components/reporting/ReportingPayerMix";
import { ReportingProductivity } from "../components/reporting/ReportingProductivity";
import { ReportingQualityMeasures } from "../components/reporting/ReportingQualityMeasures";
import { ReportingShiftSummary } from "../components/reporting/ReportingShiftSummary";
import { useActor } from "../hooks/useActor";
import PopulationHealth from "./PopulationHealth";

const MOCK_WEEKLY_VOLUME = [8, 12, 9, 15, 11, 4, 3];

interface ReportingProps {
  role: Role;
}

export default function Reporting({ role }: ReportingProps) {
  const { actor, isFetching } = useActor();

  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [weekAppts, setWeekAppts] = useState<number>(0);
  const [pendingRevenue, setPendingRevenue] = useState<number>(0);
  const [noShowRate, setNoShowRate] = useState<number>(0);
  const [statusBreakdown, setStatusBreakdown] = useState({
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    total: 0,
  });
  const [weeklyVol, setWeeklyVol] = useState(MOCK_WEEKLY_VOLUME);
  const [loading, setLoading] = useState(true);
  const [todayPatients, setTodayPatients] = useState(0);
  const [pendingNotes, setPendingNotes] = useState(0);
  const [upcomingAppts, setUpcomingAppts] = useState(0);

  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!actor || isFetching) return;
    setLoading(true);
    Promise.all([
      actor.listPatients(),
      actor.listAppointments(),
      actor.listInvoices(),
      actor.listClinicalNotes(),
    ])
      .then(([patients, appointments, invoices, notes]) => {
        setTotalPatients(patients.length);

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekStr = weekAgo.toISOString().slice(0, 10);
        setWeekAppts(appointments.filter((a) => a.date >= weekStr).length);

        const pending = invoices
          .filter((i) => i.status !== "paid")
          .reduce((sum, i) => sum + Number(i.amount), 0);
        setPendingRevenue(pending);

        const counts = { scheduled: 0, completed: 0, cancelled: 0, noShow: 0 };
        for (const a of appointments) {
          if (a.status === "scheduled") counts.scheduled++;
          else if (a.status === "completed") counts.completed++;
          else if (a.status === "cancelled") counts.cancelled++;
          else if (a.status === "no-show") counts.noShow++;
        }
        const total = appointments.length || 1;
        setStatusBreakdown({ ...counts, total });
        setNoShowRate(
          appointments.length > 0
            ? Math.round((counts.noShow / appointments.length) * 100)
            : 0,
        );

        const vol = [0, 0, 0, 0, 0, 0, 0];
        for (const a of appointments) {
          const d = new Date(a.date);
          const dayOfWeek = (d.getDay() + 6) % 7;
          if (!Number.isNaN(dayOfWeek)) vol[dayOfWeek]++;
        }
        setWeeklyVol(vol.some((v) => v > 0) ? vol : MOCK_WEEKLY_VOLUME);

        if (role === "Doctor") {
          setTodayPatients(
            appointments.filter(
              (a) => a.date.startsWith(todayStr) && a.status === "completed",
            ).length,
          );
          setPendingNotes(notes.length);
          setUpcomingAppts(
            appointments.filter(
              (a) =>
                a.date > new Date().toISOString() && a.status === "scheduled",
            ).length,
          );
        }
      })
      .catch(() => toast.error("Failed to load reporting data"))
      .finally(() => setLoading(false));
  }, [actor, isFetching, role, todayStr]);

  return (
    <div className="space-y-4" data-ocid="reporting.page">
      <Tabs defaultValue="overview">
        <TabsList
          className="w-full justify-start rounded-none border-b border-border bg-transparent h-10 gap-0 mb-4"
          data-ocid="reporting.tabs"
        >
          {[
            { value: "overview", label: "Overview" },
            { value: "productivity", label: "Provider Productivity" },
            { value: "quality", label: "Quality Measures" },
            { value: "payermix", label: "Payer Mix" },
            { value: "population-health", label: "Population Health" },
            { value: "census", label: "Census" },
            { value: "shift-summary", label: "Shift Summary" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-ocid={`reporting.${tab.value}.tab`}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-medium px-4 h-10"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-4">
          <ReportingAnalytics
            loading={loading}
            totalPatients={totalPatients}
            weekAppts={weekAppts}
            pendingRevenue={pendingRevenue}
            noShowRate={noShowRate}
            weeklyVol={weeklyVol}
            statusBreakdown={statusBreakdown}
            role={role}
            todayPatients={todayPatients}
            pendingNotes={pendingNotes}
            upcomingAppts={upcomingAppts}
          />
        </TabsContent>

        <TabsContent value="productivity" className="mt-0 space-y-4">
          <ReportingProductivity />
        </TabsContent>

        <TabsContent value="quality" className="mt-0 space-y-4">
          <ReportingQualityMeasures />
        </TabsContent>

        <TabsContent value="payermix" className="mt-0 space-y-4">
          <ReportingPayerMix />
        </TabsContent>

        <TabsContent value="population-health" className="mt-0">
          <PopulationHealth />
        </TabsContent>

        <TabsContent value="census" className="mt-0">
          <ReportingCensusTab />
        </TabsContent>

        <TabsContent value="shift-summary" className="mt-0">
          <ReportingShiftSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
