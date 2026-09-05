import { listUsers } from "@/lib/store";

export default function AdminUsers() {
  const users = listUsers();
  return (
    <div>
      <h1 className="text-2xl font-black text-navy-950">Users</h1>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[560px] text-sm">
          <thead><tr className="text-left text-xs uppercase text-slate-500"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Roles</th><th className="p-3">City</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100"><td className="p-3 font-bold">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3 text-xs">{u.roles.join(", ")}</td><td className="p-3">{u.city ?? "—"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
