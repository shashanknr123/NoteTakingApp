package com.example.note.taking.application;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notes")
public class NoteController {
    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private NoteFactory noteFactory;

    @PostMapping
    public ResponseEntity<Note> addNote(@RequestBody Note note) {
        // Использование фабрики для создания нового экземпляра Note
        Note newNote = noteFactory.createNoteWithTitleAndContent(note.getTitle(), note.getContent());
        if (note.getTitle() == null || note.getContent() == null) {
            return ResponseEntity.badRequest().build();
        }
        note.setCreatedAt(LocalDateTime.now());
        Note savedNote = noteRepository.save(note);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNote);
    }

    @GetMapping
    public ResponseEntity<List<Note>> getAllNotes() {
        List<Note> notes = noteRepository.findAll();
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        Optional<Note> optionalNote = noteRepository.findById(id);
        return optionalNote.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note updatedNote) {
        Optional<Note> optionalNote = noteRepository.findById(id);
        if (optionalNote.isPresent()) {
            Note existingNote = optionalNote.get();
            existingNote.setTitle(updatedNote.getTitle());
            existingNote.setContent(updatedNote.getContent());
            Note savedNote = noteRepository.save(existingNote);
            return ResponseEntity.ok(savedNote);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        Optional<Note> optionalNote = noteRepository.findById(id);
        if (optionalNote.isPresent()) {
            noteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}