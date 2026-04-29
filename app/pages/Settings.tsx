import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();

    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDarkMode(true);
  }, []);

  // 🔥 apply dark mode globally
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setEmail(user.email || "");

      const { data } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();

      if (data) setName(data.name);
    }

    setLoading(false);
  }

  async function handleSave() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("users").update({ name }).eq("id", user.id);

    alert("Saved!");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 text-black dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white transition-colors duration-300">
      {/* ✅ FIXED: pt-10 instead of mt-10 */}
      <div className="max-w-2xl mx-auto px-6 pt-10">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* ACCOUNT */}
        <div className="border rounded-xl p-6 mb-6 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-4">Account</h2>

          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-md bg-white dark:bg-neutral-700 dark:text-white dark:border-neutral-600"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              disabled
              className="w-full border px-3 py-2 rounded-md bg-gray-100 dark:bg-neutral-700 dark:text-gray-300 dark:border-neutral-600"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80 dark:bg-white dark:text-black"
          >
            Save Changes
          </button>
        </div>

        {/* APPEARANCE */}
        <div className="border rounded-xl p-6 mb-6 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            Dark Mode
          </label>
        </div>

        {/* SECURITY */}
        <div className="border rounded-xl p-6 bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-4">Security</h2>

          <button
            onClick={handleLogout}
            className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}