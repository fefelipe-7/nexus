import { Link } from 'react-router-dom';
import { MODULES } from '@/config/modules.config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nexus/ui';

export function Money() {
  const module = MODULES.MONEY;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{module.name}</h1>
        <p className="text-muted-foreground mt-2">{module.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {module.submodules.map((submodule) => {
          const Icon = submodule.icon || module.icon;
          return (
            <Link key={submodule.id} to={submodule.path}>
              <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${module.color}-500/10`}>
                      <Icon className={`h-5 w-5 text-${module.color}-500`} />
                    </div>
                    <CardTitle className="text-lg">{submodule.name}</CardTitle>
                  </div>
                </CardHeader>
                {submodule.description && (
                  <CardContent>
                    <CardDescription>{submodule.description}</CardDescription>
                  </CardContent>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
