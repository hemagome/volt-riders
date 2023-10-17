"use client";

import { useState } from "react";
import { HamburgerMenuIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Menu, Label } from "@/lib/constants";
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
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  const [state, setState] = useState(false);
  const { setTheme } = useTheme();
  const { isSignedIn } = useUser();

  const menus = [
    !isSignedIn
      ? { title: Menu.SIGN_UP, path: "/sign-up" }
      : { title: "", path: "" },
    !isSignedIn
      ? { title: Menu.SIGN_IN, path: "/sign-in" }
      : { title: "", path: "" },
    { title: Menu.BLOG, path: "/blog" },
    { title: Menu.ABOUT_US, path: "/about-us" },
    isSignedIn
      ? { title: Menu.CALENDAR, path: "/calendar" }
      : { title: "", path: "" },
    isSignedIn
      ? { title: Menu.BENEFITS, path: "/benefits" }
      : { title: "", path: "" },
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
              priority
            />
          </Link>
          <div className="md:hidden flex items-center">
            <a href="https://www.instagram.com/voltriderscol/" target="_blank">
              <Button variant="outline" size="icon">
                {" "}
                <InstagramLogoIcon className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </a>
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
                  {Label.LIGHT}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  {Label.DARK}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  {Label.SYSTEM}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="icon"
              className="text-gray-700 outline-none p-2 rounded-md"
              onClick={() => setState(!state)}
            >
              {" "}
              <HamburgerMenuIcon />
            </Button>
            <Button variant="link" size="icon">
              <UserButton afterSignOutUrl="/" />
            </Button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li
                key={idx}
                className="hover:text-gray-600 dark:hover:text-yellow-500"
              >
                <Link href={item.path} onClick={() => setState(!state)}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:block">
          <a href="https://www.instagram.com/voltriderscol/" target="_blank">
            <Button variant="outline" size="icon">
              {" "}
              <InstagramLogoIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>
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
                {Label.LIGHT}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                {Label.DARK}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                {Label.SYSTEM}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="link" size="icon">
            <UserButton afterSignOutUrl="/" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
