import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";
import { locales } from "./navigation";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "es",
});

export default authMiddleware({
  beforeAuth(request) {
    return intlMiddleware(request);
  },
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      const locale = "es";
      req.nextUrl.pathname = `/${locale}/sign-in`;

      // Redirigir a la ruta deseada después de la autenticación
      return Response.redirect(req.nextUrl);
    }
  },

  publicRoutes: [
    "/",
    "/:locale",
    "/:locale/about-us",
    "/api/document",
    "/api/edgestore/(.*)",
    "/api/eps",
    "/api/vehicle(.*)",
    "/:locale/sign-up",
    "/:locale/sign-in",
    "/:locale/weather",
    "/:locale/test",
  ],
  //debug: true,
});

export const config = {
  matcher: ["/", "/(es|en)/:path*"],
  //matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
