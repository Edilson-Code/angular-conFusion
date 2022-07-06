import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../menu/shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display: block;'
  },
  animations:[
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {
  public BaseURL;
  errMess: string;
  spinner = false;
  showFormTemp = false;
  
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;

  formTemp: Feedback;

  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname':{
      'required': 'First name is required.',
      'minlength': 'First name must be at least 3 characters long.',
      'maxlength': 'First name cannot be more than 25 characters long.'
    },
    'lastname':{
      'required': 'Last name is required.',
      'minlength': 'Last name must be at least 3 characters long.',
      'maxlength': 'Last name cannot be more than 25 characters long.'
    },
    'telnum':{
      'required': 'Tel. number is required.',
      'minlength': 'Tel. number must be 11 numbers',
      'maxlength': 'Tel. number must be 11 numbers',
      'pattern': 'Tel. number must contain only numbers.'
    },
    'email':{
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    }
  };
  
  constructor(private fb:FormBuilder,
    private feedbackService: FeedbackService,
    @Inject('BaseURL') BaseURL) {
    this.BaseURL = BaseURL;
    this.createForm();
  }
  
  ngOnInit(): void {
  }
  
  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern,Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); //(re)set form validation messages
  }

  onValueChanged(data?: any){
    if(!this.feedbackForm){ return;}
    const form = this.feedbackForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        // clear previous error message (if any)
        this.formErrors[field] ='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);

    this.formTemp = this.feedbackForm.value;
    console.log(this.formTemp);
    this.spinner = !this.spinner;
    setTimeout(() => {
      this.feedbackService.postFeedback(this.feedback).subscribe(feedback => {
        this.feedback = feedback;
        errmess => { this.feedback = null ; this.errMess = <any>errmess};
        this.spinner = !this.spinner;
        this.showFormTemp = !this.showFormTemp;
      });
    }, 2000);
    setTimeout(() => {
      this.showFormTemp = !this.showFormTemp;
    }, 5000);

    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }
}
