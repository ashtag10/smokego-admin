import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-smoke-black text-center px-4">
      <h1 className="text-6xl font-bold text-smoke-gold mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-smoke-white mb-2">Page introuvable</h2>
      <p className="text-smoke-muted mb-8">La page que vous recherchez n&apos;existe pas.</p>
      <Link href="/dashboard/overview">
        <Button>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au dashboard
        </Button>
      </Link>
    </div>
  );
}