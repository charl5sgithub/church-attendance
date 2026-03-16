import { useEffect, useState } from "react";
import { api } from "../services/api";

interface Member {
  id: number;
  name: string;
  type: string;
  family?: string;
}

type Status = "present" | "absent" | "";

export function AttendancePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [statuses, setStatuses] = useState<Record<number, Status>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadExistingAttendance(targetDate: string, membersList: Member[]) {
    try {
      const res = await api.get("/attendance", {
        params: { date: targetDate }
      });
      const records: any[] = res.data;
      const map: Record<number, Status> = {};
      
      // Default to "present" for all loaded members
      membersList.forEach((m) => {
        map[m.id] = "present";
      });

      // Override with previously saved records
      records.forEach((r) => {
        map[r.memberId] = r.status === "PRESENT" ? "present" : "absent";
      });
      setStatuses(map);
    } catch {
      // If error occurs fetching records, default all to present
      const map: Record<number, Status> = {};
      membersList.forEach((m) => {
        map[m.id] = "present";
      });
      setStatuses(map);
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const res = await api.get<Member[]>("/members");
        setMembers(res.data);
        await loadExistingAttendance(date, res.data);
      } catch {
        // Handle gracefully
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (members.length > 0) {
      loadExistingAttendance(date, members);
    }
  }, [date]);

  async function saveAttendance() {
    setLoading(true);
    setMessage(null);
    try {
      const entries = Object.entries(statuses).filter(
        ([, value]) => value !== ""
      ) as [string, Exclude<Status, "">][];

      await Promise.all(
        entries.map(([memberId, status]) =>
          api.post("/attendance", {
            memberId: Number(memberId),
            date,
            status
          })
        )
      );
      setMessage("Attendance saved.");
    } catch {
      setMessage("Failed to save attendance.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">Attendance</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
      </div>
      {message && (
        <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
          {message}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm divide-y">
        {members.map((m, index) => {
          const status = statuses[m.id] ?? "present";
          return (
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
                    {m.family || "No family"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setStatuses((prev) => ({
                      ...prev,
                      [m.id]: status === "present" ? "absent" : "present"
                    }))
                  }
                  className={`relative flex items-center w-24 h-8 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 hover:scale-110 hover:shadow-md ${
                    status === "present" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  <span
                    className={`absolute text-[11px] font-bold text-white pointer-events-none transition-all duration-300 ${
                      status === "present" ? "left-3" : "right-3"
                    }`}
                  >
                    {status === "present" ? "PRESENT" : "ABSENT"}
                  </span>
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 z-10 ${
                      status === "present" ? "translate-x-16" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
        {members.length === 0 && (
          <p className="px-3 py-4 text-xs text-slate-500">
            No members found. Add members first.
          </p>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-50">
        <button
          onClick={saveAttendance}
          disabled={loading}
          className="w-full max-w-lg mx-auto block bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 transition-all duration-200"
        >
          {loading ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </div>
  );
}

