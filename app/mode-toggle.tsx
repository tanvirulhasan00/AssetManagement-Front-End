// import { useContext } from "react";
// import { Sun, Moon } from "lucide-react";
// import { Button } from "~/components/ui/button"; // Adjust based on your setup
// import { ThemeContext } from "./theme-provider";

// export default function ThemeToggle() {
//   const themeContext = useContext(ThemeContext);
//   if (!themeContext) return null;

//   const { theme, toggleTheme } = themeContext;

//   return (
//     <Button onClick={toggleTheme} variant="ghost">
//       {theme === "dark" ? (
//         <Sun className="w-5 h-5" />
//       ) : (
//         <Moon className="w-5 h-5" />
//       )}
//     </Button>
//   );
// }

import { useContext } from "react";
import { ThemeContext } from "./theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  const { theme, setTheme } = themeContext;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="cursor-pointer">
          {theme === "light" ? (
            <Sun className="w-5 h-5" />
          ) : theme === "dark" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Monitor className="w-5 h-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer"
        >
          <Sun className="w-4 h-4 mr-2" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer"
        >
          <Moon className="w-4 h-4 mr-2" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer"
        >
          <Monitor className="w-4 h-4 mr-2" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
