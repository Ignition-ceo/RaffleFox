import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dailyData = [
  { day: "Mon", revenue: 2400, projected: 2200 },
  { day: "Tue", revenue: 1398, projected: 2100 },
  { day: "Wed", revenue: 3200, projected: 2400 },
  { day: "Thu", revenue: 2780, projected: 2500 },
  { day: "Fri", revenue: 4890, projected: 2800 },
  { day: "Sat", revenue: 3390, projected: 2600 },
  { day: "Sun", revenue: 4490, projected: 3100 },
];

const weeklyData = [
  { day: "Week 1", revenue: 12400, projected: 11000 },
  { day: "Week 2", revenue: 15398, projected: 13000 },
  { day: "Week 3", revenue: 18200, projected: 15000 },
  { day: "Week 4", revenue: 21780, projected: 18000 },
];

const monthlyData = [
  { day: "Jan", revenue: 45000, projected: 42000 },
  { day: "Feb", revenue: 52000, projected: 48000 },
  { day: "Mar", revenue: 61000, projected: 55000 },
  { day: "Apr", revenue: 58000, projected: 60000 },
  { day: "May", revenue: 72000, projected: 65000 },
  { day: "Jun", revenue: 85000, projected: 75000 },
];

export function RevenueChart() {
  const [period, setPeriod] = useState("daily");

  const getData = () => {
    switch (period) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  return (
    <Card className="p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Revenue</h3>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
