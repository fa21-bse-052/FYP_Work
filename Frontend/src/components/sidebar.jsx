import React from 'react'
import { motion } from 'framer-motion'

const sidebarVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { when: 'beforeChildren', staggerChildren: 0.1 },
  },
}

const blockVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const buttonVariants = {
  rest: { scale: 1, backgroundColor: '#facc15' },
  hover: { scale: 1.05, backgroundColor: '#eab308' },
  tap:   { scale: 0.95 },
}

export default function Sidebar({
  originalPdf,
  setOriginalPdf,
  studentPdf,
  setStudentPdf,
  onProcess,
  onDownload,
  onReset,
  loading,
  downloadLoading,
  error,
  hasResults,
}) {
  const fileBlock = (label, file, setter, id) => (
    <motion.div
      variants={blockVariants}
      style={{ marginBottom: 24 }}
    >
      <strong style={{ display: 'block', marginBottom: 8 }}>{label}</strong>

      {/* Hidden file input */}
      <input
        id={id}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={e => e.target.files?.[0] && setter(e.target.files[0])}
      />

      {/* Styled label as upload button */}
      <motion.label
        htmlFor={id}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        style={{
          display: 'inline-block',
          padding: '10px 16px',
          backgroundColor: '#facc15',
          color: '#000',
          borderRadius: 9999,
          cursor: 'pointer',
          fontWeight: 'bold',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        {file ? file.name : 'Upload PDF'}
      </motion.label>

      {file && (
        <div style={{ marginTop: 8, color: 'green', fontSize: '0.9em' }}>
          File selected
        </div>
      )}
    </motion.div>
  )

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      style={{
        width: 320,
        padding: 24,
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        borderRight: '1px solid #ddd',
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        borderRadius: 8,
      }}
    >
      <motion.h2 variants={blockVariants} style={{ marginBottom: 24 }}>
        Upload PDFs
      </motion.h2>

      {fileBlock(
        'Original Answer Key',
        originalPdf,
        setOriginalPdf,
        'orig'
      )}
      {fileBlock(
        'Student Answer Key',
        studentPdf,
        setStudentPdf,
        'stud'
      )}

      {error && (
        <motion.div
          variants={blockVariants}
          style={{
            color: 'red',
            marginBottom: 16,
            fontSize: '0.9em',
            fontWeight: 'bold',
          }}
        >
          {error}
        </motion.div>
      )}

      <motion.button
        onClick={onProcess}
        disabled={loading}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: 12,
          backgroundColor: '#facc15',
          color: '#000',
          border: 'none',
          borderRadius: 9999,
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing…' : 'Process PDFs'}
      </motion.button>

      {hasResults && (
        <>
          <motion.button
            onClick={onDownload}
            disabled={downloadLoading}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: 12,
              backgroundColor: '#facc15',
              color: '#000',
              border: 'none',
              borderRadius: 9999,
              fontWeight: 'bold',
              cursor: downloadLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {downloadLoading ? 'Downloading…' : 'Download JSON'}
          </motion.button>

          <motion.button
            onClick={onReset}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#facc15',
              color: '#000',
              border: 'none',
              borderRadius: 9999,
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Reset
          </motion.button>
        </>
      )}
    </motion.aside>
  )
}
