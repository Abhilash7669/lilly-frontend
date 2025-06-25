"use client";

import { NavMain } from "@/components/side-bar/nav-main";
import { NavUser } from "@/components/side-bar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  BriefcaseBusiness,
  Inbox,
  ListTodo,
  NotebookIcon,
  Search,
  Settings,
  PawPrint,
} from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

const data = {
  user: {
    userName: "Kaizen47",
    email: "abhilashsk1998@gmail.com",
    avatar: "/avatars/goku-blue.jpg"
  },
  navMain: [
    {
      title: "Workspace",
      url: "/dashboard/workspace",
      icon: BriefcaseBusiness,
      isActive: true,
      items: [
        {
          title: "To-do",
          url: "/dashboard/workspace/todo",
          icon: ListTodo,
        },
        {
          title: "Notes",
          url: "/dashboard/workspace/notes",
          icon: NotebookIcon,
        },
      ],
    },
    {
      title: "Credential Manager",
      url: "/dashboard/credentialmanager",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
};

export default function AppSidebar(): JSX.Element {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <PawPrint className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Project Lilly</span>
                  <span className="truncate text-xs">
                    Inspired by a little soul full of love.
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
