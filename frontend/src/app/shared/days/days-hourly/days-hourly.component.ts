import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HourlyService } from 'src/app/hourly/hourly.service';
import { Hourly } from 'src/app/hourly/hourly.model';
import { ActivatedRoute, Params } from '@angular/router';
import { DaysService } from '../days.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MachineService } from 'src/app/machine/machine.service';
import { Machine } from 'src/app/machine/machine.model';

@Component({
  selector: 'app-days-hourly',
  templateUrl: './days-hourly.component.html',
  styleUrls: ['./days-hourly.component.css']
})
export class DaysHourlyComponent implements OnInit, OnDestroy {
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  subscriptions: Subscription[] = [];
  searchHold = [];
  date = '';
  isFetching = false;
  isError=false;
  error = '';
  isJob = [];
  machines: Machine[];

  constructor(
    private route: ActivatedRoute,
    private hourServ: HourlyService,
    private dayServ: DaysService,
    private auth: AuthService,
    private mach: MachineService
    ) { }

  ngOnInit() {
    this.subscriptions.push(this.hourServ.hourlyChanged.subscribe(()=>{
      setTimeout(()=>{this.getMachines()},50)}
    ))
    this.auth.hideButton(0)
    this.subscriptions.push(
      this.route.parent.params.subscribe(
        (params: Params) =>{
          this.dayServ.month = params['month'];
          this.dayServ.today = params['day'];
          this.dayServ.year = params['year'];
          this.searchHold.push(this.dayServ.year);
          this.dayServ.day = new Date(this.dayServ.year, +this.dayServ.month-1, +this.dayServ.today).getDay()
          this.dayServ.stringMonth = ""+this.dayServ.month;
          if (this.dayServ.month < 10 && this.dayServ.stringMonth.length <2){
            this.dayServ.stringMonth = "0" + this.dayServ.month;
          }
          this.searchHold.push(this.dayServ.stringMonth);
          if (+this.dayServ.today < 10 && this.dayServ.today.length <2){
            this.dayServ.today = "0" + this.dayServ.today;
          }
          this.searchHold.push(this.dayServ.today);
          this.date = this.searchHold.join("-");
          this.getMachines();
        }
      )
    );
  }

  quickInput(index){
    this.hourServ.jobNumber = this.machines[index].currentJob;
    this.hourServ.opNumber = this.machines[index].currentOp;
    this.hourServ.machine = this.machines[index];
    this.hourServ.quick[index] = true;
  }

  quickPlus(index){
    this.isJob[index] = true
    this.quickInput(index);
  }

  getMachines(){
    this.subscriptions.push(this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.isJob = [];
      this.isJob.push(false);
      this.hourServ.quick = [];
      for (let i in machines){
        this.hourServ.quick.push(false)  
      }
      this.machines = machines;
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
  }


  ngOnDestroy(){
    this.auth.showButton(0)
  }

}