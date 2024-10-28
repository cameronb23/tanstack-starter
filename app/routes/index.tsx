import { Button } from '@/components/ui/button';
import { useAuthQuery } from '@/services/auth';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';

const HeroHeader: FC = () => {
  const { data: auth } = useAuthQuery();

  return (
    <div className="flex flex-col gap-y-8 items-center mt-[8rem] z-10 h-[25vh] mb-12 md:-mb-4">
      <div className="flex flex-col gap-y-4">
        <Button className="px-4">Welcome!</Button>
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
