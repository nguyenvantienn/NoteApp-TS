import  mongoose  from 'mongoose';
import  createHttpError  from 'http-errors';
import { RequestHandler } from "express";

import {assertIsDefinded} from "../util/assertlsDefined";
import NoteModel from "../models/note";


export const getNotes : RequestHandler =  async (req , res)=>{
    const authenticatedUserId = req.session.userId;


    
    try {
        assertIsDefinded(authenticatedUserId);

        // throw createHttpError(401);
        const notes = await NoteModel.find({userId: authenticatedUserId}).exec();
        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        let errorMessage;
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(500).json({error: errorMessage});
    }
    
}

export const getNote : RequestHandler =async (req , res , next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefinded(authenticatedUserId);
        
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400 , "Invalid note ID")
        }

        const note =  await NoteModel.findById(noteId).exec();
        
        if(!note){
            throw createHttpError(404,"Note not found");
        }
        if (!note.userId?.equals(authenticatedUserId)) {
            throw createHttpError(401,"You cannot access this note");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }    
}

interface CreateNoteBody {
    title?: string,
    text ?: string,
}

export const createNote : RequestHandler<unknown , unknown , CreateNoteBody , unknown> =async (req , res ,next) => {
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId;
    
    try {
        if(!title){
            throw createHttpError(400 , "Note must have title")
        }

        const newNote = await NoteModel.create({
            userId: authenticatedUserId ,
            title : title ,
            text: text ,
        });

        res.status(201).json(newNote)
    } catch (error) {
        next(error)
    }
}

interface UpdateNoteBody {
    title?:string,
    text?:string,
}

interface updateNoteParams {
    noteId : string,
}

export const updateNote : RequestHandler<updateNoteParams , unknown , UpdateNoteBody , unknown> =async (req , res ,next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefinded(authenticatedUserId);

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400 , "Invalid note ID")
        }

        if(!newTitle){
            throw createHttpError(400, "Note must have a title");
        }

        const note = await NoteModel.findById(noteId).exec();
        if(!note){
            throw createHttpError(404,"Note not found");
        }

        if (!note.userId?.equals(authenticatedUserId)) {
            throw createHttpError(401,"You cannot access this note");
        }

        note.title = newTitle;
        note.text = newText;

        //Save Update Note
        const updateNote = await note.save();

        res.status(200).json(updateNote)
    } catch (error) {
        next(error);
    }  
}


export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;

    const authenticatedUserId = req.session.userId;


    try {
        assertIsDefinded(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        if (!note.userId?.equals(authenticatedUserId)) {
            throw createHttpError(401,"You cannot access this note");
        }

        await note.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};