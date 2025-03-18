import React from 'react'
import NoteCard from './NoteCard'
import Loader from './Loader'
import './NoteCardContainer.css'

const NoteCardContainer = ({notes, loading}) => {
  return (
    <div className="container">
      <div className="notes-grid">
        {loading && <Loader loading={loading} />}
        {notes.map(note => (
          <div key={note.id} className="note-grid-item">
            <NoteCard note={note} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default NoteCardContainer