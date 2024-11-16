"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";
import { Book, X } from "lucide-react";

const SidebarContext = React.createContext<{
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}>({
  isExpanded: false,
  setIsExpanded: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ 
      isExpanded, 
      setIsExpanded,
      isMobileOpen,
      setIsMobileOpen 
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = React.useContext(SidebarContext);

  return (
    <div
      ref={ref}
      className={cn(
        "hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isExpanded ? "" : "w-0 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Sidebar.displayName = "Sidebar";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { setIsExpanded, setIsMobileOpen } = React.useContext(SidebarContext);
  
  const handleClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(true);
    } else {
      setIsExpanded(prev => !prev);
    }
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full p-2 text-gray-700 hover:bg-gray-100 transition-colors",
        className
      )}
      {...props}
    >
      <Book className="h-6 w-6" />
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("flex-1 overflow-auto py-4", className)} 
    {...props} 
  />
));
SidebarContent.displayName = "SidebarContent";

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1 px-2", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = React.useContext(SidebarContext);

  return (
    <button
      ref={ref}
      className={cn(
        "w-full rounded-lg px-3 py-2 text-sm font-medium text-gray-700",
        "hover:bg-gray-100 hover:text-gray-900",
        "transition-colors duration-200",
        "flex items-center gap-2",
        isExpanded ? "justify-start" : "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarMobile = React.forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps
>(({ className, children, ...props }, ref) => {
  const { isMobileOpen, setIsMobileOpen } = React.useContext(SidebarContext);
  
  return (
    <DialogPrimitive.Root open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay 
          className={cn(
            "fixed inset-0 z-50 bg-black/50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed inset-y-0 left-0 z-50 h-full w-3/4 max-w-sm bg-white shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
            "duration-300",
            className
          )}
          {...props}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <DialogPrimitive.Title className="text-lg font-semibold">
                Navigation
              </DialogPrimitive.Title>
              <DialogPrimitive.Close className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
});
SidebarMobile.displayName = "SidebarMobile";