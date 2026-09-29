import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

function getSessionId() {
  let id = sessionStorage.getItem('sid');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('sid', id);
  }
  return id;
}

let lastTrackedPage = null;

export default function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    if (page.startsWith('/admin')) return;
    if (page === lastTrackedPage) return;
    lastTrackedPage = page;

    api
      .post('/visitors/track', {
        page,
        referrer: document.referrer || '',
        session_id: getSessionId(),
      })
      .catch(() => {});
  }, [location.pathname]);

  return null;
}
