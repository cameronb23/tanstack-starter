import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import LocaleToggle from '@/components/LocaleToggle';
import { Button } from '@/components/ui/button';
import { useAuthQuery } from '@/services/auth';
import { createFileRoute, Link } from '@tanstack/react-router';

const HeroHeader: FC = () => {
  const { data: auth } = useAuthQuery();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-8 items-center mt-[8rem] z-10 h-[25vh] mb-12 md:-mb-4">
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-3">
          <Button asChild variant="link">
            <Link to="/auth/login">Sign in</Link>
          </Button>
          <LocaleToggle />
        </div>
        <div>{t('Home.title', `Welcome to TanStack starter!`)}</div>
        <div className="p-2 border bg-card rounded-md shadow-sm w-[512px]">
          <pre className="text-wrap">{JSON.stringify(auth, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

function Home() {
  return <HeroHeader />;
}

export const Route = createFileRoute('/')({
  component: Home,
});
