
import React, { useEffect, useState } from "react";

const QuickRevisionPage: React.FC = () => {
  const [points, setPoints] = useState<string[]>([]);
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
        const allPoints: string[] = [];

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
              
              // Handle different response shapes
              let notes = [];
              if (Array.isArray(data)) {
                notes = data;
              } else if (data.notes && Array.isArray(data.notes)) {
                notes = data.notes;
              } else if (data.results && Array.isArray(data.results)) {
                notes = data.results;
              }

              // Extract processed_notes from each note
              return notes
                .filter((note: any) => note.processed_notes)
                .map((note: any) => `[${subject}] ${note.processed_notes}`);
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

        setPoints(allPoints);
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
              <span style={styles.text}>{point}</span>
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

