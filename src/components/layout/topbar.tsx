"use client";

import { Bell, Search, User } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-16 bg-smoke-dark/50 backdrop-blur-md border-b border-smoke-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-smoke-muted" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-smoke-card border border-smoke-border rounded-lg pl-10 pr-4 py-2 text-sm text-smoke-white placeholder:text-smoke-muted focus:outline-none focus:border-smoke-gold/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-smoke-muted hover:text-smoke-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-smoke-red rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-smoke-border">
          <div className="h-8 w-8 rounded-full bg-smoke-gold/20 flex items-center justify-center">
            <User className="h-4 w-4 text-smoke-gold" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-smoke-white">Admin</p>
            <p className="text-xs text-smoke-muted">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}