"use client";

import { useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
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
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  const [state, setState] = useState(false);

  const menus = [
    { title: Menu.SIGN_UP, path: "/sign-up" },
    { title: Menu.BLOG, path: "/blog" },
    { title: Menu.CALENDAR, path: "/calendar" },
    { title: Menu.ABOUT_US, path: "/about-us" },
    { title: Menu.SIGN_IN, path: "/sign-in" },
  ];
  return (
    <nav className="bg-white w-full border-b md:border-0">
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
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li key={idx} className="text-gray-600 hover:text-indigo-600">
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
