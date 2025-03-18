import React from "react";
import Filter from "../components/Filter";
import NoteCardContainer from "../components/NoteCardContainer";

const HomePage = ({ notes, loading, handleFilterText, searchText }) => {
  return (
    <>
      <Filter handleFilterText={handleFilterText} />
      {!loading && notes.length === 0 && searchText && searchText.length >= 3 && (
        <h4 style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          No notes found matching "{searchText}"
        </h4>
      )}
      {!loading && notes.length === 0 && (!searchText || searchText.length < 3) && (
        <h4 style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          No notes found. Start by adding a new note!
        </h4>
      )}
      <NoteCardContainer notes={notes} loading={loading} />
    </>
  );
};

export default HomePage;
