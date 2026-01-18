
import React, { useEffect, useState } from "react";

const QuickRevisionPage: React.FC = () => {
  type PointItem = { text: string; subject: string; source: string };
  const [points, setPoints] = useState<PointItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch processed notes from all subject endpoints
  useEffect(() => {
    const subjectEndpoints: Record<string, string> = {
      'Data Structures & Algorithms': 'http://127.0.0.1:8000/api/note/notedsa/',
      'Theory of Computation': 'http://127.0.0.1:8000/api/note/notetoc/',
      'Computer Networks': 'http://127.0.0.1:8000/api/note/notecn/',
      'Computer Organization & Architecture': 'http://127.0.0.1:8000/api/note/notecoa/',
      'Operating Systems': 'http://127.0.0.1:8000/api/note/noteos/',
    };

    const fetchAllNotes = async () => {
      try {
        setLoading(true);
  const allPoints: PointItem[] = [];

        // Helper to robustly extract processed text from various shapes
        const extractProcessed = (obj: any): string[] => {
          if (!obj) return [];
          // If the endpoint returned an array of notes already
          if (Array.isArray(obj)) {
            return obj.flatMap((note: any) => extractProcessed(note));
          }

          // If the object wraps notes
          if (obj.notes && Array.isArray(obj.notes)) {
            return obj.notes.flatMap((n: any) => extractProcessed(n));
          }
          if (obj.results && Array.isArray(obj.results)) {
            return obj.results.flatMap((n: any) => extractProcessed(n));
          }

          // Common candidate keys (added 'content' and 'pointwise')
          const candidates = [
            'processed_notes', 'processedNotes', 'processed_note', 'processed',
            'summary', 'bullets', 'processed_text', 'text', 'content', 'pointwise'
          ];

          for (const key of candidates) {
            if (obj[key]) {
              const value = obj[key];
              if (Array.isArray(value)) return value.map((s:any) => String(s)).filter(Boolean);
              if (typeof value === 'object') {
                if (Array.isArray(value.lines)) return value.lines.map((s:any) => String(s)).filter(Boolean);
                if (value.text) return [String(value.text)].filter(Boolean);
              }
              if (typeof value === 'string') {
                const trimmed = value.trim();
                try {
                  const parsed = JSON.parse(trimmed);
                  if (Array.isArray(parsed)) return parsed.map((s:any) => String(s)).filter(Boolean);
                  if (parsed && typeof parsed === 'object' && parsed.lines) return parsed.lines.map((s:any) => String(s)).filter(Boolean);
                } catch (e) {
                  // not JSON, continue
                }
                return trimmed
                  .split(/\r?\n|•|\u2022|\-|\*|\u2023/)
                  .map((s) => s.replace(/^[\s\-\*•\u2022\u2023]+/, '').trim())
                  .filter(Boolean);
              }
              return [String(value)].filter(Boolean);
            }
          }

          if (typeof obj === 'string') {
            return obj
              .trim()
              .split(/\r?\n|•|\u2022|\-|\*|\u2023/)
              .map((s) => s.replace(/^[\s\-\*•\u2022\u2023]+/, '').trim())
              .filter(Boolean);
          }
          return [];
        };

        // Fetch from all endpoints in parallel
        const fetchPromises = Object.entries(subjectEndpoints).map(
          async ([subject, url]) => {
            try {
              const response = await fetch(url);
              if (!response.ok) {
                console.warn(`Failed to fetch ${subject}: ${response.status}`);
                return [];
              }
              const data = await response.json();
              console.debug('[QuickRevision] raw response for', subject, data);

              // Collect points from top-level pointwise/summary and from notes array
              const subjectPoints: PointItem[] = [];

              // If API provides top-level pointwise (array) or summary/text, extract it
              if (data.pointwise) {
                const top = extractProcessed(data.pointwise);
                subjectPoints.push(...top.map((s) => ({ text: s, subject, source: 'pointwise' })));
              }
              if (data.summary) {
                const top = extractProcessed(data.summary);
                subjectPoints.push(...top.map((s) => ({ text: s, subject, source: 'summary' })));
              }

              // Normalize to array of note-like objects
              let notesArr: any[] = [];
              if (Array.isArray(data)) notesArr = data;
              else if (data.notes && Array.isArray(data.notes)) notesArr = data.notes;
              else if (data.results && Array.isArray(data.results)) notesArr = data.results;
              else if (typeof data === 'object' && (data.content || data._id)) notesArr = [data];

              subjectPoints.push(...notesArr.flatMap((note: any) => {
                const extracted = extractProcessed(note);
                return extracted.map((s) => ({ text: s, subject, source: 'note' }));
              }));

              return subjectPoints;
            } catch (err) {
              console.warn(`Error fetching ${subject}:`, err);
              return [];
            }
          }
        );

        const results = await Promise.all(fetchPromises);
        results.forEach((subjectPoints) => {
          allPoints.push(...subjectPoints);
        });

        // normalize, dedupe, limit (work with PointItem[])
        const normalized = allPoints.map(p => ({ ...p, text: p.text.trim() })).filter(p => p.text);
        const seen = new Set<string>();
        const deduped = normalized.filter(p => {
          if (seen.has(p.text)) return false;
          seen.add(p.text);
          return true;
        });
        const finalPoints = deduped.slice(0, 1000);

        setPoints(finalPoints);
        setError(null);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load revision notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotes();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Quick Revision</h1>
      {!loading && !error && (
        <div style={{ textAlign: 'center', color: '#6b7280', marginBottom: 8 }}>
          Found {points.length} revision item{points.length !== 1 ? 's' : ''}
        </div>
      )}
      
      {loading && (
        <div style={styles.loadingMessage}>Loading revision notes...</div>
      )}
      
      {error && (
        <div style={styles.errorMessage}>{error}</div>
      )}
      
      {!loading && !error && points.length === 0 && (
        <div style={styles.emptyMessage}>
          No processed notes found. Please add and process your notes first.
        </div>
      )}
      
      {!loading && !error && points.length > 0 && (
        <div style={styles.list}>
          {points.map((point, index) => (
            <div key={index} style={styles.item}>
              <span style={styles.number}>{index + 1}.</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, background: '#eef2ff', color: '#1e3a8a', padding: '2px 8px', borderRadius: 999 }}>{point.source}</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>[{point.subject}]</span>
                </div>
                <span style={styles.text}>{point.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 🎨 Inline Styles (converted from your CSS)
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px 30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
    fontFamily: "Poppins, sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    color: "#1e3a8a",
    borderBottom: "2px solid #e0e7ff",
    paddingBottom: "12px",
    marginBottom: "20px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "500px",
    overflowY: "auto",
    paddingRight: "10px",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    background: "#f9fafb",
    borderLeft: "4px solid #3b82f6",
    padding: "10px 14px",
    borderRadius: "6px",
    transition: "background 0.3s ease",
  },
  number: {
    fontWeight: 600,
    color: "#2563eb",
    marginRight: "10px",
    flexShrink: 0,
  },
  text: {
    color: "#374151",
    lineHeight: 1.6,
    fontSize: "1rem",
  },
  loadingMessage: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "1.1rem",
    padding: "40px 20px",
  },
  errorMessage: {
    textAlign: "center",
    color: "#dc2626",
    fontSize: "1rem",
    padding: "40px 20px",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    border: "1px solid #fca5a5",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "1rem",
    padding: "40px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
};

export default QuickRevisionPage;

