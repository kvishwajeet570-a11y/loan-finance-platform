import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.indialoanfinance.app",
  appName: "India Loan Finance",

  server: {
    url: "https://loan-finance-platform.vercel.app",
    cleartext: true,
  },
};

export default config;