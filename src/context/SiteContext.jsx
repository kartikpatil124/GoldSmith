import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const SiteContext = createContext();

export function SiteProvider({ children }) {
  const [homepageConfig, setHomepageConfig] = useState(null);
  const [collections, setCollections] = useState([]);
  const [banners, setBanners] = useState([]);
  const [pageContent, setPageContent] = useState({}); // { pageKey: { sectionKey: { ... } } }
  const [loading, setLoading] = useState(true);

  const fetchHomepageConfig = async () => {
    try {
      const res = await api.get('/merchandising');
      if (res.success) {
        setHomepageConfig(res.data);
      }
    } catch (err) {
      console.error("Error fetching homepage config:", err);
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await api.get('/collections');
      if (res.success) {
        setCollections(res.data);
      }
    } catch (err) {
      console.error("Error fetching collections:", err);
    }
  };

  const fetchBanners = async (pageKey) => {
    try {
      const url = pageKey ? `/banners?pageKey=${pageKey}` : '/banners';
      const res = await api.get(url);
      if (res.success) {
        if (!pageKey) setBanners(res.data);
        return res.data;
      }
      return [];
    } catch (err) {
      console.error("Error fetching banners:", err);
      return [];
    }
  };

  const fetchPageContent = async (pageKey) => {
    try {
      const res = await api.get(`/page-content?pageKey=${pageKey}`);
      if (res.success) {
        setPageContent(prev => ({
          ...prev,
          [pageKey]: res.data // res.data is a map of sectionKey -> section
        }));
        return res.data;
      }
      return null;
    } catch (err) {
      console.error(`Error fetching page content for ${pageKey}:`, err);
      return null;
    }
  };

  const refreshSiteData = async () => {
    setLoading(true);
    await Promise.all([
      fetchHomepageConfig(),
      fetchCollections(),
      fetchBanners()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshSiteData();
  }, []);

  return (
    <SiteContext.Provider value={{
      homepageConfig,
      collections,
      banners,
      pageContent,
      loading,
      fetchHomepageConfig,
      fetchCollections,
      fetchBanners,
      fetchPageContent,
      refreshSiteData
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
