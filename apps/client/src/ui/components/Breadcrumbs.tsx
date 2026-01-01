import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { MODULES } from '@/config/modules.config';

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbs: Array<{ name: string; path: string; isLast: boolean }> = [];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    let name = segment;
    
    if (index === 0) {
      const module = Object.values(MODULES).find(m => m.path === currentPath);
      if (module) {
        name = module.name;
      }
    } else if (index === 1) {
      const parentPath = `/${pathSegments[0]}`;
      const module = Object.values(MODULES).find(m => m.path === parentPath);
      if (module) {
        const submodule = module.submodules.find(s => s.path === currentPath);
        if (submodule) {
          name = submodule.name;
        }
      }
    }

    breadcrumbs.push({ name, path: currentPath, isLast });
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link
        to="/"
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.name}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-foreground transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
