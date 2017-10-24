import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Rx';

import { EditorService } from '../editor.service';

@Component({
	selector: 'app-note',
	templateUrl: './note.component.html',
})
export class NoteComponent implements OnInit, OnDestroy {
	private noteSub: Subscription;

	private saving = false;
	private deleting = false;

	private note = {
		id: null,
		title: '',
		text: null,
	};

	constructor(private editorService:EditorService) { }

	ngOnInit() {
		this.noteSub = this.editorService.getNote()
			.subscribe((note) => {
				if (note === null) {
					this.note.id = null;
					this.note.title = '';
					this.note.text = '';
				} else {
					this.note.id = note.id;
					this.note.title = note.title;
					this.note.text = note.text;
				}
			});
	}

	ngOnDestroy() {
		this.noteSub.unsubscribe();
	}

	saveNote() {
		this.saving = true;

		let obs;

		if (this.note.id === null) {
			console.log(`Save new note '${this.note.title}'`);
			obs = this.editorService.createNote({
				title: this.note.title,
				text: this.note.text,
			});
		} else {
			console.log(`Update note '${this.note.title}'`);
			obs = this.editorService.updateNote({
				id: this.note.id,
				title: this.note.title,
				text: this.note.text,
			});
		}

		obs.subscribe({
			next: () => {
				this.saving = false;
			},
			error: (error) => {
				alert(`Failed to save note: ${error}`);
				this.saving = false;
			},
		});
	}

	deleteNote() {
		if (this.note.id === null) {
			return;
		}

		this.deleting = true;

		console.log(`Delete note '${this.note.title}'`);

		this.editorService.deleteNote(this.note.id)
			.subscribe({
				next: () => {
					this.deleting = false;
				},
				error: (error) => {
					alert(`Failed to delete note: ${error}`);
					this.deleting = false;
				},
			});
	}
}
