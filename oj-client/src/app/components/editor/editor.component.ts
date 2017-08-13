import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CollaborationService } from '../../services/collaboration.service';

declare const ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  editor: any;
  languages: string[] = ['Java', 'Python'];
  language: string = 'Java';

  sessionId: string;

  output: string = '';

  defaultContent = {
    'Java': `class Example {
    public static void main(String[] args) {
        //type your java code here
      }
    }`,
    'Python': `class Example:
    def example():
      # Write your Python code here`
  };

  constructor(private collaboration: CollaborationService,
              private route: ActivatedRoute,
              @Inject('data') private data) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.sessionId = params['id'];

      this.initEditor();
    });
    
  }

  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();

    document.getElementsByTagName('textarea')[0].focus();

    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    //register change callback
    this.editor.on('change', e => {
      console.log('editor changed' + JSON.stringify(e));
      if (e != this.editor.lastAppliedChange) {
        this.collaboration.change(JSON.stringify(e));
      }
    });

    //cursor movement
    this.editor.getSession().getSelection().on('changeCursor', () => {
      const cursor = this.editor.getSession().getSelection().getCursor();
      console.log('cursor move', JSON.stringify(cursor));
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });

    this.collaboration.restoreBuffer();
  }



  setLanguage(language: string): void {
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void {
    console.log('resseting langauge');
    this.editor.getSession().setMode(`ace/mode/${this.language.toLowerCase()}`);
    this.editor.setValue(this.defaultContent[this.language]);

    this.output = '';
  }

  submit() {
    this.output = '';

    const userCodes = this.editor.getValue();
    //console.log(userCode);

    const codes = {
      userCodes: userCodes,
      lang: this.language.toLocaleLowerCase()
    };

    this.data.buildAndRun(codes)
      .then(res => this.output = res.text);
  }

}
