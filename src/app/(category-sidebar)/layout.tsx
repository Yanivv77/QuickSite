import { 
  Sidebar,
  SidebarProvider,
  SidebarContent, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMobile
} from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import Link from "next/link";
import { getCollections } from "@/lib/queries";


export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allCollections = await getCollections();
  return (
    <SidebarProvider>   
      <div className="flex h-screen">
        {/* Mobile Sidebar */}
        <SidebarMobile>
          <SidebarContent>
            <SidebarMenu>
              {allCollections.map((category) => (
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
        <Sidebar>
        <SidebarContent>
            <SidebarMenu>
              {allCollections.map((category) => (
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
        <SidebarTrigger />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto bg-slate-50/50">
            <div className=" ">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
