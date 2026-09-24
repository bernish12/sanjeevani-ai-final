import React, { useState, useRef } from 'react';
import { Activity, Upload, Stethoscope, AlertTriangle, CheckCircle2, ShieldPlus, BrainCircuit, X, Zap, Target, FileText, TrendingUp } from 'lucide-react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const res = await fetch(`${apiUrl}/api/analyze/scan`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Failed to connect to TITAN AI backend. Ensure FastAPI is running on port 8001.');
    } finally {
      setIsScanning(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getTriageColor = (level) => {
    switch (level) {
      case 'CRITICAL': return '#ef4444';
      case 'URGENT': return '#f59e0b';
      case 'NON-URGENT': return '#3b82f6';
      case 'NORMAL': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'SEVERE': return '#ef4444';
      case 'MODERATE': return '#f59e0b';
      case 'MILD': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">
            <ShieldPlus size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-dark)' }}>TITAN AI</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Medical Imaging Intelligence Platform</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Zap size={14} color="#f59e0b" />
            <span>Powered by Gemini Vision AI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>System Online</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Intro */}
        {!previewUrl && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>AI-Powered Diagnostic Assistant</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
              Upload any medical scan — Chest X-Ray, Brain MRI, Skull, CT Scan, or more. 
              Our multi-model AI engine will detect multiple findings, generate differential diagnoses, and produce a structured clinical report.
            </p>
          </div>
        )}

        {/* Upload Card */}
        <div className="card fade-in">
          {!previewUrl ? (
            <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
              <Upload size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Click or Drag to Upload Medical Scan</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supports DICOM, JPEG, PNG formats</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <span className="badge" style={{ background: '#e0f2fe', color: 'var(--primary-dark)' }}>Chest X-Ray</span>
                <span className="badge" style={{ background: '#e0f2fe', color: 'var(--primary-dark)' }}>Brain MRI</span>
                <span className="badge" style={{ background: '#e0f2fe', color: 'var(--primary-dark)' }}>Skull Scan</span>
                <span className="badge" style={{ background: '#e0f2fe', color: 'var(--primary-dark)' }}>CT Scan</span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', marginBottom: '1.5rem' }}>
                <img 
                  src={previewUrl} 
                  alt="Medical Scan" 
                  style={{ 
                    maxHeight: '400px', 
                    borderRadius: '0.5rem',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid #e2e8f0',
                    filter: isScanning ? 'brightness(0.8) contrast(1.2)' : 'none',
                    transition: 'all 0.5s ease'
                  }} 
                />
                
                {/* Scanning Laser */}
                {isScanning && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '4px',
                    background: 'var(--primary)',
                    boxShadow: '0 0 10px var(--primary)',
                    animation: 'scan-laser 2s infinite linear'
                  }}></div>
                )}
                <style>{`
                  @keyframes scan-laser {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                  }
                `}</style>
                
                {/* Bounding Boxes */}
                {result && result.bounding_boxes && result.bounding_boxes.map((box, i) => (
                  <div key={i} className="fade-in" style={{
                    position: 'absolute',
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                    border: '3px solid var(--danger)',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: '-25px',
                      left: '-3px',
                      background: 'var(--danger)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      {box.label}
                    </span>
                  </div>
                ))}
              </div>
              
              {!result && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)' }} onClick={resetUpload} disabled={isScanning}>
                    <X size={18} /> Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleScan} disabled={isScanning}>
                    {isScanning ? (
                      <><Activity className="animate-spin" size={18} /> Analyzing Scan...</>
                    ) : (
                      <><BrainCircuit size={18} /> Run AI Diagnosis</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        {/* ===== RESULTS PANEL (Aidoc / Lunit Style) ===== */}
        {result && (
          <div className="fade-in" style={{ marginTop: '2rem' }}>

            {/* Triage Banner */}
            <div style={{
              background: `${getTriageColor(result.triage_level || result.severity_level)}15`,
              border: `2px solid ${getTriageColor(result.triage_level || result.severity_level)}`,
              borderRadius: '12px',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {result.anomaly_detected ? <AlertTriangle size={28} color={getTriageColor(result.triage_level || result.severity_level)} /> : <CheckCircle2 size={28} color="#10b981" />}
                <div>
                  <h3 style={{ fontSize: '1.3rem', margin: 0, color: getTriageColor(result.triage_level || result.severity_level) }}>
                    {result.anomaly_detected ? `⚠ ${(result.findings && result.findings.length) || 0} Finding(s) Detected` : '✓ No Anomalies Found'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {result.scan_type} • {result.body_region || result.organ_identified} • Quality: {result.image_quality || 'GOOD'}
                  </p>
                </div>
              </div>
              <div style={{
                background: getTriageColor(result.triage_level || result.severity_level),
                color: 'white',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.05em'
              }}>
                TRIAGE: {result.triage_level || result.severity_level}
              </div>
            </div>

            {/* Three Column Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: result.findings && result.findings.length > 0 ? '1fr 1fr 1fr' : '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Column 1: Individual Findings (Lunit Style) */}
              {result.findings && result.findings.length > 0 && (
                <div className="card" style={{ borderTop: '3px solid var(--danger)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Target size={18} color="var(--danger)" />
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>AI Detected Findings</h3>
                  </div>
                  
                  {result.findings.map((finding, idx) => (
                    <div key={idx} style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      marginBottom: '0.75rem',
                      borderLeft: `4px solid ${getSeverityColor(finding.severity)}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{finding.name}</span>
                        <span style={{ 
                          fontWeight: 700, 
                          fontSize: '0.95rem', 
                          color: finding.confidence > 90 ? '#ef4444' : finding.confidence > 75 ? '#f59e0b' : '#3b82f6'
                        }}>
                          {finding.confidence}%
                        </span>
                      </div>
                      {/* Confidence Bar */}
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.4rem' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${finding.confidence}%`,
                          background: finding.confidence > 90 ? '#ef4444' : finding.confidence > 75 ? '#f59e0b' : '#3b82f6',
                          borderRadius: '3px',
                          transition: 'width 1s ease-out'
                        }}></div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                        📍 {finding.location} • <span style={{ color: getSeverityColor(finding.severity), fontWeight: 600 }}>{finding.severity}</span>
                      </p>
                      {finding.description && (
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, marginTop: '0.3rem', fontStyle: 'italic' }}>
                          {finding.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Column 2: Clinical Report */}
              <div className="card" style={{ borderTop: '3px solid var(--primary)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Stethoscope size={18} color="var(--primary-dark)" />
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Clinical Report</h3>
                </div>
                
                <div style={{ 
                  background: '#f8fafc', 
                  padding: '1.25rem', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  flex: 1,
                  fontFamily: '"SF Mono", "Fira Code", monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  color: '#334155',
                  whiteSpace: 'pre-wrap'
                }}>
                  {(result.clinical_report || result.ai_report || '').split('\n').map((line, idx) => {
                    if (line.startsWith('FINDINGS:') || line.startsWith('IMPRESSION:') || line.startsWith('RECOMMENDATION:')) {
                      return <div key={idx} style={{ fontWeight: 700, color: '#0f172a', marginTop: idx > 0 ? '0.75rem' : 0 }}>{line}</div>;
                    }
                    if (line.includes('Recommended Action:')) {
                      return <div key={idx} style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>{line}</div>;
                    }
                    return <div key={idx}>{line}</div>;
                  })}
                </div>
              </div>

              {/* Column 3: Differential Diagnosis + Summary */}
              <div className="card" style={{ borderTop: '3px solid #8b5cf6', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <TrendingUp size={18} color="#8b5cf6" />
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Differential Diagnosis</h3>
                  </div>
                  {result.differential_diagnosis && result.differential_diagnosis.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {result.differential_diagnosis.map((dx, idx) => (
                        <div key={idx} style={{
                          background: idx === 0 ? '#f5f3ff' : '#f8fafc',
                          border: `1px solid ${idx === 0 ? '#8b5cf6' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          padding: '0.6rem 0.85rem',
                          fontSize: '0.9rem',
                          fontWeight: idx === 0 ? 600 : 400,
                          color: idx === 0 ? '#5b21b6' : '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span style={{ 
                            background: idx === 0 ? '#8b5cf6' : '#94a3b8', 
                            color: 'white', 
                            width: '22px', height: '22px', 
                            borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                          }}>{idx + 1}</span>
                          {dx}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#10b981', fontWeight: 600 }}>No differential diagnoses applicable — Normal study.</p>
                  )}
                </div>

                {/* Quick Stats */}
                <div style={{ background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <FileText size={16} color="#64748b" />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Scan Summary</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>Scan Type</span><br/><strong>{result.scan_type}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Body Region</span><br/><strong>{result.body_region || result.organ_identified}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>AI Confidence</span><br/><strong>{result.confidence_score}%</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Image Quality</span><br/><strong>{result.image_quality || 'GOOD'}</strong></div>
                  </div>
                </div>

                <button className="btn" style={{ background: '#f1f5f9', color: 'var(--text-main)', width: '100%' }} onClick={resetUpload}>
                  Scan Another Image
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
