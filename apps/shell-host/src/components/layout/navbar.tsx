import React, { useState, useEffect } from "react";
import { Button } from "@mf-enterprise/ui-components";
import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useAuth } from "../../auth-context";
import { useTheme } from "@mf-enterprise/ui-components";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout]);

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">Helpdesk Portal</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <a href="/">Dashboard</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="/tickets">Tickets</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="/knowledge">Knowledge Base</a>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="ghost" asChild>
            <a href="/profile">{user?.name || "Login"}</a>
          </Button>
        </div>
      </div>
    </nav>
  );
};
