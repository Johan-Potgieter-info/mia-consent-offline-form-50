
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aba393644b3f416b89f3910ca3b93712',
  appName: 'Mia',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://aba39364-4b3f-416b-89f3-910ca3b93712.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ef4805",
      showSpinner: false
    }
  }
};

export default config;
