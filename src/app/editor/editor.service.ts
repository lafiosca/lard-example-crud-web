import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { LardExampleCrudApiService } from '../services';

@Injectable()
export class EditorService {
	private notes:BehaviorSubject<any[]>;
	private note:BehaviorSubject<any>;

	constructor(private api:LardExampleCrudApiService) {
		this.notes = new BehaviorSubject([]);
		this.note = new BehaviorSubject(null);
	}

	getNotes(): BehaviorSubject<any[]> {
		return this.notes;
	}

	getNote(): BehaviorSubject<any> {
		return this.note;
	}

	refreshNotes(newNote) {
		this.api.getNotes()
			.subscribe({
				next: (notes) => {
					this.notes.next(notes);
					if (newNote) {
						this.selectNoteFromNotes(newNote.id, notes);
					} else {
						this.note.next(null);
					}
				},
				error: (error) => {
					console.error(`Failed to load notes: ${error}`);
					this.notes.next([]);
					this.note.next(null);
				},
			});
	}

	selectNoteFromNotes(noteId, notes) {
		for (let i = 0; i < notes.length; i += 1) {
			if (notes[i].id === noteId) {
				this.note.next(notes[i]);
				return;
			}
			throw new Error(`Note ${noteId} does not exist`);
		}
	}

	selectNote(noteId) {
		if (noteId === null) {
			this.note.next(null);
			return;
		}

		this.getNotes()
			.take(1)
			.subscribe({
				next: (notes) => {
					this.selectNoteFromNotes(noteId, notes);
				},
				error: (error) => {
					this.note.next(null);
					console.error(`Failed to load note ${noteId}: ${error}`);
				},
			});
	}

	createNote(note) {
		return this.api.createNote(note)
			.map(() => {
				this.refreshNotes(note);
				return true;
			});
	}

	updateNote(note) {
		return this.api.updateNote(note)
			.map(() => {
				this.refreshNotes(note);
				return true;
			});
	}

	deleteNote(note) {
		return this.api.deleteNote(note.noteId)
			.map(() => {
				this.refreshNotes(null);
				return true;
			});
	}
}
