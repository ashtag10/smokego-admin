"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatPrice } from "@/lib/utils/format";

const COLORS = ["#D4AF37", "#B8860B", "#F4D03F", "#8B1A1A", "#2A2A2A"];

interface ChartDataItem {
  name: string;
  value: number;
}

interface RevenueChartProps {
  data: ChartDataItem[];
  type?: "bar" | "pie";
}

function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-smoke-card border border-smoke-border rounded-lg p-3 shadow-xl">
        <p className="text-smoke-muted text-xs mb-1">{label}</p>
        <p className="text-smoke-gold text-sm font-bold">{formatPrice(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-smoke-card border border-smoke-border rounded-lg p-3 shadow-xl">
        <p className="text-smoke-muted text-xs mb-1">{payload[0].name}</p>
        <p className="text-smoke-gold text-sm font-bold">{formatPrice(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export function RevenueChart({ data, type = "bar" }: RevenueChartProps) {
  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
        <YAxis
          stroke="#9CA3AF"
          fontSize={12}
          tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}