import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-white/80">
        You are not signed in.
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-white text-2xl font-semibold mb-4">Profile</h2>
        <div className="grid grid-cols-1 gap-2 text-white/90">
          <div>
            <span className="text-white/60">User ID: </span>
            {user.id}
          </div>
          <div>
            <span className="text-white/60">Email: </span>
            {user.email}
          </div>
        </div>
      </div>
    </div>
  );
}
