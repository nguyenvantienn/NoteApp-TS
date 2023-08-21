import { Modal , Form, Button, FormControl } from "react-bootstrap"
import { useForm } from "react-hook-form";

import { NoteInput } from "../network/notes_api";
import * as NoteApi from "../network/notes_api"
import {Note} from "../models/note" 
import TextInputField from "./form/TextInputField"


interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSave: (note:Note) => void,
}

const AddEditNoteDialog = ({noteToEdit ,onDismiss , onNoteSave} : AddEditNoteDialogProps ) =>{

    const {register , handleSubmit , formState :{errors , isSubmitting} } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text : noteToEdit?.text ||"",
        }
    });

    async function onSubmit(input:NoteInput) {
        try {
            let noteResponse: Note;
            if (noteToEdit) {
                noteResponse = await NoteApi.updateNote(noteToEdit._id, input);
            }else{
                noteResponse = await NoteApi.createNote(input);
            }
            console.log(input);
            onNoteSave(noteResponse);
        } catch (error) {
            console.error(error); 
            alert(error);
        }
    }

    return (
       <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit Note" : "Add Note"}
                </Modal.Title>           
            </Modal.Header>
            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit) }>
                    <TextInputField
                        name ="title"
                        label="Title"
                        type ="text"
                        placeholder ="Enter Title"
                        register={register}
                        registerOptions={{required:"Required"}}
                        error = {errors.title}
                    />

                    
                    <TextInputField
                        name="text"
                        label="Text"
                        as = "textarea"
                        rows={5}
                        placeholder="Text"
                        register={register}
                    />
                    
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button 
                    type="submit" 
                    form="addEditNoteForm"
                    disabled= {isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
       </Modal>
    )
}

export default AddEditNoteDialog;