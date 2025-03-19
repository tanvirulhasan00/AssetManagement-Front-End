import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import type { LinksFunction } from "react-router";

import "./tailwind.css";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./components/ui/toaster";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function App() {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                let theme = localStorage.getItem("theme") || "system";
                let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                let isDark = theme === "dark" || (theme === "system" && prefersDark);
                if (isDark) document.documentElement.classList.add("dark");
                else document.documentElement.classList.remove("dark");
              })();
            `,
          }}
        />
        <Links />
        <title>Assset Management</title>
      </head>
      <body>
        <Outlet />
        <Toaster position="top-right" />
        <ScrollRestoration />
        <Scripts />
        {/* <LiveReload /> */}
      </body>
    </html>
  );
}

// `themeAction` is the action name that's used to change the theme in the session storage.
export default function AppWithProviders() {
  // const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
        <div className="mx-6 mt-4">
          <a
            href="/"
            className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
