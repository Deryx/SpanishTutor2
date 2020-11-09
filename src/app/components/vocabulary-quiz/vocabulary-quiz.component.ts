import { Component } from '@angular/core';
import { VocabularyService } from '../../services/vocabulary.service';
import { RandomNumberGeneratorService } from '../../services/random-number-generator.service';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { ApolloModule, Apollo } from 'apollo-angular';

@Component({
  selector: 'app-vocabulary-quiz',
  templateUrl: './vocabulary-quiz.component.html',
  styleUrls: ['./vocabulary-quiz.component.css']
})

export class VocabularyQuizComponent {
  showOverlay: boolean = true;
  showVocabularyOverlay: boolean = true;
  showForm: boolean = false;
  showReport: boolean = false;

  selectedCategory: string;
  dictionary: any;
  numberQuestions: number = 0;
  word: string = '';
  answer: string;
  quizAnswer: string;
  answers: string[] = [];
  questionSet: number[] = [];
  answerSet: number[] = [];
  currentQuestion = 0;
  numberCorrect = 0;

  report: any = {};
  responses: any = [];

  private queryDictionary: Subscription;

  constructor( private vs: VocabularyService, private apollo: Apollo, private randomNumberService: RandomNumberGeneratorService, private router: Router ) {}

  getOverlayData(data) {
    if(!data.isVisible) {
      this.showOverlay = data.isVisible;
      this.showVocabularyOverlay = data.isVisible;
      this.showForm = true;
      this.selectedCategory = data.category;
      this.numberQuestions = data.numberQuestions;

      this.createQuestionSet();
    }
  }

  createQuestionSet = () => {
    const categoryObject = {
      query: this.vs.Category,
      variables: {
        category: parseInt( this.selectedCategory )
      }
    };
    const dictionaryObject = {
      query: this.vs.Dictionary
    }
    const queryObject = ( this.selectedCategory ) ? categoryObject : dictionaryObject;
    this.queryDictionary = this.apollo.watchQuery(queryObject)
    .valueChanges
    .subscribe( result => {
      const dictionaryData = JSON.parse( JSON.stringify(result.data) );
      this.dictionary = ( this.selectedCategory ) ? dictionaryData.category : dictionaryData.dictionary;

      this.randomNumberService.generateRandomNumberArray( this.numberQuestions, this.dictionary.length, this.questionSet );
      this.getCurrentQuestion( this.currentQuestion );
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  getCurrentQuestion( question: number ) {
    let currentWord = this.questionSet[question];
    this.word = this.dictionary[currentWord].word;
    this.answer = this.dictionary[currentWord].translation;
    this.answerSet = [];
    this.answerSet.push( currentWord );
    this.randomNumberService.generateRandomNumberArray(undefined, this.dictionary.length, this.answerSet );
    this.answers = this.answerSet.map( (answer) => this.dictionary[answer].translation );
    this.answers.sort();
  }

  getNextQuestion() {
    let numberQuestions = this.questionSet.length;
    if( this.currentQuestion < numberQuestions ) {
      this.currentQuestion++;
      this.getCurrentQuestion( this.currentQuestion );
    }
  }

  getAnswer() {
    const responseObj: any = {};
    let score: number = 0;

    let response = this.quizAnswer;
    if(response === this.answer) this.numberCorrect++;

    responseObj.question = this.word;
    responseObj.answer = this.answer;
    responseObj.response = response;
    this.responses.push( responseObj );

    if(this.currentQuestion === this.numberQuestions - 1) {
      this.showForm = false;
      this.showReport = true;
      this.showOverlay = true;
      score = Math.round( ( this.numberCorrect / this.numberQuestions ) * 100 ); 

      this.report.title = 'Vocabulary Quiz Report';
      this.report.scoreMessage = 'You scored ' + score + '%';
      this.report.headings = ['word', 'answer', 'response'];
      this.report.responses = this.responses;
    } else {
      this.quizAnswer = '';
      this.getNextQuestion();
    }
  }

  reset() {
    this.answer = '';
    this.currentQuestion = 0;
    this.numberCorrect = 0;
    this.getNextQuestion();
  }

  quit() {
    this.router.navigateByUrl('');
  }
}
