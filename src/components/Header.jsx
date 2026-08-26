import { Search, Bell, ScanLine, Menu } from "lucide-react";
import { currentUser } from "../data/mockData";

export default function Header({ title, onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-8 gap-3 md:gap-7">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden shrink-0 p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-base md:text-xl font-bold tracking-tight whitespace-nowrap truncate">{title}</h1>
      <div className="hidden md:flex w-[220px] lg:w-[290px] h-12 bg-[#f8f9fb] rounded-lg items-center px-3 gap-3 text-sm text-slate-500">
        <Search className="w-[18px] h-[18px] shrink-0" />
        <span className="truncate">Search product, SKU or warehouse...</span>
      </div>
      <div className="ml-auto flex items-center gap-3 md:gap-7 text-slate-500">
        <Search className="w-5 h-5 cursor-pointer hover:text-slate-700 md:hidden" />
        <Bell className="w-5 h-5 cursor-pointer hover:text-slate-700" />
        <ScanLine className="w-5 h-5 cursor-pointer hover:text-slate-700 hidden sm:block" />
        <div className="h-7 w-px bg-slate-200 hidden sm:block" />
        <img className="w-8 h-8 rounded-full cursor-pointer shrink-0" src={currentUser.avatar} alt="Profile" />
      </div>
    </header>
  );
}
