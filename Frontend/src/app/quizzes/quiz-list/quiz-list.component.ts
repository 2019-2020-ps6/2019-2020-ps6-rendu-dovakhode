import {Component, Input, OnInit} from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { Quiz } from '../../../models/quiz.model';
import { difficulteSearch, themeSearch} from '../../../models/theme.models';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {DEFAULT_QUIZ} from '../../../mocks/quiz-list.mock';

@Component({
  selector: ' app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {

  public quizList: Quiz[] = [];
  public themesValues = Object.values(themeSearch);
  public difficultiesValues = Object.values(difficulteSearch);
  public doQuiz;
  public idPatient: number;
  public inviteToCreateQuiz = null;
  public searchedQuiz: Quiz = DEFAULT_QUIZ;
  loading: boolean;
  constructor(private Activerouter: ActivatedRoute,
              private router: Router,
              private location: Location,
              public quizService: QuizService) {
    this.getAllQuiz();
  }

  ngOnInit() {
    this.doQuiz = (this.Activerouter.snapshot.params.do === 'true');
    this.idPatient = + (this.Activerouter.snapshot.params.idPatient);
    this.getAllQuiz();
  }
  getAllQuiz() {
    this.loading = true;
    this.quizService.getQuiz().subscribe((quiz) => {

      this.loading = false;
      if (!quiz) {
        // tslint:disable-next-line:max-line-length
        if (confirm('une erreur de chargement s\'est produite voulez-vous rééssayer?')) { this.getAllQuiz(); } else {alert('Veuillez conctater l\'administrateur'); return; }
      }

      this.quizList = quiz;
      this.inviteToCreateQuiz = this.quizList.length === 0 ;

      });
  }
  quizSelected(selected: boolean) {
  }
  deleteQuiz(comfirm: boolean, quiz: Quiz) {
    if (comfirm) {this.quizService.deleteQuiz(quiz).subscribe(() => {
      this.getAllQuiz();
    }); }
  }


  selectQuiz(quiz: Quiz) {
    if ( this.doQuiz) {
      this.router.navigate([ '/quiz-do/' + quiz.id + '/start' , { idPatient: this.idPatient}]);
    //  this.router.navigate(['/quiz-list', { do: true, idPatient: profil.id } ]);
    } else {
      this.router.navigateByUrl('/quiz-edit/' + quiz.id);
    }
  }

  col() {
    if (this.doQuiz) {
      return 9;
    } else {
      return 10;
    }
  }

  back() {
    if (this.doQuiz ) {
      if ( this.idPatient === 0 ) {
        this.router.navigateByUrl('/home-do-quiz' );
      } else {
        this.router.navigate(['/profil-list' , {do: true}]);
      }
    } else { this.location.back(); }
  }
}
