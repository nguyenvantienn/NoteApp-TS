import {useState , useEffect} from "react"

import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import AddEditNoteDialog from "./AddEditNoteDialog";


import { Note as NoteModel } from '../models/note';
import * as NoteApi from "../network/notes_api"
import styleUtils from "../styles/ultis.module.css";
import styles from "../styles/NotePage.module.css"
import Note from "./Note";


const NotesPageLoggedInView = () =>{
    const [notes , setNotes] = useState<NoteModel[]>([]);
    const [showAddNoteDialog, setshowAddNoteDialog] = useState(false);
    const [showNotesLoadingError , setShowNotesLoadingError] = useState(false);
  
    const [noteToEdit , setNoteToEdit] = useState<NoteModel|null>(null);
    const [notesLoading , setNotesLoading] = useState(false);

    useEffect(()=>{
        async function loadNotes(){
          try {
            const notes = await NoteApi.fetchNotes();
            setNotes(notes);
            setShowNotesLoadingError(false);
            setNotesLoading(true);
          } catch (error) {
            console.error(error);
            setShowNotesLoadingError(true);
            alert(error);
          } finally{
            setNotesLoading(false);
          }
        }
    
        loadNotes();
    },[])

    async function deleteNote(note:NoteModel) {
        try {
          await NoteApi.deleteNote(note._id);
          let newNote = notes.filter(existingNote => existingNote._id !== note._id)
          setNotes(newNote);
    
        } catch (error) {
          console.error(error);
          alert(error);
        }
    }




    const notesGrid = 
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}` }>
        {notes.map((note)=>(
            <Col key={note._id}>
            <Note  
                note={note} 
                className={styles.note} 
                onDeleteNoteClicked={deleteNote}
                onNoteClicked={(note)=>{setNoteToEdit(note)}}
            />
            </Col> 
        ))}
        </Row>




    return (
        <>
            <Button
          className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter} `}
          onClick={()=>{setshowAddNoteDialog(true);}}
        >
          <FaPlus/>
          <span>Add New Note </span>
        </Button>
        {notesLoading && <Spinner animation="border" variant="primary"/>}
        {showNotesLoadingError && <p>Something went wrong .Please refresh the Note page</p>}
        {!notesLoading && !showNotesLoadingError &&
          <>
          {
            notes.length > 0?
            notesGrid :
            <p>You don't have any notes yet. Please add New Note</p>

          }
          </>
        }
        {
          showAddNoteDialog && 
          <AddEditNoteDialog 
            onDismiss={()=> setshowAddNoteDialog(false)}
            onNoteSave={(newNote) => {
              setNotes([...notes, newNote]);
              setshowAddNoteDialog(false);
            }}
          />
        }
        {
          noteToEdit && 
          <AddEditNoteDialog
            noteToEdit={noteToEdit}
            onDismiss={()=>{setNoteToEdit(null)}}
            onNoteSave={(updateNoted)=>{
              let newNotes = notes.map(existingNote => existingNote._id === updateNoted._id ? updateNoted : existingNote)
              setNotes([...newNotes])
              setNoteToEdit(null);
            }}
          />
        }
        </>
    );
}

export default NotesPageLoggedInView;