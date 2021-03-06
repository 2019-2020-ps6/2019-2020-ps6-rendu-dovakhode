import {Component, Injectable, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import { QuizService } from '../../../services/quiz.service';
import { Quiz } from '../../../models/quiz.model';
import {difficulte, theme} from '../../../models/theme.models';
import {DEFAULT_QUIZ} from '../../../mocks/quiz-list.mock';
import {MatDialog} from '@angular/material';
import {environment} from '../../../environments/environment';
import {MatDialogRef} from '@angular/material/dialog';
import {QuestionAddComponent} from '../../questions/question-add/question-add.component';
import {EditQuestionComponent} from '../../questions/edit-question/edit-question.component';
import {Question} from '../../../models/question.model';
import {ThemeServices} from '../../../services/theme.services';
import {Subscription} from 'rxjs';
import {SubThemeListComponent} from '../../subThemes/sub-theme-list/sub-theme-list.component';
import {ThemeListComponent} from '../../themes/theme-list/theme-list.component';
import {SubthemeService} from '../../../services/subtheme.service';
import {Subtheme} from '../../../models/subtheme.model';
import {Theme} from '../../../models/themes.model';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-add.component.html',
  styleUrls: ['./quiz-add.component.scss']
})

export class QuizAddComponent implements OnInit {
  public idTheme: any;
  public idPatient: number;

  constructor(public dialogRef: MatDialogRef<QuizAddComponent>,
              public dialog: MatDialog,
              public formBuilder: FormBuilder,
              public quizService: QuizService,
              public themeService: ThemeServices,
              public subThemeService: SubthemeService,
              public activatedRoute: ActivatedRoute,
              private location: Location) {

  }
  // Form creation
  // You can also question-add validators to your inputs such as required, maxlength or even create your own validator!
  // More information: https://angular.io/guide/reactive-forms#simple-form-validation
  // Advanced validation: https://angular.io/guide/form-validation#reactive-form-validation
  // Advanced validation: https://angular.io/guide/form-validation#reactive-form-validation
  get questions() {
    return this.quizForm.get('questions') as FormArray;
  }
  get theme() {
    return this.quizForm.get('theme') as FormArray;
  }
  get subTheme() {
    return this.quizForm.get('subTheme') as FormArray;
  }
  get label() {
    return this.quizForm.get('label') as FormArray;
  }

  // Note: We are using here ReactiveForms to create our form. Be careful when you look for some documentation to
  // avoid TemplateDrivenForm (another type of form)

  /**
   * QuizForm: Object which manages the form in our component.
   * More information about Reactive Forms: https://angular.io/guide/reactive-forms#step-1-creating-a-formgroup-instance
   */
  @Input() quiz: Quiz = null;
 public defaultId = 0;
  public quizForm: FormGroup;
  subscription: Subscription;
  public themesValues: Theme[];
  public subThemesValues: Subtheme[];
  public difficultiesValues = Object.values(difficulte);
  private questionDialogOpened = false;
  public imagePreview: string;
  files: any = [];


  ngOnInit() {
    this.quiz = new Quiz();
    isNaN(this.activatedRoute.snapshot.params.idPatient) ?
      this.idPatient = this.defaultId : this.idPatient = +this.activatedRoute.snapshot.params.idPatient;
    console.log(this.idPatient);
    this.initializeTheForm();
    this.getAllTheme();
    this.subscription = this.subThemeService.subThemesSubject.subscribe((subthemes) => {
       this.subThemesValues = subthemes;
     });

  }

  private getAllTheme() {
    this.themeService.getTheme().subscribe((themes) => {
      this.themesValues = themes;
    });
  }

  getThemId(label: string ) {
    for (let i = 0 ; i <= this.themesValues.length; i++) {
      if (this.themesValues[i].label === label) {
        return this.themesValues[i].id;
      }
    }
  }

  initializeTheForm() {
    this.quizForm = this.quizzFormInitializer();
  }
  quizzFormInitializer() {
    return this.formBuilder.group({
      id: [DEFAULT_QUIZ.id],
      label: [ DEFAULT_QUIZ.label , [ Validators.required, Validators.minLength(5)]],
      theme: [ DEFAULT_QUIZ.theme, [ Validators.required, Validators.minLength(3)]],
      subTheme: [null],
      difficulty: [null],
      questions: this.formBuilder.array([]),
      image: [null]
    });
  }
  private createQuestionByData(question) {
    return this.formBuilder.group({
      id: question.id,
      label: question.label,
      answers: this.formBuilder.array(question.answers),
      image: question.image,
      tmpUrl: question.tmpUrl,
      quizId: 0
    });
  }

