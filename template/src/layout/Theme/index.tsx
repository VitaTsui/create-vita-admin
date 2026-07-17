import React, { useEffect, useMemo } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { lightTokens, darkTokens } from "@hsu-react/ui";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import styles from "./index.module.scss";
import ThemeStore from "./ThemeStore";

interface ThemeProps {
  children?: React.ReactNode;
}

const Theme: React.FC<ThemeProps> = observer((props) => {
  const { children } = props;
  const { isDark, primaryColor } = ThemeStore;

  // The single source of truth for design tokens is @hsu-react/ui (the CSS variable version comes from es/styles/tokens.scss,
  // auto-switching with html[data-theme]; the TS constants here are only consumed by the antd themeConfig)
  const p = isDark ? darkTokens : lightTokens;

  // In dark mode, dim the teal to reduce glare (light mode keeps the brand color)
  const accent = isDark ? "#1C9C9C" : primaryColor;

  // Primary color hex -> rgba, used for menu highlighting
  const hexToRgba = (hex: string, alpha: number) => {
    const m = hex.replace("#", "");
    if (m.length < 6) return hex;
    const r = parseInt(m.substring(0, 2), 16);
    const g = parseInt(m.substring(2, 4), 16);
    const b = parseInt(m.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Dark nav: neutral black (gradient endpoints + middle tone as token fallback)
  const DARK_TOP = "#1F1F1F";
  const DARK_BOTTOM = "#141414";

  const headerBg = p.headerBg;
  const siderBg = p.surface;

  // Appearance switch: set html[data-theme]; the token CSS variables (tokens.scss) switch as a whole set accordingly;
  // only the primary color is still applied at runtime (users can change it in appearance settings).
  // Older versions set each --cf-* inline on html; clear them here to avoid leftovers overriding stylesheet values.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = isDark ? "dark" : "light";
    root.style.setProperty("--primary-color", accent);
    [
      "--cf-canvas",
      "--cf-surface",
      "--cf-subtle",
      "--cf-border",
      "--cf-border-weak",
      "--cf-text",
      "--cf-text-2",
      "--cf-text-3",
    ].forEach((k) => root.style.removeProperty(k));
  }, [accent, isDark]);

  const themeConfig = useMemo(
    () => ({
      algorithm: isDark
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: accent,
        // Cloudflare look: borders instead of shadows, unified medium border radius
        borderRadius: 8,
        borderRadiusLG: 8,
        borderRadiusSM: 6,
        // Cool light-gray canvas + light borders (switches with appearance)
        colorBgLayout: p.canvas,
        colorBorder: p.border,
        colorBorderSecondary: p.borderWeak,
      },
      components: {
        Layout: {
          headerBg,
          siderBg,
        },
        // Squared-off, compact controls
        Button: {
          controlHeight: 34,
          borderRadius: 6,
          primaryShadow: "none",
          defaultShadow: "none",
          fontWeight: 500,
        },
        Input: { borderRadius: 6 },
        Select: { borderRadius: 6 },
        // Light table header, thin dividers, row hover
        Table: {
          headerBg: p.subtle,
          headerColor: p.text2,
          headerSplitColor: "transparent",
          borderColor: p.borderWeak,
          rowHoverBg: p.rowHover,
          cellPaddingBlock: 12,
          headerBorderRadius: 8,
        },
        Card: {
          borderRadiusLG: 8,
        },
        Menu: {
          // Transparent background to reveal the nav gradient; selected state is a rounded pill
          darkItemBg: "transparent",
          darkSubMenuItemBg: "transparent",
          darkPopupBg: p.surface,
          darkItemColor: "rgba(255, 255, 255, 0.82)",
          darkItemHoverColor: "#ffffff",
          darkItemHoverBg: "rgba(255, 255, 255, 0.14)",
          darkItemSelectedBg: hexToRgba(accent, 0.16),
          darkItemSelectedColor: accent,
          // Light-mode sidebar: compact rows + light aqua highlight; the left highlight bar is overlaid via CSS
          itemSelectedBg: hexToRgba(accent, 0.12),
          itemSelectedColor: accent,
          itemActiveBg: hexToRgba(accent, 0.12),
          itemHoverBg: isDark
            ? "rgba(255, 255, 255, 0.06)"
            : "rgba(0, 0, 0, 0.04)",
          itemColor: p.text,
          itemBorderRadius: 6,
          itemMarginInline: 8,
          itemMarginBlock: 2,
          itemHeight: 38,
          horizontalItemHoverBg: "#0000000a",
        },
      },
    }),
    [isDark, accent, p, headerBg, siderBg]
  );

  return (
    <ConfigProvider wave={{ disabled: true }} theme={themeConfig}>
      <div
        className={classNames(styles.theme, isDark ? "dark" : "light")}
        style={
          {
            "--primary-color": accent,
            "--nav-dark-top": DARK_TOP,
            "--nav-dark-bottom": DARK_BOTTOM,
            // Built-in palette (uniformly referenced by content-area styles)
            "--cf-canvas": p.canvas,
            "--cf-surface": p.surface,
            "--cf-subtle": p.subtle,
            "--cf-border": p.border,
            "--cf-border-weak": p.borderWeak,
            "--cf-text": p.text,
            "--cf-text-2": p.text2,
            "--cf-text-3": p.text3,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ConfigProvider>
  );
});

export default Theme;
