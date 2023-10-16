"use client";

import { useState } from "react";
import { HamburgerMenuIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Menu } from "@/lib/constants";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  const [state, setState] = useState(false);
  const { setTheme } = useTheme()

  const menus = [
    { title: Menu.SIGN_UP, path: "/sign-up" },
    { title: Menu.BLOG, path: "/blog" },
    { title: Menu.CALENDAR, path: "/calendar" },
    { title: Menu.ABOUT_US, path: "/about-us" },
    { title: Menu.SIGN_IN, path: "/sign-in" },
  ];
  return (
    <nav className="w-full border-b ">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <Image
              src="/VoltRiders.webp"
              alt="Logo VoltRiders"
              width={100}
              height={24}
            />
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              {" "}
              <HamburgerMenuIcon />
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? "block" : "hidden"
            }`}
        >
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li key={idx} className="hover:text-gray-600 dark:hover:text-yellow-500">
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <a href="https://www.instagram.com/voltriderscol/" target="_blank">
            <Button variant="outline" size="icon">
              {" "}
              <InstagramLogoIcon className="h-[1.2rem] w-[1.2rem]"/>
            </Button>
          </a>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Cambiar tema</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Luz
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Oscuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div><UserButton afterSignOutUrl="/" /></div>
      </div>
    </nav>
  );
}
