import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "@/app/hook";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const routes = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview" },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions" },
    { href: PROTECTED_ROUTES.REPORTS, label: "Reports" },
    { href: PROTECTED_ROUTES.SETTINGS, label: "Settings" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="w-full px-4 py-3 lg:px-8">
          <div className="w-full flex h-14 max-w-[var(--max-width)] items-center mx-auto">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="inline-flex md:hidden !cursor-pointer text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => setIsOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <Logo />
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-x-1 overflow-x-auto">
                {routes?.map((route) => (
                  <Button
                    key={route.href}
                    size="sm"
                    variant="ghost"
                    className={cn(
                      `relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200
                       text-foreground hover:text-primary dark:hover:text-primary
                       hover:bg-black/5 dark:hover:bg-white/10`,
                      pathname === route.href && "text-primary bg-primary/10 dark:bg-primary/20"
                    )}
                    asChild
                  >
                    <NavLink to={route.href}>
                      {route.label}
                      {pathname === route.href && (
                        <span className="absolute inset-x-4 -bottom-1 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                      )}
                    </NavLink>
                  </Button>
                ))}
              </nav>

              {/* Mobile Navigation */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="glass-card border-r p-0">
                  <nav className="flex flex-col gap-y-2 pt-20 px-4">
                    {routes?.map((route) => (
                      <Button
                        key={route.href}
                        size="sm"
                        variant="ghost"
                        className={cn(
                          `w-full justify-start font-normal py-3 px-4 rounded-lg
                           text-foreground hover:text-primary`,
                          pathname === route.href && "bg-primary/10 dark:bg-primary/20 text-primary"
                        )}
                        asChild
                      >
                        <NavLink key={route.href} to={route.href} onClick={() => setIsOpen(false)}>
                          {route.label}
                        </NavLink>
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>

              <div className="flex items-center space-x-4">
                <UserNav
                  userName={user?.name || ""}
                  profilePicture={user?.profilePicture || ""}
                  onLogout={() => setIsLogoutDialogOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default Navbar;