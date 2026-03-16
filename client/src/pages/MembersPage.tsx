import { type FormEvent, useEffect, useState } from "react";
import { api } from "../services/api";

interface Member {
  id: number;
  name: string;
  type: string;
  dob?: string;
  phone?: string;
  email?: string;
  family?: string;
  joinDate: string;
}

const emptyForm: Omit<Member, "id"> = {
  name: "",
  type: "Member",
  dob: "",
  phone: "",
  email: "",
  family: "",
  joinDate: new Date().toISOString().slice(0, 10)
};

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState<Omit<Member, "id">>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMembers() {
    try {
      const res = await api.get<Member[]>("/members");
      setMembers(res.data);
    } catch {
      setError("Failed to load members");
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(member: Member) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      type: member.type || "Member",
      dob: member.dob ? member.dob.slice(0, 10) : "",
      phone: member.phone ?? "",
      email: member.email ?? "",
      family: member.family ?? "",
      joinDate: member.joinDate.slice(0, 10)
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!form.name || !form.joinDate) {
        setError("Name and Join Date are required");
        return;
      }
      if (editingId) {
        await api.put(`/members/${editingId}`, form);
      } else {
        await api.post("/members", form);
      }
      await loadMembers();
      setForm(emptyForm);
      setEditingId(null);
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to save member";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this member?")) return;
    try {
      await api.delete(`/members/${id}`);
      await loadMembers();
    } catch {
      setError("Failed to delete member");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">Members</h1>
        <button
          onClick={startAdd}
          className="px-3 py-2 rounded-full bg-indigo-600 text-white text-xs font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        >
          Add Member
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-3 space-y-2"
      >
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-600">
              Full Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Member name"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-600">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Member">Member</option>
                <option value="Visitor">Visitor</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-600">
                Date of Birth
              </label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-600">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-600">
                Email
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-600">
                Family Name
              </label>
              <input
                value={form.family}
                onChange={(e) => setForm({ ...form, family: e.target.value })}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-600">
                Join Date
              </label>
              <input
                type="date"
                value={form.joinDate}
                onChange={(e) =>
                  setForm({ ...form, joinDate: e.target.value })
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] active:shadow-sm disabled:opacity-60 transition-all duration-200"
        >
          {editingId ? "Update Member" : "Save Member"}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {members.map((m, index) => (
          <div
            key={m.id}
            className="flex items-center justify-between px-3 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-400 w-5 text-center">
                {index + 1}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    {m.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      m.type === "Visitor"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {m.type || "Member"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  {m.family || "No family"} • Joined{" "}
                  {new Date(m.joinDate).toLocaleDateString()}
                  {m.dob && ` • DOB: ${new Date(m.dob).toLocaleDateString()}`}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(m)}
                className="px-2 py-1 rounded-full border border-slate-200 text-[11px] hover:bg-slate-100 hover:border-slate-300 active:scale-95 transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="px-2 py-1 rounded-full border border-red-200 text-[11px] text-red-600 hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <p className="px-3 py-4 text-xs text-slate-500">
            No members yet. Use the form above to add your first member.
          </p>
        )}
      </div>
    </div>
  );
}

