"use client";

import { useEffect, useState } from "react";
import { getAuditLog } from "@/lib/api/admin";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";
import { Shield } from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  userName: string;
  oldValue: unknown;
  newValue: unknown;
  createdAt: string;
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLog();
  }, []);

  async function loadAuditLog() {
    try {
      const res = await getAuditLog({ limit: 100 });
      setEntries(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-smoke-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-smoke-white flex items-center gap-3">
        <Shield className="h-6 w-6 text-smoke-gold" />
        Journal d&apos;audit
      </h1>

      <Table>
        <TableHead>
          <TableHeader>Date</TableHeader>
          <TableHeader>Admin</TableHeader>
          <TableHeader>Action</TableHeader>
          <TableHeader>Entité</TableHeader>
          <TableHeader>Détails</TableHeader>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="text-smoke-muted text-xs whitespace-nowrap">
                {formatDate(entry.createdAt)}
              </TableCell>
              <TableCell className="text-smoke-white text-sm">{entry.userName}</TableCell>
              <TableCell>
                <Badge variant="default">{entry.action}</Badge>
              </TableCell>
              <TableCell className="text-smoke-muted">{entry.entityType}</TableCell>
              <TableCell className="text-smoke-muted text-xs max-w-xs truncate">
                {JSON.stringify(entry.newValue).slice(0, 60)}...
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}