/*
  This file is adapted from next-themes to work with tanstack start. 
  next-themes can be found at https://github.com/pacocoursey/next-themes under the MIT license.
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemeScript: (...args: any[]) => void = (
  attribute,
  storageKey,
  defaultTheme,
  forcedTheme,
  themes,
  value,
  enableSystem,
  enableColorScheme,
) => {
  const el = document.documentElement;
  const systemThemes = ['light', 'dark'];
  const isClass = attribute === 'class';
  const classes =
    isClass && value
      ? themes.map((t: string | number) => value[t] || t)
      : themes;

  function updateDOM(theme: string) {
    if (isClass) {
      el.classList.remove(...classes);
      el.classList.add(theme);
    } else {
      el.setAttribute(attribute, theme);
    }

    setColorScheme(theme);
  }

  function setColorScheme(theme: string) {
    if (enableColorScheme && systemThemes.includes(theme)) {
      el.style.colorScheme = theme;
    }
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  if (forcedTheme) {
    updateDOM(forcedTheme);
  } else {
    try {
      const themeName = localStorage.getItem(storageKey) || defaultTheme;
      const isSystem = enableSystem && themeName === 'system';
      const theme = isSystem ? getSystemTheme() : themeName;
      updateDOM(theme);
    } catch (e) {
      //
    }
  }
};

export default ThemeScript;
