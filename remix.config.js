/** @type {import('@remix-run/dev').AppConfig} */
import { flatRoutes } from "remix-flat-routes";

export default {
  ignoredRouteFiles: ["**/.*"],
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes, {
      ignoredRouteFiles: [
        ".*",
        "**/*.css",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/__*.*",
      ],
    });
  },
};
