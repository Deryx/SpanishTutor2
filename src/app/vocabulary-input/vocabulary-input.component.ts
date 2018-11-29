import { Component, OnInit } from '@angular/core';
import { VocabularyService } from '../vocabulary.service';
import { Vocabulary } from '../vocabulary';
import { VocabularyCategories } from '../vocabulary-categories'
import { VocabularyGender } from '../vocabulary-gender'

@Component({
  selector: 'app-vocabulary-input',
  templateUrl: './vocabulary-input.component.html',
  styleUrls: ['./vocabulary-input.component.css']
})
export class VocabularyInputComponent implements OnInit {
  category = '';
  word = '';
  translation = '';
  gender =  '';
  image = '';
  pronunciation = '';

  categories = new VocabularyCategories();
  genders = new VocabularyGender();

  vocabulary = new Vocabulary();

  constructor( private words: VocabularyService ){}

  ngOnInit(){

    let categorySelect = document.getElementById( 'category' );
    let categoryOptions = this.categories.getCategories();
    categoryOptions.sort();

    let firstOption = document.createElement( 'option' );
    firstOption.value = '';
    firstOption.disabled = true;
    firstOption.selected = true;
    firstOption.innerHTML = 'SELECT A CATEGORY ...';
    categorySelect.appendChild( firstOption );

    for(let i = 0; i < categoryOptions.length; i++) {
      let category = categoryOptions[i];

      let option = document.createElement( 'option' );
      option.value = category;
      option.innerHTML = category.charAt(0).toUpperCase() + category.slice(1);

      categorySelect.appendChild( option );
    }

    let lastOption = document.createElement( 'option' );
    lastOption.value = 'other';
    lastOption.innerHTML = 'Other';

    categorySelect.appendChild( lastOption );

    let genderSelect = document.getElementById( 'gender' );
    let genderOptions = this.genders.getGenders();

    let genderFirstOption = document.createElement( 'option' );
    genderFirstOption.value = '';
    genderFirstOption.disabled = true;
    genderFirstOption.selected = true;
    genderFirstOption.innerHTML = 'SELECT A GENDER ...';
    genderSelect.appendChild( genderFirstOption );

    for(let i = 0; i < genderOptions.length; i++) {
      let gender = genderOptions[i];

      let option = document.createElement( 'option' );
      option.value = gender;
      option.innerHTML = gender.charAt(0).toUpperCase() + gender.slice(1);

      genderSelect.appendChild( option );
    }
  }

  resetForm(){
    this.category = '';
    this.word = '';
    this.translation = '';
    this.gender =  '';
    this.image = '';
    this.pronunciation = '';
  }

  onSubmit(){
    this.vocabulary.setCategory( this.category );
    this.vocabulary.setWord( this.word );
    this.vocabulary.setTranslation( this.translation );
    this.vocabulary.setGender( this.gender );

    let image: any = this.image.match(/fakepath\\(.*)/);
    let folder = 'assets/images/';
    image = null || folder + image[1];

    this.vocabulary.setImage( image );
    this.vocabulary.setPronunciation( this.pronunciation );

    this.words.addWord( this.vocabulary )
      .subscribe();

    this.resetForm();
  }
}