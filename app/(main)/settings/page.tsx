import type { Metadata } from "next";
import { SettingsView } from "@/components/main/settings-view";

export const metadata: Metadata = {
  title: "Settings — Rakko Office",
  description:
    "Customize your Rakko Office experience: change editor theme and language.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SettingsPage() {
  return <SettingsView />;
}
