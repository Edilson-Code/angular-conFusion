import { Component, OnInit, Inject } from '@angular/core';
import { Leader } from './leaders/Leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';
import { LEADERS } from './leaders/leaders';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display: block;'
  },
  animations:[
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  leadersErrMess: string;

  public BaseURL;
  constructor(private leaderService: LeaderService,
    @Inject('BaseURL') BaseURL) { this.BaseURL = BaseURL }

  ngOnInit(): void {
    this.leaderService.getLeaders().subscribe((leadership) => this.leaders = leadership, errmess => this.leadersErrMess = <any>errmess);
  }

}
