import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tempo(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "dicebear-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "unsplash-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      includeAssets: ["yacin-gym-logo.png", "success-sound.mp3"],
      manifest: {
        name: "Amino Gym - نظام إدارة الصالة الرياضية",
        short_name: "Amino Gym",
        description:
          "نظام إدارة شامل للصالة الرياضية مع إدارة الأعضاء والمدفوعات",
        theme_color: "#1e293b",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "ar",
        dir: "rtl",
        icons: [
          {
            src: "yacin-gym-logo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "yacin-gym-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        categories: ["fitness", "health", "business", "productivity"],
        shortcuts: [
          {
            name: "الأعضاء",
            short_name: "الأعضاء",
            description: "إدارة أعضاء الصالة الرياضية",
            url: "/home?tab=attendance",
            icons: [{ src: "yacin-gym-logo.png", sizes: "96x96" }],
          },
          {
            name: "المدفوعات",
            short_name: "المدفوعات",
            description: "إدارة المدفوعات والاشتراكات",
            url: "/home?tab=payments",
            icons: [{ src: "yacin-gym-logo.png", sizes: "96x96" }],
          },
          {
            name: "حضور اليوم",
            short_name: "الحضور",
            description: "عرض حضور اليوم",
            url: "/home?tab=today-attendance",
            icons: [{ src: "yacin-gym-logo.png", sizes: "96x96" }],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
});
