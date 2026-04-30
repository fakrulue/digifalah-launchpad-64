import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, PenSquare, Tags, MessageSquare,
  Search, BarChart3, Tag, Map, Image, Upload, Inbox, Settings,
  Users, Database, Key, Sparkles, LogOut, Wand2,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const GROUPS = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Visual Builder",
    items: [{ title: "Edit Pages", url: "/admin/builder", icon: Wand2 }],
  },
  {
    label: "Blog",
    items: [
      { title: "All Posts", url: "/admin/blog", icon: FileText },
      { title: "AI Writer", url: "/admin/blog/new", icon: PenSquare },
      { title: "Categories", url: "/admin/blog/categories", icon: Tags },
      { title: "Comments", url: "/admin/blog/comments", icon: MessageSquare },
    ],
  },
  {
    label: "SEO",
    items: [
      { title: "SEO Dashboard", url: "/admin/seo", icon: BarChart3 },
      { title: "Keywords", url: "/admin/seo/keywords", icon: Tag },
      { title: "Meta Manager", url: "/admin/seo/meta", icon: Search },
      { title: "Sitemap", url: "/admin/seo/sitemap", icon: Map },
    ],
  },
  {
    label: "Media",
    items: [
      { title: "Library", url: "/admin/media", icon: Image },
      { title: "Upload", url: "/admin/media/upload", icon: Upload },
    ],
  },
  {
    label: "Leads",
    items: [{ title: "All Leads", url: "/admin/leads", icon: Inbox }],
  },
  {
    label: "Settings",
    items: [
      { title: "General", url: "/admin/settings", icon: Settings },
      { title: "Users & Roles", url: "/admin/settings/users", icon: Users },
      { title: "Backups", url: "/admin/settings/backup", icon: Database },
      { title: "API Keys", url: "/admin/settings/keys", icon: Key },
    ],
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { signOut, user } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-gold">
            <Sparkles className="h-4 w-4 text-emerald-deep" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold text-sidebar-foreground">
              DigiFalah
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.url;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="px-2 py-1 text-xs text-sidebar-foreground/70 truncate">
            {user.email}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}