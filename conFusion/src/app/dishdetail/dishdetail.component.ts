import { Component, OnInit, Input, ViewChild, ElementRef, Inject} from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../menu/shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Comment } from '../menu/shared/comment';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display: block;'
  },
  animations:[
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  public BaseURL;
  errMess: string;
  dish: Dish;
  dishIds: string[];
  prev:string;
  next:string;

  currentdate:Date = new Date();
  commentForm: FormGroup;
  comment: Comment;
  dishCopy: Dish;
  visibility = 'shown';

  newComment: {'author','comment','rating'};
  @ViewChild('fform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment': '',
  };

  validationComments = {
    'author':{
      'required': 'Author is required.',
      'minlength': 'Author must be at least 3 characters long.',
      'maxlength': 'Author cannot be more than 25 characters long.'
    },
    'comment':{
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 3 characters long.',
      'maxlength': 'Comment cannot be more than 255 characters long.'
    }
  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') BaseURL)
    { 
      this.BaseURL = BaseURL;
      this.createForm(); 
    }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; }, errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      //date: string;
    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any){
    if(!this.commentForm){ return;}
    const form = this.commentForm;
    this.comment = this.commentForm.value;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        // clear previous error message (if any)
        this.formErrors[field] ='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationComments[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy).subscribe(dish => {
      this.dish = dish; this.dishCopy = dish;
      errmess => { this.dish = null ; this.dishCopy = null; this.errMess = <any>errmess};
    });
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      rating: 5,
      coment: ''
    })
  }
}
