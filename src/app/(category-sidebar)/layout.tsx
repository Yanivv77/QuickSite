import { 
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMobile
} from "@/components/ui/sidebar";
import { getCategories } from "@/db/scripts_utils";
import { Menu } from "lucide-react";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allCategories = await getCategories();

  return (
    <SidebarProvider>   
      <div className="flex h-screen">
        {/* Mobile Sidebar */}
        <SidebarMobile>
          <SidebarContent className="px-3 pt-6">
            <SidebarMenu>
              {allCategories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <Link href={`/products/${category.slug}`} className="block w-full">
                    <SidebarMenuButton>{category.name}</SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarMobile>

        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex w-64 border-l border-border/10 bg-slate-50/50">
          <SidebarContent className="px-3 pt-6">
            <SidebarMenu>
              {allCategories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <Link href={`/products/${category.slug}`} className="block w-full">
                    <SidebarMenuButton>{category.name}</SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="flex h-16 items-center border-b border-border/10 px-6">
            <SidebarTrigger className="md:hidden hover:bg-slate-100 rounded-lg p-2">
              <Menu className="h-5 w-5 text-slate-600" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
          </header>
          <main className="flex-1 overflow-auto bg-slate-50/50">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
