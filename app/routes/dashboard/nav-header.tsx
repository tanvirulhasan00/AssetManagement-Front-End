import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "~/components/ui/sidebar";

const NavHeader = ({ openB }: { openB: boolean }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem
        className={`flex items-center gap-2 ${openB ? "p-5" : "p-0"}`}
      >
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={"/assetlogo.png"} alt="logo" />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{"Asset Management"}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavHeader;
