"use client"
import React, { useState , useEffect} from 'react';
import { Plus } from 'lucide-react';
import { WebsiteTable } from '../../components/WebsiteTable';
import { AddWebsiteModal } from '../../components/AddWebsiteModal';
import { Website } from '../../lib/types';
import axios from 'axios';
import { DashboardHeader } from '@/components/DashboardHeader';
import { BACKEND_URL } from '@/lib/utils';

type WebsiteFromAPI = {
  id: string;
  url: string;
  ticks: {
    status: string;
    response_time_ms: number;
    createdAt: string;
  }[];
};

export default function Dashboard() 
{
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  const [authChecked,setAuthChecked]=useState(false);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const didCheckAuth = React.useRef(false);

  // Helper to convert API data to frontend Website[]
  const mapWebsites = (data: WebsiteFromAPI[]): Website[] =>
    data.map((w) => ({
      id: w.id,
      url: w.url,
      status: w.ticks[0]?.status || "Unknown",
      responseTime: w.ticks[0]?.response_time_ms || 0,
      lastChecked: w.ticks[0] ? new Date(w.ticks[0].createdAt) : new Date()
    }));

  useEffect(() => {
    if (didCheckAuth.current) return;//reduce multiple auth calls
    didCheckAuth.current = true;
    const checkAuth = async () => {
      try {
        await axios.get(`${BACKEND_URL}/auth/validate`, { withCredentials: true });
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();

  }, []);
  useEffect(()=>{
    if(!authChecked || !isAuthenticated)return;
    const fetchWebsite=async()=>{
      const res=await axios.get(`${BACKEND_URL}/websites`,{withCredentials:true});
      setWebsites(res.data.websites.map((w:WebsiteFromAPI)=>({
        id:w.id,
        url:w.url,
        status:(w.ticks[0])?w.ticks[0].status: "Unknown",
        responseTime:(w.ticks[0])?w.ticks[0].response_time_ms:0,
        lastChecked:(w.ticks[0])?w.ticks[0].createdAt:new Date(Date.now())
      })))
    }
    fetchWebsite();//once immediately

    const interval=setInterval(fetchWebsite,3*1000*60)
    return ()=>clearInterval(interval)
  },[authChecked, isAuthenticated])
  if (!authChecked) {
    return (
      <div>
        <DashboardHeader isAuthenticated={isAuthenticated}/>
        <div className="h-screen w-screen bg-black text-white p-6">Checking authentication...</div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
    <div>
      <DashboardHeader isAuthenticated={isAuthenticated}/>
      <div className="h-screen w-screen bg-black text-white p-6">Not signed in. Please sign in first.</div>
    </div>);
  }

  const addWebsite =async (website: Omit<Website, 'id' | 'status' | 'responseTime' | 'lastChecked'>) => 
  {
    const res=await axios.post(`${BACKEND_URL}/website`,{
      url:website.url
    },{withCredentials:true})

    const refreshed = await axios.get<{ websites: WebsiteFromAPI[] }>(
      `${BACKEND_URL}/websites`,
      { withCredentials: true }
    );
    setWebsites(mapWebsites(refreshed.data.websites));
    setIsModalOpen(false);
  };

  // Delete website TODO add be route
  const deleteWebsite = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/website/${id}`, { withCredentials: true });
    } catch {
      console.warn("Failed to delete from backend — removing locally only");
    }
    setWebsites(websites.filter(site => site.id !== id));
  };

  const upSites = websites.filter(site => site.status === 'Up').length;
  const downSites = websites.filter(site => site.status === 'Down').length;

  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader isAuthenticated={isAuthenticated} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5"></div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Website Monitor
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent ml-2">
                  Dashboard
                </span>
              </h1>
              <p className="text-gray-400 mt-2">
                Monitor your websites and track their uptime status
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-orange-400 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Website</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Websites</p>
                  <p className="text-3xl font-bold text-white">{websites.length}</p>
                </div>
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Sites Up</p>
                  <p className="text-3xl font-bold text-green-400">{upSites}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Sites Down</p>
                  <p className="text-3xl font-bold text-red-400">{downSites}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <WebsiteTable websites={websites} onDelete={deleteWebsite} />
        </div>

        <AddWebsiteModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addWebsite}
        />
      </div>
    </div>
  );
}