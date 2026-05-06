export interface ClinicalSummaryPatient {
  name: string;
  dob: string;
  mrn: string;
  diagnoses: string[];
  medications: { name: string; dose: string; frequency: string }[];
  allergies: string[];
  recentLabs: { test: string; result: string; date: string; flag: string }[];
  activeOrders: string[];
}

export function generateClinicalSummary(
  patient: ClinicalSummaryPatient,
): string {
  const now = new Date();
  const generatedAt = now.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const flagColor = (flag: string) => {
    switch (flag.toLowerCase()) {
      case "high":
      case "critical":
        return "#c0392b";
      case "low":
        return "#2980b9";
      default:
        return "#27ae60";
    }
  };

  const rows = <T>(
    items: T[],
    headers: string[],
    cells: ((item: T) => string)[],
  ) => {
    if (items.length === 0)
      return `<tr><td colspan="${headers.length}" style="color:#888;padding:8px 0;">None recorded</td></tr>`;
    return items
      .map(
        (item) =>
          `<tr>${cells.map((fn, i) => `<td style="padding:7px 10px;border-bottom:1px solid #eee;${i === 0 ? "font-weight:500;" : ""}">${fn(item)}</td>`).join("")}</tr>`,
      )
      .join("");
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Clinical Summary — ${patient.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a1a; background: #fff; padding: 32px; max-width: 860px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #1a4a7a; padding-bottom: 16px; margin-bottom: 20px; }
    .clinic-name { font-size: 20px; font-weight: 700; color: #1a4a7a; letter-spacing: -0.3px; }
    .clinic-sub { font-size: 11px; color: #666; margin-top: 2px; }
    .doc-title { font-size: 13px; font-weight: 600; color: #555; text-align: right; }
    .doc-date { font-size: 11px; color: #888; margin-top: 2px; }
    .patient-card { background: #f4f7fb; border: 1px solid #d0daea; border-radius: 4px; padding: 14px 18px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .patient-field label { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #5a6a80; margin-bottom: 2px; }
    .patient-field span { font-size: 13px; font-weight: 600; color: #1a1a1a; }
    section { margin-bottom: 22px; }
    section h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #1a4a7a; border-bottom: 1px solid #d0daea; padding-bottom: 6px; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; }
    thead th { text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #5a6a80; padding: 0 10px 8px; }
    tbody tr:last-child td { border-bottom: none; }
    .flag { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 7px; border-radius: 10px; background: #eee; }
    .footer { margin-top: 32px; border-top: 1px solid #eee; padding-top: 12px; font-size: 10px; color: #aaa; }
    @media print {
      body { padding: 0; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="clinic-name">MedUnite Clinic</div>
      <div class="clinic-sub">Patient Clinical Summary</div>
    </div>
    <div>
      <div class="doc-title">CONFIDENTIAL MEDICAL RECORD</div>
      <div class="doc-date">Generated: ${generatedAt}</div>
    </div>
  </div>

  <div class="patient-card">
    <div class="patient-field"><label>Patient Name</label><span>${patient.name}</span></div>
    <div class="patient-field"><label>Date of Birth</label><span>${patient.dob}</span></div>
    <div class="patient-field"><label>MRN</label><span>${patient.mrn}</span></div>
  </div>

  <section>
    <h2>Active Diagnoses</h2>
    <table>
      <tbody>
        ${patient.diagnoses.length === 0 ? '<tr><td style="color:#888;padding:8px 0;">No active diagnoses</td></tr>' : patient.diagnoses.map((d) => `<tr><td style="padding:7px 0;border-bottom:1px solid #eee;">&#x2022; ${d}</td></tr>`).join("")}
      </tbody>
    </table>
  </section>

  <section>
    <h2>Current Medications</h2>
    <table>
      <thead><tr><th>Medication</th><th>Dose</th><th>Frequency</th></tr></thead>
      <tbody>
        ${rows(
          patient.medications,
          ["Medication", "Dose", "Frequency"],
          [(m) => m.name, (m) => m.dose, (m) => m.frequency],
        )}
      </tbody>
    </table>
  </section>

  <section>
    <h2>Allergies &amp; Adverse Reactions</h2>
    <table>
      <tbody>
        ${patient.allergies.length === 0 ? '<tr><td style="color:#888;padding:8px 0;">NKDA — No Known Drug Allergies</td></tr>' : patient.allergies.map((a) => `<tr><td style="padding:7px 0;border-bottom:1px solid #eee;">&#x26A0; ${a}</td></tr>`).join("")}
      </tbody>
    </table>
  </section>

  <section>
    <h2>Recent Laboratory Results</h2>
    <table>
      <thead><tr><th>Test</th><th>Result</th><th>Date</th><th>Flag</th></tr></thead>
      <tbody>
        ${rows(
          patient.recentLabs,
          ["Test", "Result", "Date", "Flag"],
          [
            (l) => l.test,
            (l) => l.result,
            (l) => l.date,
            (l) =>
              `<span class="flag" style="background:${flagColor(l.flag)}20;color:${flagColor(l.flag)};">${l.flag}</span>`,
          ],
        )}
      </tbody>
    </table>
  </section>

  <section>
    <h2>Active Orders</h2>
    <table>
      <tbody>
        ${patient.activeOrders.length === 0 ? '<tr><td style="color:#888;padding:8px 0;">No active orders</td></tr>' : patient.activeOrders.map((o) => `<tr><td style="padding:7px 0;border-bottom:1px solid #eee;">&#x2022; ${o}</td></tr>`).join("")}
      </tbody>
    </table>
  </section>

  <div class="footer">
    This document is a computer-generated clinical summary from MedUnite EHR. It is intended for use by authorized healthcare providers and the named patient only. For questions, contact MedUnite Clinic. &copy; ${now.getFullYear()} MedUnite.
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;
}

export function printClinicalSummary(patient: ClinicalSummaryPatient): void {
  const html = generateClinicalSummary(patient);
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert(
      "Pop-up blocked. Please allow pop-ups for this site to print the clinical summary.",
    );
    return;
  }
  win.document.write(html);
  win.document.close();
}
