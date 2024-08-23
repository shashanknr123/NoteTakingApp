package com.example.note.taking.application;
import org.springframework.stereotype.Component;

@Component
public class NoteFactory {

    public Note createNote() {
        return new Note();
    }

    public Note createNoteWithTitleAndContent(String title, String content) {
        Note note = new Note();
        note.setTitle(title);
        note.setContent(content);
        return note;
    }
}