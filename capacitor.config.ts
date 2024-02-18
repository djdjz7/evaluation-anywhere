import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'evaluation.anywhere',
  appName: 'evaluation-anywhere',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
