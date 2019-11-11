import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { DaysService } from 'src/app/shared/days/days.service';
import { MachineService } from 'src/app/machine/machine.service';
import { ProductionService } from '../production.service';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { Production } from '../production.model';

@Component({
  selector: 'app-production-by-machine',
  templateUrl: './production-by-machine.component.html',
  styleUrls: ['./production-by-machine.component.css']
})
export class ProductionByMachineComponent implements OnInit {
  fullMach: Machine[] = [];
  prodLots: Production[][] = [];
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
  date = new Date();
  month = this.date.getMonth();


  constructor(
    public auth: AuthService,
    private machServ: MachineService,
    private proServ: ProductionService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.setProduction();
  }


  setProduction(){
    this.machServ.fetchMachinesByType()
    .subscribe((machines: Machine[]) => {
      this.fullMach = [];
      let used = 0;
      machines.forEach((mach)=>{
        used += 1;
        if (mach.currentOp !== "None"){
          this.fullMach.push(mach);
        }
        if (used == machines.length){
          this.fullMach.forEach(machine=>{
            let search = "mach=" + this.auth.splitJoin(machine.machine) 
              + "&job=" + machine.currentJob 
              + "&op=" + this.opServ.slashToDash(machine.currentOp);
            this.proServ.fetchProduction(search).subscribe(prod=>{
              this.prodLots.push(prod);
            })
          })
        }
      });
    });
  }

}