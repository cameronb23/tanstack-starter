import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supportedLocales } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { LucideLanguages } from 'lucide-react';

const LocaleToggle: FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <LucideLanguages className="size-4 mr-2" /> Language
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {supportedLocales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => i18n.changeLanguage(locale)}
          >
            {t(`language.${locale}`, { defaultValue: locale })}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleToggle;
