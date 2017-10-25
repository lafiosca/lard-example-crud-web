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
					alert(`Failed to load notes: ${error}`);
					this.notes.next([]);
					this.note.next(null);
				},
			});
	}

	fetchNote(noteId) {
		this.api.getNote(noteId)
			.subscribe({
				next: (note) => {
					this.note.next(note);
				},
				error: (error) => {
					alert(`Failed to load note: ${error}`);
				},
			});
	}

	selectNoteFromNotes(noteId, notes) {
		for (let i = 0; i < notes.length; i += 1) {
			if (notes[i].id === noteId) {
				return this.fetchNote(noteId);
			}
		}
		throw new Error(`Note ${noteId} does not exist`);
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
					alert(`Failed to load note ${noteId}: ${error}`);
				},
			});
	}

	createNote(note) {
		return this.api.createNote(note)
			.map((newNote) => {
				this.refreshNotes(newNote);
				return true;
			});
	}

	updateNote(note) {
		return this.api.updateNote(note)
			.map((newNote) => {
				this.refreshNotes(newNote);
				return true;
			});
	}

	deleteNote(noteId) {
		return this.api.deleteNote(noteId)
			.map(() => {
				this.refreshNotes(null);
				return true;
			});
	}
}