  getSubTheme(value: Theme) {
    this.idTheme = value.id;
    this.subThemeService.getSubTheme(this.idTheme).subscribe((subThemes) => {
      this.subThemeService.Subthemes = subThemes;
      this.subThemeService.emitSubThemes(); });
  }
  addQuiz() {
    // We retrieve here the quiz object from the quizForm and we cast the type "as Quiz".
    if (this.quizForm.invalid) {
      alert(environment.formFieldsRequired);
      this.quizForm.markAllAsTouched();
      return;
    }
    if (this.questions.length === 0) {
      alert('Veuillez ajouter au moins une question');
      return;
    }
    const quizToCreate: Quiz = this.quizForm.getRawValue() as Quiz;
    quizToCreate.idPatient = this.idPatient;
    // quizToCreate.question = [];
    if (quizToCreate.difficulty == null) {
      quizToCreate.difficulty = difficulte.Normale;
    }
    quizToCreate.dateCreation = new Date();
    quizToCreate.dateModification = quizToCreate.dateCreation;
    // Do you need to log your object here in your class? Uncomment the code below
    // and open your console in your browser by pressing F12 and choose the tab "Console".
    // You will see your quiz object when you click on the create button.
    // console.log('Add quiz: ', quizToCreate);

    // Now, question-add your quiz in the list!

    quizToCreate.theme = this.quizForm.get('theme').value.label;
    if (this.quizForm.get('subTheme').value != null) {
    quizToCreate.subTheme = this.quizForm.get('subTheme').value.label;
    }

    this.quizService.addQuiz(quizToCreate, this.quizForm.get('image').value, this.questions.value).subscribe((quiz) => {
      if (quiz !== undefined) {
        this.quiz = quiz;
        this.dialogRef.close(quiz);
        this.initializeTheForm();
      }
    }); // getQuiz().push(quizToCreate);
    /*this.snackBar.openFromComponent(SnackModificationComponent, {
     duration: 1000,
     data: 'Quizz created succesfuly!'
   });*/
  }


  quizFormValue() {
    return Quiz.quizFormValues(this.quizForm);
  }

  addQuestion() {
    this.questionDialogOpened = true;
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(QuestionAddComponent, {
      width: '60%',
      height: '70%',
      data: this.quiz ? this.quiz.questions : DEFAULT_QUIZ.questions
    });
    dialogRef.afterClosed().subscribe(questionForm => {
      this.questionDialogOpened = false;
      // if (questionImage.question && questionImage.question.label) {
      if (questionForm) {
        this.questions.push(this.createQuestionByData(questionForm)); }
    });
  }
  deleteQuestion(deleteState: boolean) {
    /* if(deleteState){

    } */
  }

  getLabelErrorMessage() {
    if (this.label.hasError('required')) {
      return environment.formFieldRequired;
    }
    return this.label.hasError('minLenght') ? 'Veuillez entrer 5 caractère au minimum' : '';
  }
  getThemeErrorMessage() {
    if (this.theme.hasError('required')) {
      return environment.formSelectRequired;
    }
    return this.theme.hasError('minLenght') ? 'Veuillez entrer 3 caractère au minimum' : '';
  }

  deleteImage() {
    this.quizForm.get('image').reset();
    this.imagePreview = null;
  }

  deletedQuestion($event: boolean, index: number) {
    if ($event) {
      this.questions.removeAt(index);
    }
  }

  editQuestion($event: boolean, i: number) {
    const dialogRef = this.dialog.open(EditQuestionComponent, {
      width: '950px',
      maxHeight: '500px',
      data: this.questions.at(i).value
    });
    dialogRef.afterClosed().subscribe(response => {
      this.questionDialogOpened = false;
      if (response != null) {
        if (response.question && response.question.label) {
          if (response.question && response.question.label) {
            this.questions.at(i).patchValue({...Question.questionFormValues(this.createQuestionByData( response.question))});
          }
        }
      }

    });
  }

  deleteAttachment(index) {
    this.files.splice(index, 1);
  }

  manageTheme() {
    const dialogRef = this.dialog.open(ThemeListComponent, {
      width: '850px',
      disableClose: true,
      maxHeight: '400px',
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        if (this.themesValues.length !== response.length) {
          this.theme.setValue(response[response.length - 1]);
          this.themesValues = response; }
        this.subThemesValues = [];
      }
    });
  }
  manageSubTheme() {
    if (this.theme.value != null) {
      const dialogRef = this.dialog.open(SubThemeListComponent, {
        width: '850px',
        maxHeight: '400px',
        disableClose: true,
        data: this.theme.value.id
      });
      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          if (this.subThemesValues.length !== response.length) {
            this.subTheme.setValue(response[response.length - 1]);
            this.subThemesValues = response ; }
        }
      });
    } else { alert('Veuillez sélectionner un thème!'); }

  }

  back() {
    this.location.back();
  }
}

