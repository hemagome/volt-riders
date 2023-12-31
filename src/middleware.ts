import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about-us",
    "/api/document",
    "/api/edgestore/init",
    "/api/edgestore/request-upload",
    "/api/eps",
    "/api/vehicle/brand",
    "/api/vehicle/type",
    "/sign-up",
    "/weather",
  ],
  debug: true,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
