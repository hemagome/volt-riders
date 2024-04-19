import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { locales } from "./navigation";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "es",
});

const isProtectedRoute = createRouteMatcher([
  "/:locale/benefits",
  "/:locale/blog(.*)",
  "/:locale/calendar",
]);

export default clerkMiddleware(
  (auth, req) => {
    if (isProtectedRoute(req)) auth().protect();
    return intlMiddleware(req);
  },
  { debug: true },
);

export const config = {
  matcher: ["/", "/(es|en)/:path*"],
  //matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
