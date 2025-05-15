import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/sidebar'
import Result  from '../components/result'

// ─── API UTILITIES (module-scoped, no extra exports) ───────────────────────────
const API_BASE_URL = 'https://mominah-edulearnai.hf.space'
const API_ENDPOINTS = {
  PROCESS: 'check/process',
  DOWNLOAD: 'check/download',
}

function getApiUrl(endpoint) {
  const clean = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_BASE_URL}/${clean}`
}

function handleApiError(error) {
  console.error('API Error:', error)
  if (error instanceof Error) {
    if (error.name === 'AbortError') return 'Request was canceled'
    return error.message
  }
  return String(error)
}
// ──────────────────────────────────────────────────────────────────────────────

export default function Check() {
  const [originalPdf, setOriginalPdf]   = useState(null)
  const [studentPdf,  setStudentPdf]    = useState(null)
  const [results,     setResults]       = useState(null)
  const [loading,     setLoading]       = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [error,       setError]         = useState(null)

  const procAbort = useRef()
  const dlAbort   = useRef()

  useEffect(() => {
    return () => {
      procAbort.current?.abort()
      dlAbort.current?.abort()
    }
  }, [])

  const handleProcess = async () => {
    if (!originalPdf || !studentPdf) {
      setError('Please upload both PDFs before processing.')
      return
    }
    procAbort.current?.abort()
    const ctrl = new AbortController()
    procAbort.current = ctrl

    setLoading(true)
    setError(null)

    const form = new FormData()
    // must match HF Space expected field names:
    form.append('student_pdf',  studentPdf)
    form.append('paper_k_pdf',  originalPdf)

    try {
      const resp = await fetch(
        getApiUrl(API_ENDPOINTS.PROCESS),
        { method: 'POST', body: form, signal: ctrl.signal }
      )
      if (!resp.ok) {
        const errBody = await resp.text()
        console.error('Server error body:', errBody)
        throw new Error(`${resp.status} ${resp.statusText}`)
      }
      const json = await resp.json()
      setResults(json.results || null)
    } catch (err) {
      if (err.name !== 'AbortError') setError(handleApiError(err))
    } finally {
      if (!ctrl.signal.aborted) setLoading(false)
    }
  }

  const handleDownload = async () => {
    dlAbort.current?.abort()
    const ctrl = new AbortController()
    dlAbort.current = ctrl

    setDownloadLoading(true)
    setError(null)

    try {
      const resp = await fetch(
        getApiUrl(API_ENDPOINTS.DOWNLOAD),
        { method: 'GET', signal: ctrl.signal }
      )
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`)

      const blob = await resp.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = 'grading_results.json'
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      if (err.name !== 'AbortError') setError(handleApiError(err))
    } finally {
      if (!ctrl.signal.aborted) setDownloadLoading(false)
    }
  }

  const handleReset = () => {
    procAbort.current?.abort()
    dlAbort.current?.abort()
    setOriginalPdf(null)
    setStudentPdf(null)
    setResults(null)
    setError(null)
    setLoading(false)
    setDownloadLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        originalPdf={originalPdf}
        setOriginalPdf={setOriginalPdf}
        studentPdf={studentPdf}
        setStudentPdf={setStudentPdf}
        onProcess={handleProcess}
        onDownload={handleDownload}
        onReset={handleReset}
        loading={loading}
        downloadLoading={downloadLoading}
        error={error}
        hasResults={!!results}
      />
      <main style={{ flex: 1, padding: 24 }}>
        {results
          ? <Result results={results} />
          : <p style={{ color: '#666' }}>No result cards yet.</p>
        }
      </main>
    </div>
  )
}
