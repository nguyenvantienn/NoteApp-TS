import { Card } from "react-bootstrap";
import {MdDelete} from "react-icons/md";

import { Note as NoteModel } from "../models/note";
import styles from "../styles/Note.module.css";
import styleUltis from "../styles/ultis.module.css"
import { formatDate } from "../utils/formatDate";

interface NoteProps {
    note: NoteModel,
    className?: string,

    onDeleteNoteClicked : (note: NoteModel) => void,
    onNoteClicked : (note: NoteModel) => void,
}



const Note = ({note ,className , onDeleteNoteClicked ,onNoteClicked} : NoteProps) => {
    const {
        title,
        text,
        createdAt,
        updateAt,
    } =note;

    let createdUpdatedText: string;
    if(updateAt > createdAt){
    createdUpdatedText = "Updated:" + formatDate(updateAt);
    } else{
    //console.log('createAt : ',createdAt)
    createdUpdatedText = "Created:" + formatDate(createdAt)
    }

    
    console.log("Style :", styles);

    return (
        <Card 
            className={`${styles.noteCard} ${className}`}
            onClick={()=>{onNoteClicked(note)}}
        >
            <Card.Body className={`${styles.cardBody}`}>
                <Card.Title className={`${styleUltis.flexCenter}`}>
                    {title}
                    <MdDelete
                        className="text-muted ms-auto"
                        onClick={(e)=>{
                            onDeleteNoteClicked(note)
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text>  
            </Card.Body>
            <Card.Footer className="text-muted">
                    {createdUpdatedText}
                </Card.Footer>
        </Card>
    )
}

export default Note;