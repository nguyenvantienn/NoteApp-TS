
import React, { useEffect, useState } from 'react';
import { Container} from 'react-bootstrap';
import {BrowserRouter } from "react-router-dom"
import {Routes , Route} from "react-router"


import { Note as NoteModel } from './models/note';

import * as NoteApi from "./network/notes_api"
import {User} from "./models/user"

import SignUpModal from "./components/SignUpModal"
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import NotesPageLoggedInView from "./components/NotesPageLoggedInView"
import NotesPageLoggedOutView from "./components/NotesPageLoggedOutView";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";

import styles from "./styles/App.module.css"


function App() {

  const [loggedInUser , setLoggedInUser] = useState<User | null>(null)

  const [shoiwSignUpModal , setShowSignUpModal] = useState(false);
  const [showLoginModal , setShowLoginModal] = useState(false);
  

  useEffect(()=>{
    async function fetchLoggedInUser() {
      try {
        const user = await NoteApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLoggedInUser();
  } , [])




  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked ={()=>{setShowLoginModal(true)}}
          onSignUpClicked ={()=>{setShowSignUpModal(true)}}
          onLogoutSuccessful = {()=>{setLoggedInUser(null)}}
        />

        <Container className={styles.pageContainer}>
          <Routes>
            <Route
              path="/"
              element={<NotesPage loggedInUser={loggedInUser}/>}
            />
            <Route
              path="/privacy"
              element={<PrivacyPage />}
            />

            <Route
              path="/*"
              element={<NotFoundPage />}
            />
          </Routes>
        </Container>
      
        
          {shoiwSignUpModal &&
            <SignUpModal
              onDismiss={()=>{setShowSignUpModal(false)}}
              onSignUpSuccessful={(user)=>{
                setLoggedInUser(user);
                setShowSignUpModal(false);
              }}
            />
          }

          {showLoginModal &&
            <LoginModal
              onDismiss={()=>{setShowLoginModal(false)}}
              onLoginSuccessful={(user)=>{
                setLoggedInUser(user);
                setShowLoginModal(false);
              }}
            />
          }

      
      </div>
    </BrowserRouter>
    
  );
}

export default App;
