import { X } from "lucide-react";
import { useEffect } from "react";
import Sidebar from "./Sidebar";

interface MobileMenuProps {
  open: boolean;
  unreadCount: number;
  onClose: () => void;
}

export default function MobileMenu({
  open,
  unreadCount,
  onClose,
}: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute inset-y-0 left-0 flex w-64 flex-col shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 bg-surface-card px-4 py-3">
          <span className="font-semibold text-white">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Sidebar unreadCount={unreadCount} onNavigate={onClose} className="flex-1" />
      </div>
    </div>
  );
}
