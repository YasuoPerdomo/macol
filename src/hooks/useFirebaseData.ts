import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { MonthlyData } from '../types';
import { getInitialData } from '../data/initialData';

export interface ActivityItem {
  id?: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  read: boolean;
}

interface UseFirebaseDataProps {
  coupleId: string | null;
  userId: string;
  userName: string;
}

export function useFirebaseData({ coupleId, userId, userName }: UseFirebaseDataProps) {
  const [allMonthsData, setAllMonthsData] = useState<Record<string, MonthlyData>>(getInitialData());
  const [acumuladoMap, setAcumuladoMap] = useState<Record<string, { budget: number; real: number }>>({});
  const [annualLimit, setAnnualLimit] = useState<number>(2500000);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [newNotification, setNewNotification] = useState<ActivityItem | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Listen to monthly data changes in real-time
  useEffect(() => {
    if (!coupleId) return;

    const unsubscribe = onSnapshot(doc(db, 'couples', coupleId, 'data', 'monthlyData'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.months) {
          setAllMonthsData(data.months);
        }
        if (data.acumulado) {
          setAcumuladoMap(data.acumulado);
        }
        if (data.annualLimit !== undefined) {
          setAnnualLimit(data.annualLimit);
        }
      }
      setDataLoaded(true);
    });

    return unsubscribe;
  }, [coupleId]);

  // Listen to activity log in real-time
  useEffect(() => {
    if (!coupleId) return;

    const activityQuery = query(
      collection(db, 'couples', coupleId, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(activityQuery, (snapshot) => {
      const items: ActivityItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ActivityItem);
      });
      setActivities(items);

      // Check for new notification from partner
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const activity = change.doc.data() as ActivityItem;
          if (activity.userId !== userId) {
            setNewNotification({ id: change.doc.id, ...activity });
            // Auto-dismiss after 5 seconds
            setTimeout(() => setNewNotification(null), 5000);
          }
        }
      });
    });

    return unsubscribe;
  }, [coupleId, userId]);

  // Save monthly data to Firestore
  const saveMonthsData = useCallback(
    (newData: Record<string, MonthlyData>, newAcumulado?: Record<string, { budget: number; real: number }>) => {
      if (!coupleId) return;

      // Update local state immediately for fast typing response
      setAllMonthsData(newData);
      if (newAcumulado) setAcumuladoMap(newAcumulado);

      const dataToSave: any = { months: newData };
      if (newAcumulado) {
        dataToSave.acumulado = newAcumulado;
      }

      setDoc(doc(db, 'couples', coupleId, 'data', 'monthlyData'), dataToSave, { merge: true }).catch(console.error);
    },
    [coupleId]
  );

  // Save acumulado
  const saveAcumulado = useCallback(
    (newAcumulado: Record<string, { budget: number; real: number }>) => {
      if (!coupleId) return;
      setAcumuladoMap(newAcumulado);
      setDoc(doc(db, 'couples', coupleId, 'data', 'monthlyData'), { acumulado: newAcumulado }, { merge: true }).catch(console.error);
    },
    [coupleId]
  );

  // Save annual limit
  const saveAnnualLimit = useCallback(
    (limit: number) => {
      if (!coupleId) return;
      setAnnualLimit(limit);
      setDoc(doc(db, 'couples', coupleId, 'data', 'monthlyData'), { annualLimit: limit }, { merge: true }).catch(console.error);
    },
    [coupleId]
  );

  // Log an activity
  const logActivity = useCallback(
    async (action: string) => {
      if (!coupleId) return;

      const activity: ActivityItem = {
        userId,
        userName,
        action,
        timestamp: new Date().toISOString(),
        read: false,
      };

      await addDoc(collection(db, 'couples', coupleId, 'activities'), activity);
    },
    [coupleId, userId, userName]
  );

  // Dismiss notification
  const dismissNotification = useCallback(() => {
    setNewNotification(null);
  }, []);

  // Initialize data for a new couple
  const initializeData = useCallback(async () => {
    if (!coupleId) return;

    const dataDoc = await getDoc(doc(db, 'couples', coupleId, 'data', 'monthlyData'));
    if (!dataDoc.exists()) {
      const initialData = getInitialData();
      await setDoc(doc(db, 'couples', coupleId, 'data', 'monthlyData'), {
        months: initialData,
        acumulado: {},
      });
    }
  }, [coupleId]);

  // Initialize data when couple is set
  useEffect(() => {
    if (coupleId) {
      initializeData();
    }
  }, [coupleId, initializeData]);

  return {
    allMonthsData,
    acumuladoMap,
    annualLimit,
    activities,
    newNotification,
    dataLoaded,
    saveMonthsData,
    saveAcumulado,
    saveAnnualLimit,
    logActivity,
    dismissNotification,
  };
}
