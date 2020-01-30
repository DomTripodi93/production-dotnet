import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Operation } from 'src/app/job/job-ops/operation.model';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from '../operation.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MachineService } from 'src/app/machine/machine.service';

@Component({
  selector: 'app-job-ops-edit',
  templateUrl: './job-ops-edit.component.html',
  styleUrls: ['./job-ops-edit.component.css']
})
export class JobOpsEditComponent implements OnInit {
  @Input() search: string;
  @Input() op: Operation;
  editOpForm: FormGroup;
  operation: Operation;
  canInput = false;
  isError = false;
  error = "";
  machines: Machine[] = [];
  
  constructor(
    private operationServ: OpService,
    private mach: MachineService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.getMachines();
  }

  getMachines(){
    this.mach.fetchMachinesByType()
    .subscribe(machines => {
      this.machines = machines;
      this.search = this.operationServ.slashToDash(this.search);
      this.initForm();
    });
  }

  private initForm() {
    this.editOpForm = new FormGroup({
      'cycleTime': new FormControl(this.op.cycleTime),
      'machine': new FormControl(this.op.machine)
    });
  }

  onSubmit(){
    this.editOp(this.editOpForm.value);
  }

  editOp(data: Operation) {
    this.isError = false;
    this.operationServ.changeOp(data, this.search).subscribe(()=>{
      this.onCancel();
    });
  }

  onCancel(){
    this.operationServ.opsChanged.next();
  }

}
