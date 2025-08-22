"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { DashboardHeader } from "@/components/DashboardHeader";
import { BACKEND_URL } from "@/lib/utils";
import { Clock } from "lucide-react";

type Tick = {
  status: string;
  response_time_ms: number;
  createdAt: string;
};

type Website = {
  id: string;
  url: string;
};

export default function WebsiteTicksPage() {
  const params = useParams();
  const websiteId = params?.websiteId as string;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [website, setWebsite] = useState<Website | null>(null);
  const [ticks, setTicks] = useState<Tick[]>([]);

  const [skip, setSkip] = useState(0); 
  const [hasMore, setHasMore] = useState(true);

  const didCheckAuth = useRef(false);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/validate`, { withCredentials: true });
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  };

  const fetchTicks = async (append = false) => {//default to false append
    if (!websiteId) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/status/${websiteId}`,
        { skip },
        { withCredentials: true }
      );
      const w = res.data.website;
      if (!w) return;

      if (!append) setWebsite({ id: w.id, url: w.url });

      const newTicks: Tick[] = w.ticks;
      if (newTicks.length < 10) setHasMore(false);
      setTicks((prev) => (append ? [...prev, ...newTicks] : newTicks));
      setSkip((prev) => prev + newTicks.length);
    } catch (err) {
      console.error("Error fetching ticks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didCheckAuth.current) return;
    didCheckAuth.current = true;
    checkAuth();
  }, []);

  useEffect(() => {
    if (!authChecked || !isAuthenticated) return;
    fetchTicks(false);
  }, [authChecked, isAuthenticated, websiteId]);

  if (!authChecked) {
    return (
      <div>
        <DashboardHeader isAuthenticated={isAuthenticated} />
        <div className="h-screen w-screen bg-black text-white p-6">
          Checking authentication...
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div>
        <DashboardHeader isAuthenticated={isAuthenticated} />
        <div className="h-screen w-screen bg-black text-white p-6">
          Not signed in. Please sign in first.
        </div>
      </div>
    );
  }

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader isAuthenticated={isAuthenticated} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white">
          Recent Checks for
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent ml-2">
            {website?.url || "..."}
          </span>
        </h1>
        <p className="text-gray-400 mt-2">
          Latest uptime and response time logs (10 per page)
        </p>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Status History</h2>
          </div>

          {ticks.length === 0 && !loading ? (
            <div className="p-12 text-center text-gray-400">No checks yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-300 text-sm uppercase tracking-wider">
                      Checked At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {ticks.map((tick, idx) => (
                    <tr
                      key={tick.createdAt + idx}
                      className={`hover:bg-gray-800/50 transition-colors ${
                        idx % 2 === 0 ? "bg-gray-900/50" : "bg-transparent"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border 
                            ${
                              tick.status === "Up"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              tick.status === "Up" ? "bg-green-400" : "bg-red-400"
                            }`}
                          ></div>
                          {tick.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {tick.response_time_ms}ms
                      </td>
                      <td className="py-4 px-6 text-gray-400 flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(tick.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              disabled={loading}
              onClick={() => fetchTicks(true)}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
