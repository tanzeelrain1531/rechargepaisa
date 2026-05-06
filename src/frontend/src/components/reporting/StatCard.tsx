import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";

export function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  iconClass,
  ocid,
}: {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  iconClass: string;
  ocid: string;
}) {
  return (
    <Card data-ocid={ocid} className="border border-border shadow-card bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`w-4 h-4 ${iconClass}`} />
      </CardHeader>
      <CardContent className="pb-4 px-4 pt-1">
        <p className="text-3xl font-bold tabular-nums leading-none text-foreground">
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
      </CardContent>
    </Card>
  );
}
