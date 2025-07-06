"use client";

import { ChevronRight, LucideProps, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { usePathname } from "next/navigation";
import ActiveIndicator from "@/components/common/indicator/active-indicator";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platforms</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasNestedItems = item?.items && item.items.length > 0;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {hasNestedItems ? (
                  <CollapsibleTrigger className="cursor-pointer" asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <Link href={item.url}>
                    <SidebarMenuButton
                      className="cursor-pointer"
                      tooltip={item.title}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                )}
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isPathActive = DetectActivePath(subItem.url);
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              className={`cursor-pointer transition-all flex items-center`}
                              href={subItem.url}
                            >
                              {subItem.icon && <subItem.icon />}
                              <div className="flex items-center gap-2">
                                <span>{subItem.title}</span>
                                {isPathActive && (
                                  <ActiveIndicator className="bg-cyan-500 mt-[0.1rem]" />
                                )}
                              </div>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function DetectActivePath(url: string): boolean {
  const pathName = usePathname();

  if (!url) return false;

  const isPathActive = pathName.includes(url);

  if (isPathActive) return true;

  return false;
}
