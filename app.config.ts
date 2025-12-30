import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "YaSale",
  slug: "yasale",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yasale.app",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.yasale.app",
  },
  web: {
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    API_URL: process.env.API_URL || "http://localhost:3000/api",
    SOCKET_URL: process.env.SOCKET_URL || "http://localhost:3000",
    DEFAULT_LANGUAGE: "es",
  },
});
