"use client";

import { useEffect, useState } from "react";
import { getReports, resolveReport } from "@/lib/api/community";
import { Report } from "@/types/video";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils/format";
import { Check, X } from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const res = await getReports();
      setReports(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(id: string, action: "RESOLVED" | "DISMISSED") {
    try {
      await resolveReport(id, action);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Erreur lors du traitement");
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-smoke-white">Signalements</h1>
        <Badge variant="warning">{reports.length} en attente</Badge>
      </div>

      <Table>
        <TableHead>
          <TableHeader>Type</TableHeader>
          <TableHeader>Raison</TableHeader>
          <TableHeader>Statut</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <Badge variant={report.videoId ? "info" : "default"}>
                  {report.videoId ? "Vidéo" : "Commentaire"}
                </Badge>
              </TableCell>
              <TableCell className="text-smoke-white">{report.reason}</TableCell>
              <TableCell>
                <Badge variant="warning">{report.status}</Badge>
              </TableCell>
              <TableCell className="text-smoke-muted text-xs">
                {formatDate(report.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResolve(report.id, "DISMISSED")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Ignorer
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleResolve(report.id, "RESOLVED")}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Résoudre
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}