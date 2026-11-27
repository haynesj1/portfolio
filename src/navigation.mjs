// The one list of navigation items. An item whose page does not exist yet is left out,
// so the site never shows a dead link. Paths are matched against files under src/pages.
export const NAV_ITEMS = [
  { label: 'Projects', href: '/#projects', page: '/' },
  { label: 'How this was built', href: '/projects/development-system/', page: '/projects/development-system/' },
  { label: 'About', href: '/about/', page: '/about/' },
  { label: 'Contact', href: '/contact/', page: '/contact/' },
];

// Turns source page paths (e.g. /src/pages/about.astro, /src/pages/about/index.mdx) into routes.
export function routesFromFiles(files) {
  return new Set(
    files.map((f) => {
      const r = f.replace(/^.*\/src\/pages/, '').replace(/\.(astro|mdx|md)$/, '').replace(/\/index$/, '');
      return r === '' ? '/' : `${r}/`;
    }),
  );
}

export function visibleItems(items, routes) {
  return items.filter((i) => routes.has(i.page));
}
