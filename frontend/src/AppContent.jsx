import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import showToast from "./utils/toastConfig";
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AddNotePage from './pages/AddNotePage';
import EditNotePage from './pages/EditNotePage';
import NoteDetailPage from './pages/NoteDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const AppContent = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const handleFilterText = (val) => {
    setFilterText(val);
  };

  const handelSearchText = (val) => {
    setSearchText(val);
    if (val.length === 0) {
      // Reset to all notes when search is cleared
      axios
        .get("http://127.0.0.1:8008/notes/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setNotes(res.data);
        })
        .catch((err) => console.log(err.message));
    }
  };

  const filteredNotes =
    filterText === "BUSINESS"
      ? notes.filter((note) => note.category === "BUSINESS")
      : filterText === "PERSONAL"
      ? notes.filter((note) => note.category === "PERSONAL")
      : filterText === "IMPORTANT"
      ? notes.filter((note) => note.category === "IMPORTANT")
      : notes;

  useEffect(() => {
    if (!isAuthenticated) return;
    if (searchText.length < 3) return;
    
    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      axios
        .get(`http://127.0.0.1:8008/notes-search/?search=${searchText}`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setNotes(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          showToast.error("Search failed. Please try again.");
          setIsLoading(false);
        });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    axios
      .get("http://127.0.0.1:8008/notes/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setNotes(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  const addNote = (data) => {
    axios
      .post("http://127.0.0.1:8008/notes/", data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setNotes([...notes, res.data]);
        showToast.success("A new note has been added");
      })
      .catch((err) => {
        console.log(err.message);
        showToast.error("Failed to add note");
      });
  };

  const updateNote = (data, slug) => {
    axios
      .put(`http://127.0.0.1:8008/notes/${slug}/`, data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setNotes(notes.map((note) => (note.slug === slug ? res.data : note)));
        showToast.success("Note updated successfully");
      })
      .catch((err) => {
        console.log(err.message);
        showToast.error("Failed to update note");
      });
  };

  const deleteNote = async (slug) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`http://127.0.0.1:8008/notes/${slug}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then(() => {
          setNotes(notes.filter((note) => note.slug !== slug));
          resolve();
        })
        .catch((err) => {
          console.log(err.message);
          reject(err);
        });
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    setNotes([]);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout
            searchText={searchText}
            handelSearchText={handelSearchText}
            isAuthenticated={isAuthenticated}
            username={username}
            handleLogout={handleLogout}
          />
        }
      >
        <Route
          index
          element={
            isAuthenticated ? (
              <HomePage
                notes={filteredNotes}
                loading={isLoading}
                handleFilterText={handleFilterText}
                searchText={searchText}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add-note"
          element={
            isAuthenticated ? (
              <AddNotePage addNote={addNote} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit-note/:slug"
          element={
            isAuthenticated ? (
              <EditNotePage updateNote={updateNote} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notes/:slug"
          element={
            isAuthenticated ? (
              <NoteDetailPage deleteNote={deleteNote} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage
                setIsAuthenticated={setIsAuthenticated}
                setUsername={setUsername}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
        />
      </Route>
    </Routes>
  );
};

export default AppContent; 