"use client";

import { Menu } from "lucide-react";

import { Activity, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import Icon from "@/components/sidebar-icon";
import ProfileDropdown from "@/components/sidebar-profile-dropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Applications", href: "/job-applications" },
  { name: "Resume Enhancer", href: "/resume-enhancer" },
];

const SidebarContent = ({
  user,
  pathname,
  onNavigate,
}: {
  user: any;
  pathname: string;
  onNavigate?: () => void;
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col h-full bg-primary text-sidebar-primary-foreground p-2">
      <div className="mb-6 px-4">
        <img
          src="/calibrate.svg"
          alt="Calibrate AI Logo"
          className="object-cover w-full dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <ul>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="py-3 px-4 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200 flex items-center gap-2 text-md font-medium rounded-lg"
          >
            <Icon
              name={link.name.toLowerCase()}
              isCurrentPath={pathname === link.href}
            />
            {link.name}
          </Link>
        ))}
      </ul>
      <Button
        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-sm font-medium rounded-lg w-full h-fit py-2! mt-6"
        onClick={() => router.push("/job-applications/new")}
      >
        New Application
      </Button>
      <section className="mt-auto w-full">
        {user && <ProfileDropdown user={user} />}
      </section>
    </div>
  );
};

const Sidebar = ({ user }: { user: any }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hiddenPaths = [
    "/login",
    "/sign-up",
    "/",
    "/privacy-policy",
    "/terms-of-service",
  ];
  const isVisible = !hiddenPaths.includes(pathname);

  return (
    <Activity mode={isVisible ? "visible" : "hidden"}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:max-w-72 min-h-screen shrink-0 border-r border-sidebar-border flex-col">
        <SidebarContent user={user} pathname={pathname} />
      </div>

      {/* Mobile/tablet top bar with hamburger */}
      <div className="lg:hidden flex items-center justify-between bg-primary text-sidebar-primary-foreground px-4 py-3 w-full border-b border-sidebar-border">
        <img
          src="/calibrate.svg"
          alt="Calibrate AI Logo"
          className="h-8 object-contain dark:brightness-[0.2] dark:grayscale"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-primary-foreground hover:bg-sidebar-accent"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-primary">
            <SidebarContent
              user={user}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </Activity>
  );
};

export default Sidebar;
