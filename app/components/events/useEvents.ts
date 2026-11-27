'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { EventType, sortEvents } from '../../../lib/events';

/** Ambil semua jadwal dari koleksi "events" secara realtime. */
export function useEvents() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError('Koneksi database belum siap.');
      return;
    }
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEvents(sortEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as EventType[]));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError('Jadwal belum bisa dimuat.');
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { events, loading, error };
}
