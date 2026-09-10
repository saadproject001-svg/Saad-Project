import { Search, Bell, ScanLine, Menu } from "lucide-react";
import { currentUser } from "../data/mockData";

export default function Header({ title, onMenuClick }) {
  return (
    <header className="h-16 bg-neu-bg flex items-center px-4 md:px-8 gap-3 md:gap-7">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="neu-icon-btn lg:hidden shrink-0 p-2 -ml-2 rounded-full text-neu-muted hover:text-neu-text"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-base md:text-xl font-bold tracking-tight whitespace-nowrap truncate text-neu-text">{title}</h1>
      <div className="neu-input hidden md:flex w-[220px] lg:w-[290px] h-12 rounded-xl items-center px-3 gap-3 text-sm text-neu-muted">
        <Search className="w-[18px] h-[18px] shrink-0" />
        <span className="truncate">Search product, SKU or warehouse...</span>
      </div>
      <div className="ml-auto flex items-center gap-3 md:gap-7 text-neu-muted">
        <button className="neu-icon-btn w-9 h-9 rounded-full flex items-center justify-center md:hidden hover:text-accent">
          <Search className="w-[18px] h-[18px]" />
        </button>
        <button className="neu-icon-btn w-9 h-9 rounded-full flex items-center justify-center hover:text-accent">
          <Bell className="w-[18px] h-[18px]" />
        </button>
        <button className="neu-icon-btn w-9 h-9 rounded-full items-center justify-center hover:text-accent hidden sm:flex">
          <ScanLine className="w-[18px] h-[18px]" />
        </button>
        <img className="w-9 h-9 rounded-full cursor-pointer shrink-0 neu-soft p-0.5" src={currentUser.avatar} alt="Profile" />
      </div>
    </header>
  );
}
