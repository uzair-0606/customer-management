import Sidebar from "@/components/layout/sidebar";
import SettingsPanel from "@/components/settings/settingspanel";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <main className="ml-64 p-8">

        <header className="mb-8">

          <p className="text-sm font-medium text-blue-600">
            Super Admin
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your account and system preferences.
          </p>

        </header>

        <SettingsPanel />

      </main>

    </div>
  );
}