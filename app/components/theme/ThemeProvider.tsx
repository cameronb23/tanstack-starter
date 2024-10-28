'use client';

/*
  This file is adapted from next-themes to work with tanstack start. 
  next-themes can be found at https://github.com/pacocoursey/next-themes under the MIT license.
*/

import * as React from 'react';
import { default as ThemeScriptContent } from './ThemeScript';

interface ValueObject {
  [themeName: string]: string;
}

export interface UseThemeProps {
  /** List of all available theme names */
  themes: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Update the theme */
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  /** Active theme name */
  theme?: string | undefined;
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme?: string | undefined;
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: 'dark' | 'light' | undefined;
}

export type Attribute = `data-${string}` | 'class';

export interface ThemeProviderProps extends React.PropsWithChildren {
  /** List of all available theme names */
  themes?: string[] | undefined;
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean | undefined;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean | undefined;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean | undefined;
  /** Key used to store theme setting in localStorage */
  storageKey?: string | undefined;
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: string | undefined;
  /** HTML attribute modified based on the active theme. Accepts `class`, `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.), or an array which could include both */
  attribute?: Attribute | Attribute[] | undefined;
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject | undefined;
  /** Nonce string to pass to the inline script for CSP headers */
  nonce?: string | undefined;
}

const colorSchemes = ['light', 'dark'];
const MEDIA = '(prefers-color-scheme: dark)';
const isServer = typeof window === 'undefined';
const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);
const defaultContext: UseThemeProps = { setTheme: () => {}, themes: [] };

export const useTheme = () => React.useContext(ThemeContext) ?? defaultContext;

export const ThemeProvider = (props: ThemeProviderProps): React.ReactNode => {
  const context = React.useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return props.children;
  return <Theme {...props} />;
};

const defaultThemes = ['light', 'dark'];

const Theme = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = defaultThemes,
  defaultTheme = enableSystem ? 'system' : 'light',
  attribute = 'data-theme',
  value,
  children,
  nonce,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = React.useState(() =>
    getTheme(storageKey, defaultTheme),
  );
  const [resolvedTheme, setResolvedTheme] = React.useState(() =>
    getTheme(storageKey),
  );
  const attrs = !value ? themes : Object.values(value);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const applyTheme = React.useCallback((theme: string | undefined) => {
    let resolved = theme;
    if (!resolved) return;

    // If theme is system, resolve it before setting theme
    if (theme === 'system' && enableSystem) {
      resolved = getSystemTheme();
    }

    const name = value ? value[resolved] : resolved;
    const enable = disableTransitionOnChange ? disableAnimation() : null;
    const d = document.documentElement;

    const handleAttribute = (attr: Attribute) => {
      if (attr === 'class') {
        d.classList.remove(...attrs);
        if (name) d.classList.add(name);
      } else if (attr.startsWith('data-')) {
        if (name) {
          d.setAttribute(attr, name);
        } else {
          d.removeAttribute(attr);
        }
      }
    };

    if (Array.isArray(attribute)) attribute.forEach(handleAttribute);
    else handleAttribute(attribute);

    if (enableColorScheme) {
      const fallback = colorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;
      const colorScheme = colorSchemes.includes(resolved) ? resolved : fallback;
      d.style.colorScheme = colorScheme ?? 'dark';
    }

    enable?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: any) => {
      const newTheme = typeof value === 'function' ? value(theme) : value;
      setThemeState(newTheme);

      // Save to storage
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        // Unsupported
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme],
  );

  const [, startTransition] = React.useTransition();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleMediaQuery = React.useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      startTransition(() => {
        setResolvedTheme(resolved);
      });

      if (theme === 'system' && enableSystem && !forcedTheme) {
        applyTheme('system');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, forcedTheme],
  );

  // Always listen to System preference
  React.useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = e.newValue || defaultTheme;
      setTheme(theme);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTheme]);

  // Whenever theme or forcedTheme changes, apply it
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    applyTheme(forcedTheme ?? theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcedTheme, theme]);

  const providerValue = React.useMemo(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === 'system' ? resolvedTheme : theme,
      themes: enableSystem ? [...themes, 'system'] : themes,
      systemTheme: (enableSystem ? resolvedTheme : undefined) as
        | 'light'
        | 'dark'
        | undefined,
    }),
    [theme, setTheme, forcedTheme, resolvedTheme, enableSystem, themes],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScript
        {...{
          forcedTheme,
          storageKey,
          attribute,
          enableSystem,
          enableColorScheme,
          defaultTheme,
          value,
          themes,
          nonce,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeScript = React.memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    themes,
    nonce,
  }: Omit<ThemeProviderProps, 'children'> & { defaultTheme: string }) => {
    const scriptArgs = JSON.stringify([
      attribute,
      storageKey,
      defaultTheme,
      forcedTheme,
      themes,
      value,
      enableSystem,
      enableColorScheme,
    ]).slice(1, -1);

    return (
      <script
        suppressHydrationWarning
        nonce={typeof window === 'undefined' ? nonce : ''}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed to inject script before hydration
        dangerouslySetInnerHTML={{
          __html: `(${ThemeScriptContent.toString()})(${scriptArgs})`,
        }}
      />
      // <></>
    );
  },
);

ThemeScript.displayName = 'ThemeScript';

// Helpers
const getTheme = (key: string, fallback?: string) => {
  if (isServer) return undefined;
  let theme: string | undefined;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch (e) {
    // Unsupported
  }
  return theme || fallback;
};

const disableAnimation = () => {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}',
    ),
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  const event = e ?? window.matchMedia(MEDIA);
  const isDark = event.matches;
  const systemTheme = isDark ? 'dark' : 'light';
  return systemTheme;
};
