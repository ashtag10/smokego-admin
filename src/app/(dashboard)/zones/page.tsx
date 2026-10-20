"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { getZones, createZone, deleteZone, Zone } from "@/lib/api/zones";

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCity, setNewCity] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newFee, setNewFee] = useState("");

  useEffect(() => {
    loadZones();
  }, []);

  async function loadZones() {
    try {
      const data = await getZones();
      setZones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newCity || !newDistrict || !newFee) return;
    try {
      await createZone({ city: newCity, district: newDistrict, fee: parseFloat(newFee) });
      setNewCity("");
      setNewDistrict("");
      setNewFee("");
      loadZones();
    } catch (err) {
      alert("Erreur lors de l'ajout");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette zone ?")) return;
    try {
      await deleteZone(id);
      loadZones();
    } catch (err) {
      alert("Erreur lors de la suppression");
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
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-smoke-white flex items-center gap-3">
        <MapPin className="h-6 w-6 text-smoke-gold" />
        Zones de livraison
      </h1>

      <form onSubmit={handleAdd} className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Input placeholder="Ville" value={newCity} onChange={(e) => setNewCity(e.target.value)} required />
          <Input placeholder="Quartier" value={newDistrict} onChange={(e) => setNewDistrict(e.target.value)} required />
          <Input type="number" placeholder="Frais (FCFA)" value={newFee} onChange={(e) => setNewFee(e.target.value)} required />
        </div>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter la zone
        </Button>
      </form>

      <Table>
        <TableHead>
          <TableHeader>Ville</TableHeader>
          <TableHeader>Quartier</TableHeader>
          <TableHeader>Frais</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableHead>
        <TableBody>
          {zones.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell className="text-smoke-white">{zone.city}</TableCell>
              <TableCell className="text-smoke-white">{zone.district}</TableCell>
              <TableCell>
                <Badge variant="default">{zone.fee} FCFA</Badge>
              </TableCell>
              <TableCell className="text-right">
                <button onClick={() => handleDelete(zone.id)} className="p-2 text-smoke-muted hover:text-smoke-red transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}