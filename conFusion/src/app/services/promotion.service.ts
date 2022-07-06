import { Injectable } from '@angular/core';
import { Promotion } from '../menu/shared/promotion';
import { PROMOTIONS } from '../menu/shared/promotions';
import { of , observable, Observable } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../menu/shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient, private processHTTPMsgService: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]>{
    return this.http.get<Promotion[]>(baseURL + 'promotions')
    .pipe(catchError(this.processHTTPMsgService.handleError));
    //return of (PROMOTIONS).pipe(delay(2000));
  }

  getPromotion(id: string): Observable<Promotion>{
    return this.http.get<Promotion>(baseURL + 'promotion/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError));

    //return of (PROMOTIONS.filter((promo) => promo.id === id)[0]).pipe(delay(2000));
  }

  getFeaturedPromotion(): Observable<Promotion>{

    return this.http.get<Promotion>(baseURL + 'promotions?featured=true')
    .pipe(map(PROMOTIONS => PROMOTIONS[0])).pipe(catchError(this.processHTTPMsgService.handleError));
    //return of (PROMOTIONS.filter((promo) => promo.featured)[0]).pipe(delay(2000));
    /*
        return this.http.get<Dish[]>(baseURL + 'dishes?featured=true')
    .pipe(map(dishes => dishes[0])).pipe(catchError(this.processHTTPMsgService.handleError));
    */
  }
}
