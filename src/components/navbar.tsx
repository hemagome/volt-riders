"use client";

import { useState } from "react";
import { FacebookIcon, InstagramIcon, MenuIcon, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { Link } from "../i18n/routing";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LocaleSwitcher from "./LocaleSwitcher";

export function Navbar() {
  const [state, setState] = useState(false);
  const { setTheme } = useTheme();
  const { isSignedIn } = useUser();
  const t = useTranslations("Navbar");
  const menus = [
    !isSignedIn
      ? { title: t("signUp"), path: `/sign-up` }
      : { title: "", path: "" },
    !isSignedIn
      ? { title: t("signIn"), path: "/sign-in" }
      : { title: "", path: "" },
    { title: t("aboutUs"), path: "/about-us" },
    { title: t("weatherMap"), path: "/weather" },
    isSignedIn ? { title: t("blog"), path: "/blog" } : { title: "", path: "" },
    isSignedIn
      ? { title: t("calendar"), path: "/calendar" }
      : { title: "", path: "" },
    isSignedIn
      ? { title: t("benefits"), path: "/benefits" }
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
              width={60}
              height={0}
              className="w-full h-auto"
            />
          </Link>
          {
            //Sección móvil
          }
          <div className="md:hidden flex items-center">
            <Button variant="outline" size="icon">
              <LocaleSwitcher />
            </Button>
            <a href="https://www.instagram.com/voltriderscol/" target="_blank">
              <Button variant="outline" size="icon">
                {" "}
                <InstagramIcon className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </a>
            <a
              href="https://m.facebook.com/groups/739020861211134/?ref=share&mibextid=S66gvF"
              target="_blank"
            >
              <Button variant="outline" size="icon">
                {" "}
                <FacebookIcon className="h-[1.2rem] w-[1.2rem]" />
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
                  {t("light")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  {t("dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  {t("system")}
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
              <MenuIcon />
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
        {
          // Sección PC
        }
        <div className="hidden md:block">
          <Button variant="outline" size="icon">
            <LocaleSwitcher />
          </Button>
          <a href="https://www.instagram.com/voltriderscol/" target="_blank">
            <Button variant="outline" size="icon">
              {" "}
              <InstagramIcon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </a>
          <a
            href="https://www.facebook.com/groups/739020861211134"
            target="_blank"
          >
            <Button variant="outline" size="icon">
              {" "}
              <FacebookIcon className="h-[1.2rem] w-[1.2rem]" />
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
                {t("light")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                {t("dark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                {t("system")}
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
