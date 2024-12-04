"use client";
import { Brain } from "lucide-react";
import SheetSettings from "./modals/sheet-setting";

interface NavbarProps {
  quizCount: number;
  onOpenSettings: () => void;
}

export const Navbar = ({ quizCount, onOpenSettings }: NavbarProps) => {
  return (
    <header className="py-6 border-b border-gray-800">
      <div className="container mx-auto flex w-full px-0 sm:px-4 justify-start sm:justify-between gap-3 sm:gap-0 sm:items-center flex-col sm:flex-row">
        <nav className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-[#00FF88]" />
          <span className="text-xl font-bold">AI Quiz Generator</span>
          {!globalThis.localStorage?.getItem("apiKey") && (
            <span className="ml-4 text-sm text-gray-400">
              ({quizCount}/5 quizzes generados)
            </span>
          )}
        </nav>
        <nav className="flex items-center gap-4">
          <SheetSettings onOpenSettings={onOpenSettings} />
        </nav>
      </div>
    </header>
  );
};
