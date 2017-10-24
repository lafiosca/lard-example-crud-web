import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Rx';

import { EditorService } from '../editor.service';

@Component({
	selector: 'app-note-list',
	templateUrl: './note-list.component.html',
})
export class NoteListComponent implements OnInit, OnDestroy {
	private notesSub: Subscription;
	private noteSub: Subscription;

	private notes = null;
	private note = null;

	constructor(private editorService:EditorService) { }

	ngOnInit() {
		this.notesSub = this.editorService.getNotes()
			.subscribe((notes) => {
				this.notes = notes;
			});
		this.noteSub = this.editorService.getNote()
			.subscribe((note) => {
				this.note = note;
			});
	}

	ngOnDestroy() {
		this.notesSub.unsubscribe();
		this.noteSub.unsubscribe();
	}

	selectNote(noteId) {
		this.editorService.selectNote(noteId);
	}
}
