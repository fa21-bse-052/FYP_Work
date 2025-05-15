import React from 'react'

export default function Result({ results }) {
  return (
    <div>
      <h2>Result Cards</h2>
      {results.map((card, i) => (
        <div
          key={i}
          style={{
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h3>
            {card['Candidate Info'].Name} —{' '}
            {card.Result.Percentage.toFixed(2)}%
          </h3>
          <p>
            Score: {card.Result['Total Marks']} /{' '}
            {card.Result['Total Questions']}
          </p>
          <details>
            <summary>Details</summary>
            <pre style={{
              background: '#f9f9f9',
              padding: 8,
              overflowX: 'auto',
            }}>
              {JSON.stringify(card, null, 2)}
            </pre>
          </details>
        </div>
      ))}
    </div>
  )
}
