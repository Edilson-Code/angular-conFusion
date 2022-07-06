import { Injectable } from '@angular/core';
import { Feedback } from '../menu/shared/feedback';
import { of, Observable } from 'rxjs';
import { delay, map, catchError, timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../menu/shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }

  postFeedback(Feedback): Observable<Feedback>{
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
    return this.http.post<Feedback>(baseURL + 'feedback' , Feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError))
  }

  getFeedback(Feedback){
    return this.http.get<Feedback>(baseURL + 'feedback')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
