'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function PushNotificationManager() {
  const { user, appUser } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if permission is already granted or denied
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default' && user && appUser) {
        // Show our beautiful prompt instead of raw browser prompt immediately
        setShowPrompt(true);
      }
    }
  }, [user, appUser]);

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3'); // Free alert ping
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !user || !appUser) return;
    
    // Listen for foreground FCM messages if permission granted
    const initMessaging = async () => {
      try {
        const { getMessaging, onMessage } = await import('firebase/messaging');
        const { default: app } = await import('@/lib/firebase');
        const messaging = getMessaging(app);
        
        onMessage(messaging, (payload) => {
          console.log('[Foreground] Message received. ', payload);
          // Play sound
          if (audioRef.current && payload.data?.urgency === 'Urgent') {
            audioRef.current.play().catch(e => console.log('Audio error:', e));
          }
        });
      } catch (err) {
        console.log("FCM not supported or blocked in this browser.", err);
      }
    };
    
    if (Notification.permission === 'granted') {
      initMessaging();
    }
  }, [user, appUser]);

  const requestPermission = async () => {
    setShowPrompt(false);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' && user) {
        const { getMessaging, getToken } = await import('firebase/messaging');
        const { default: app } = await import('@/lib/firebase');
        const messaging = getMessaging(app);
        
        // The hackathon uses auto-tokens if VapidKey is undefined, fallback gracefully
        const token = await getToken(messaging, { 
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
        }).catch(() => null);

        if (token) {
          await updateDoc(doc(db, 'users', user.uid), {
            fcmToken: token,
          }).catch(() => null);
        }
      }
    } catch (e) {
      console.log('Error getting permission:', e);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 md:top-auto md:bottom-8 right-4 md:right-8 z-[100] max-w-sm w-[calc(100%-2rem)] bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-2xl rounded-2xl p-5 animate-slideDown md:animate-fadeInUp">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
          <span className="text-xl">🔔</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Enable Smart Alerts</h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            Get instant push notifications and an alert sound when urgent hackathon notices drop.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={requestPermission}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Allow Alerts
            </button>
            <button 
              onClick={() => setShowPrompt(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
