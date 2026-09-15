"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { Users, Shield, Eye } from "lucide-react";
import Link from "next/link";
import { getTeamMembers, TeamMember } from "@/lib/api/team";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      const data = await getTeamMembers();
      setMembers(data);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-smoke-white flex items-center gap-3">
          <Users className="h-6 w-6 text-smoke-gold" />
          Équipe admin
        </h1>
        <Link href="/dashboard/team/audit-log">
          <Button variant="secondary" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Journal d&apos;audit
          </Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableHeader>Nom</TableHeader>
          <TableHeader>Rôle</TableHeader>
          <TableHeader>Téléphone</TableHeader>
          <TableHeader>Statut</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div>
                  <p className="text-smoke-white font-medium">{member.name}</p>
                  <p className="text-xs text-smoke-muted">{member.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="info">{member.adminRole ?? "ADMIN"}</Badge>
              </TableCell>
              <TableCell className="text-smoke-muted">{member.phone}</TableCell>
              <TableCell>
                <Badge variant={member.isActive ? "success" : "danger"}>
                  {member.isActive ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <button className="p-2 text-smoke-muted hover:text-smoke-gold transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}