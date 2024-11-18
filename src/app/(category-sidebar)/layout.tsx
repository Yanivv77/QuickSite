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
import { Link } from "@/components/ui/link";
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
              {allCollections.map((collection) => (
                <SidebarMenuItem key={collection.slug}>
                <Link
                key={collection.slug}
                prefetch={true}
                href={`/${collection.slug}`}
                className="block w-full py-1 text-xs text-gray-800 hover:bg-accent2 hover:underline"
              >
                {collection.name}
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
              {allCollections.map((collection) => (
                <SidebarMenuItem key={collection.slug}>
                  <Link 
                  key={collection.slug}
                  prefetch={true}
                  href={`/${collection.slug}`} 
                  className="block w-full"
                  >
                    <SidebarMenuButton>{collection.name}</SidebarMenuButton>
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
