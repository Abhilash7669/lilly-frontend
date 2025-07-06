"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ICON_SIZE } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { JSX } from "react";

const BASE_CLASS = `${ICON_SIZE.large} transition-all hover:opacity-50 cursor-pointer`;

export default function AppSidebarTrigger(): JSX.Element {
  const { toggleSidebar, open } = useSidebar();

  return (
    <div className="flex items-center" onClick={toggleSidebar}>
      <Tooltip>
        <TooltipTrigger>
          {open ? <PanelLeftClose className={BASE_CLASS} /> : <PanelLeftOpen className={BASE_CLASS} />}
        </TooltipTrigger>
        <TooltipContent>
            {
                open ?
                "Close"
                :
                "Open"
            }
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
