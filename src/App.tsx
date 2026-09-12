/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DogProfile, 
  EditorialArticle, 
  DailyWellnessTask, 
  PreventiveRecord 
} from './types';
import { 
  INITIAL_DOGS, 
  EDITORIAL_ARTICLES, 
  INITIAL_DAILY_TASKS, 
  INITIAL_PREVENTIVES 
} from './data/mockData';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SymptomTriageView } from './components/SymptomTriageView';
import { NutritionCalculatorView } from './components/NutritionCalculatorView';
import { PreventiveCareView } from './components/PreventiveCareView';
import { BlogView } from './components/BlogView';
import { BlogPostView } from './components/BlogPostView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CompanionModal } from './components/CompanionModal';
import { Footer } from './components/Footer';
import { apiService } from './services/apiService';

export default function App() {
  // State: Dogs
  const [allDogs, setAllDogs] = useState<DogProfile[]>(INITIAL_DOGS);
  const [activeDogId, setActiveDogId] = useState<string>('dog-1');

  // State: Articles
  const [articles, setArticles] = useState<EditorialArticle[]>(EDITORIAL_ARTICLES);
  const [selectedBlogPost, setSelectedBlogPost] = useState<EditorialArticle | null>(null);

  // State: Admin Portal & Authentication
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('canine_admin_token');
  });
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // State: Active Dog Wellness Records
  const [dailyTasks, setDailyTasks] = useState<DailyWellnessTask[]>(INITIAL_DAILY_TASKS);
  const [preventives, setPreventives] = useState<PreventiveRecord[]>(INITIAL_PREVENTIVES);

  // State: Navigation (default to 'blog' for content-first canine blog experience)
  const [currentTab, setCurrentTab] = useState<string>('blog');

  // Load articles from backend API with fallback to local storage
  const fetchArticles = async () => {
    try {
      const data = await apiService.getArticles(adminToken);
      if (Array.isArray(data) && data.length > 0) {
        setArticles(data);
        // If a post was selected, update its reference
        if (selectedBlogPost) {
          const updated = data.find((p) => p.id === selectedBlogPost.id || p.slug === selectedBlogPost.slug);
          if (updated) setSelectedBlogPost(updated);
        }
      }
    } catch (err) {
      console.log('Posts fetched from local dataset:', err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [adminToken]);

  // Check stored admin token on mount
  useEffect(() => {
    if (adminToken) {
      apiService.verifyAdminSession(adminToken).then((res) => {
        if (res.authenticated && res.user) {
          setAdminUser(res.user);
        } else {
          sessionStorage.removeItem('canine_admin_token');
          setAdminToken(null);
          setAdminUser(null);
        }
      }).catch(() => {
        // Verification offline
      });
    }
  }, []);

  // State: Modals
  const [isCompanionModalOpen, setIsCompanionModalOpen] = useState<boolean>(false);

  // Get current active dog
  const activeDog = allDogs.find((d) => d.id === activeDogId) || allDogs[0];

  // Daily task toggle
  const handleToggleTask = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Companion Management
  const handleAddCompanion = (newDog: DogProfile) => {
    setAllDogs((prev) => [...prev, newDog]);
    setActiveDogId(newDog.id);
  };

  const handleUpdateCompanion = (updatedDog: DogProfile) => {
    setAllDogs((prev) =>
      prev.map((d) => (d.id === updatedDog.id ? updatedDog : d))
    );
  };

  // Preventive Records
  const handleAddPreventive = (record: PreventiveRecord) => {
    setPreventives((prev) => [record, ...prev]);
  };

  // Admin Handlers
  const handleOpenAdmin = () => {
    if (adminToken && adminUser) {
      setCurrentTab('admin');
      setSelectedBlogPost(null);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (token: string, user: { username: string; role: string }) => {
    setAdminToken(token);
    setAdminUser(user);
    setIsAdminLoginOpen(false);
    setCurrentTab('admin');
    setSelectedBlogPost(null);
  };

  const handleAdminLogout = () => {
    apiService.logoutAdmin(adminToken || undefined);
    setAdminToken(null);
    setAdminUser(null);
    setCurrentTab('blog');
  };

  // Dedicated Blog Detail Reader Handler (Opens dedicated page, NOT a modal!)
  const handleOpenBlogPost = (post: EditorialArticle) => {
    setSelectedBlogPost(post);
    setCurrentTab('blog-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin view, render AdminDashboard directly
  if (currentTab === 'admin' && adminToken && adminUser) {
    return (
      <div className="min-h-screen bg-[#F8F6F0]">
        <AdminDashboard
          token={adminToken}
          adminUser={adminUser}
          posts={articles}
          onRefreshPosts={fetchArticles}
          onLogout={handleAdminLogout}
          onExitToSite={() => {
            setCurrentTab('blog');
            setSelectedBlogPost(null);
          }}
          onPreviewPost={(post) => {
            handleOpenBlogPost(post);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EC] text-[#1c1c16] font-sans antialiased selection:bg-[#ceecb4] selection:text-[#1a4316]">
      {/* Primary Sticky Header */}
      <Header
        currentTab={currentTab === 'blog-detail' ? 'blog' : currentTab}
        setCurrentTab={(tab) => {
          setSelectedBlogPost(null);
          setCurrentTab(tab);
        }}
        activeDog={activeDog}
        allDogs={allDogs}
        onSelectDog={(id) => setActiveDogId(id)}
        onOpenCompanionModal={() => setIsCompanionModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* 1. Dedicated Blog Post Page (Never in a modal) */}
        {currentTab === 'blog-detail' && selectedBlogPost ? (
          <BlogPostView
            post={selectedBlogPost}
            allPosts={articles}
            onBackToBlog={() => {
              setSelectedBlogPost(null);
              setCurrentTab('blog');
            }}
            onSelectPost={(p) => handleOpenBlogPost(p)}
            onNavigateTab={(tab) => {
              setSelectedBlogPost(null);
              setCurrentTab(tab);
            }}
          />
        ) : (
          <>
            {currentTab === 'blog' && (
              <BlogView
                articles={articles}
                onReadArticle={(a) => handleOpenBlogPost(a)}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardView
                activeDog={activeDog}
                articles={articles}
                dailyTasks={dailyTasks.filter((t) => t.dogId === activeDog.id || !t.dogId)}
                onToggleTask={handleToggleTask}
                onNavigate={(tab) => {
                  setSelectedBlogPost(null);
                  setCurrentTab(tab);
                }}
                onReadArticle={(a) => handleOpenBlogPost(a)}
                onOpenCompanionModal={() => setIsCompanionModalOpen(true)}
              />
            )}

            {currentTab === 'triage' && (
              <SymptomTriageView
                activeDog={activeDog}
                allDogs={allDogs}
                onSelectDog={(id) => setActiveDogId(id)}
              />
            )}

            {currentTab === 'nutrition' && (
              <NutritionCalculatorView
                activeDog={activeDog}
              />
            )}

            {currentTab === 'preventive' && (
              <PreventiveCareView
                activeDog={activeDog}
                preventives={preventives}
                onAddPreventive={handleAddPreventive}
              />
            )}
          </>
        )}
      </main>

      {/* Footer with Discreet Admin Link */}
      <Footer 
        onNavigate={(tab) => {
          setSelectedBlogPost(null);
          setCurrentTab(tab);
        }}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Companion Dog Management Modal */}
      <CompanionModal
        isOpen={isCompanionModalOpen}
        onClose={() => setIsCompanionModalOpen(false)}
        activeDog={activeDog}
        allDogs={allDogs}
        onSelectDog={(id) => setActiveDogId(id)}
        onAddDog={handleAddCompanion}
        onUpdateDog={handleUpdateCompanion}
      />
    </div>
  );
}
