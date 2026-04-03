import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const verdictConfig = {
  clean:      { color: '#27500A', bg: '#EAF3DE', border: '#C0DD97', label: 'Clean' },
  suspicious: { color: '#633806', bg: '#FAEEDA', border: '#FAC775', label: 'Suspicious' },
  flagged:    { color: '#791F1F', bg: '#FCEBEB', border: '#F7C1C1', label: 'High Risk' },
};

export default function PlagiarismResultCard({ logId, repoUrl, onFlagLog }) {
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await axiosInstance.post(`/plagiarism/check/${logId}`, { repoUrl });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Plagiarism check failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const verdict = result ? verdictConfig[result.verdict] : null;

  return (
    <div style={{
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: '12px',
      overflow: 'hidden',
      marginTop: '12px',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--color-background-secondary)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: '500' }}>
            Code plagiarism check
          </span>
          {repoUrl && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>
              {repoUrl.replace('https://github.com/', '')}
            </span>
          )}
        </div>
        <button
          onClick={handleCheck}
          disabled={loading}
          style={{
            padding: '6px 14px',
            background: loading ? 'var(--color-background-secondary)' : '#534AB7',
            color: loading ? 'var(--color-text-secondary)' : '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
          }}
        >
          {loading ? 'Scanning...' : 'Check plagiarism'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', fontSize: '13px', color: '#791F1F', background: '#FCEBEB' }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && verdict && (
        <div style={{ padding: '16px' }}>

          {/* Score row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: verdict.bg, border: `3px solid ${verdict.border}`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '20px', fontWeight: '500', color: verdict.color, lineHeight: 1 }}>
                {result.overallScore}%
              </span>
            </div>
            <div>
              <div style={{
                display: 'inline-block', padding: '3px 12px',
                background: verdict.bg, color: verdict.color,
                borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                marginBottom: '4px',
              }}>
                {verdict.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                {result.filesScanned} files scanned · {result.message}
              </div>
            </div>

            {result.verdict !== 'clean' && (
              <button
                onClick={() => onFlagLog && onFlagLog(result.verdict)}
                style={{
                  marginLeft: 'auto', padding: '6px 14px',
                  background: '#FCEBEB', color: '#791F1F',
                  border: '0.5px solid #F7C1C1', borderRadius: '8px',
                  fontSize: '12px', cursor: 'pointer',
                }}
              >
                Flag this log
              </button>
            )}
          </div>

          {/* Match breakdown */}
          {result.matches.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                Matched students
              </div>
              {result.matches.map((match, i) => (
                <div key={i} style={{
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: '8px', marginBottom: '8px', overflow: 'hidden',
                }}>
                  <div
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    style={{
                      padding: '10px 14px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'var(--color-background-secondary)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>
                        {match.matchedStudent.name}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>
                        {match.matchedStudent.email}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '12px', fontWeight: '500',
                        color: match.averageSimilarity > 60 ? '#791F1F'
                          : match.averageSimilarity > 30 ? '#633806' : '#27500A',
                      }}>
                        {match.averageSimilarity}% similar
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                        {expanded === i ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {expanded === i && match.fileMatches.length > 0 && (
                    <div style={{ padding: '10px 14px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                        File-level matches
                      </div>
                      {match.fileMatches.map((fm, j) => (
                        <div key={j} style={{
                          display: 'flex', justifyContent: 'space-between',
                          padding: '5px 0',
                          borderBottom: '0.5px solid var(--color-border-tertiary)',
                          fontSize: '12px',
                        }}>
                          <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                            {fm.currentFile}
                          </span>
                          <span style={{
                            color: fm.similarity > 60 ? '#791F1F'
                              : fm.similarity > 30 ? '#633806' : '#27500A',
                            fontWeight: '500',
                          }}>
                            {fm.similarity}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
