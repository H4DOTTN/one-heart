export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "OneHeart",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Funds",
      href: "/funds",
    },
  ],
  links: {
    auth: {
      root: "/auth",
      login: "/auth/login",
      register: "/auth/register",
    },
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
