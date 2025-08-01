import AppSidebar from "@/components/side-bar/app-sidebar";
import InnerLayout from "@/components/layout/inner-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import ThemeSwitcher from "@/components/theme/theme-switcher";
import AppSidebarTrigger from "@/components/side-bar/app-sidebar-trigger";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function AuthenticatedLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <AppSidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="cursor-pointer">
                    Beta Mode
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>
        <InnerLayout>{children}</InnerLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
