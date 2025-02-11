import { Link, useLoaderData, useLocation } from "@remix-run/react";
import {
  ChevronRight,
  Home,
  Building,
  Info,
  User,
  Landmark,
  History,
  PersonStanding,
  ListTree,
  Contact,
  Leaf,
  Plus,
  ListPlus,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { loader } from "./route";

const NavbarManu = [
  {
    title: "Home",
    url: "/dashboard/home",
    icon: Home,
    isActive: true,
  },
  {
    title: "Areas",
    url: "/dashboard/area",
    icon: Landmark,
    items: [
      {
        title: "Division",
        url: "/dashboard/division",
        icon: Plus,
      },
      {
        title: "District",
        url: "/dashboard/district",
        icon: Plus,
      },
    ],
  },

  {
    title: "Category",
    url: "/dashboard/category",
    icon: ListTree,
  },
  {
    title: "House",
    url: "/dashboard/house",
    icon: Building,
  },
  {
    title: "Flat",
    url: "/dashboard/flat",
    icon: Leaf,
  },
  {
    title: "Renter",
    url: "/dashboard/renter",
    icon: PersonStanding,
  },
  {
    title: "Family Member",
    url: "/dashboard/family-member",
    icon: Contact,
  },
  {
    title: "Assign Renter",
    url: "/dashboard/assign",
    icon: ListPlus,
  },

  {
    title: "User",
    url: "/dashboard/users",
    icon: User,
    isActive: true,
  },
  {
    title: "Histories",
    url: "/dashboard/histories",
    icon: History,
  },
  {
    title: "About",
    url: "/dashboard/about",
    icon: Info,
  },
];

const NavMain = () => {
  const location = useLocation();
  const { role } = useLoaderData<typeof loader>();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {NavbarManu.map((menu) => (
          <Collapsible
            key={menu.title}
            asChild
            className={cn(
              "group/collapsible",
              location.pathname.startsWith(menu.url || "#")
                ? "text-green-500"
                : "hover:text-gray-700"
            )}
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                {menu.title === "Areas" ? (
                  <Link to={menu.url}>
                    <SidebarMenuButton tooltip={menu.title}>
                      {menu.icon && <menu.icon />}
                      <span>{menu.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </Link>
                ) : (
                  <Link
                    to={menu.url || "#"}
                    // hidden={
                    //   role == "manager" && menu.title == "User" ? true : false
                    // }
                  >
                    <SidebarMenuButton tooltip={menu.title}>
                      <menu.icon />
                      {menu.title}
                    </SidebarMenuButton>
                  </Link>
                )}
              </CollapsibleTrigger>
              {menu.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {menu.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link to={subItem.url || "#"}>
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
