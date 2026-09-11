import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

// Lets a page set the header title without re-rendering the shared
// Sidebar/Header shell — the shell (Layout) owns the title state and
// passes the setter down via route Outlet context.
export default function usePageTitle(title) {
  const setTitle = useOutletContext();

  useEffect(() => {
    setTitle?.(title);
  }, [title, setTitle]);
}
