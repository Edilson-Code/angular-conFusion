import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from './shared/dish';
import { DishService } from '../services/dish.service';
import { flyInOut } from '../animations/app.animation';
import { style } from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display: block;'
  },
  animations:[
    flyInOut()
  ]
})

export class MenuComponent implements OnInit {

  dishes: Dish[];
  errMess: string;
  //selectedDish: Dish;

  public BaseURL;

  constructor(private dishService: DishService, @Inject('BaseURL') BaseURL) {this.BaseURL = BaseURL}

  ngOnInit(): void {
    this.dishService.getDishes().subscribe((dishes) => this.dishes = dishes, errmess => this.errMess = <any>errmess);
  }

  /*onSelect(dish: Dish){
    this.selectedDish = dish;
  }*/

}
