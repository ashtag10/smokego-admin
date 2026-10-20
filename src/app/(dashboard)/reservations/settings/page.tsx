"use client";

import { useEffect, useState } from "react";
import { getTables, createTable } from "@/lib/api/reservations";
import { Table as TableType } from "@/types/reservation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

export default function ReservationSettingsPage() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTableName, setNewTableName] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("");

  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {
    try {
      const res = await getTables();
      setTables(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTable(e: React.FormEvent) {
    e.preventDefault();
    if (!newTableName || !newTableCapacity) return;
    try {
      await createTable({ name: newTableName, capacity: parseInt(newTableCapacity) });
      setNewTableName("");
      setNewTableCapacity("");
      loadTables();
    } catch (err) {
      alert("Erreur lors de l'ajout de la table");
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
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-smoke-white">Paramètres réservations</h1>

      <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-smoke-white">Tables du lounge</h2>

        <form onSubmit={handleAddTable} className="flex gap-3">
          <Input
            placeholder="Nom de la table"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Capacité"
            value={newTableCapacity}
            onChange={(e) => setNewTableCapacity(e.target.value)}
            className="w-32"
          />
          <Button type="submit">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <Table>
          <TableHead>
            <TableHeader>Nom</TableHeader>
            <TableHeader>Capacité</TableHeader>
            <TableHeader>Statut</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="text-smoke-white">{table.name}</TableCell>
                <TableCell className="text-smoke-white">{table.capacity} pers.</TableCell>
                <TableCell>
                  <span className={table.isActive ? "text-green-400" : "text-smoke-red-light"}>
                    {table.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button className="p-2 text-smoke-muted hover:text-smoke-red transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}