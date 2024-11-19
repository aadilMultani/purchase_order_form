import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  purchaseOrderForm!: FormGroup;

  jobTitleList: any = [];
  reqId: any = [];
  clientList: any = [
    {
      id: 1,
      name: 'Collabera - Collabera Inc',
      talentsDetails: [
        {
          id: 1,
          jobTitle: 'Application Development',
          jobId: 'OWNAI_234',
          talentsName: [
            {
              id: 1,
              name: 'Monika Goyal'
            }
          ]
        },
        {
          id: 1,
          jobTitle: 'Bussiness Administrator',
          jobId: 'CKL_230984',
          talentsName: [
            {
              id: 1,
              name: 'John Doe'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'OwnAI',
      talentsDetails: [
        {
          id: 1,
          jobTitle: 'Web Development',
          jobId: 'OAI_34234',
          talentsName: [
            {
              id: 1,
              name: 'Aman Chauhan'
            }
          ]
        }
      ]
    }
  ]

  currencyList: any = [
    {
      id: 1,
      name: 'USD - Dollars ($)'
    },
    {
      id: 2,
      name: 'INR - Rupees (₹)'
    }
  ]

  constructor(private fb: FormBuilder) {
    this.purchaseOrderForm = this.fb.group({
      clientName: ['', Validators.required],
      purchaseOrderType: ['', Validators.required],
      purchaseOrderNo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+]*$/)]],
      receivedOn: ['', Validators.required],
      receivedFrom: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),
      poStartDate: ['', Validators.required],
      poEndDate: [{ value: '', disabled: true }, Validators.required],
      budget: ['', [Validators.required, Validators.maxLength(5), Validators.pattern(/^\d+$/)]],
      currency: [this.currencyList[0].name, [Validators.required]],

      talents: this.fb.array([
        this.fb.group({
          jobTitle: [''],
          reqId: [{ value: '', disabled: true }],
          contractDuration: [''],
          billRate: [''],
          billRateCurrency: [this.currencyList[0].name],
          stdTime: [''],
          stdTimeCurrency: [this.currencyList[0].name],
          ovrTimeBR: [''],
          ovrTimeBRCurrency: [this.currencyList[0].name],
        })
      ])
    });
  }

  ngOnInit() {
    // Subscribe to changes in the poStartDate field
    this.purchaseOrderForm.get('poStartDate')?.valueChanges.subscribe(startDate => {
      if (startDate) {
        this.purchaseOrderForm.get('poEndDate')?.enable(); // Enable poEndDate
      } else {
        this.purchaseOrderForm.get('poEndDate')?.disable(); // Disable poEndDate if no start date
      }
    });
  }

  get talents(): FormArray {
    return this.purchaseOrderForm.get('talents') as FormArray;
  }

  // onChange Handler For Client 
  onClientChange(event: any) {
    this.jobTitleList = this.clientList.filter((value: any) => value.name === event.target.value);
  }

  // onChange Handler For job
  onJobTitleChange(event: any) {
    this.reqId = this.jobTitleList[0]?.talentsDetails.filter((value: any) => value.jobTitle === event.target.value);
  }

  talentSelection(event: any, index: number) {
    const talentGroup = this.talents.at(index); 
    const isChecked = event.target.checked;

    // Enable or disable all fields in the talent group based on the checkbox state
    if (isChecked) {
      talentGroup.get('contractDuration')?.disable();
      talentGroup.get('billRate')?.disable();
      talentGroup.get('billRateCurrency')?.disable();
      talentGroup.get('stdTime')?.disable();
      talentGroup.get('stdTimeCurrency')?.disable();
      talentGroup.get('ovrTimeBR')?.disable();
      talentGroup.get('ovrTimeBRCurrency')?.disable();
    } else {
      talentGroup.get('contractDuration')?.enable();
      talentGroup.get('billRate')?.enable();
      talentGroup.get('billRateCurrency')?.enable();
      talentGroup.get('stdTime')?.enable();
      talentGroup.get('stdTimeCurrency')?.enable();
      talentGroup.get('ovrTimeBR')?.enable();
      talentGroup.get('ovrTimeBRCurrency')?.enable();
    }
  }

  // click event for addTalent 
  addTalent() {
    const talentGroup = this.fb.group({
      jobTitle: ['', Validators.required],
      reqId: [{ value: '', disabled: true }],
      contractDuration: ['', Validators.required],
      billRate: ['', Validators.required],
      billRateCurrency: ['', Validators.required],
      stdTime: ['', Validators.required],
      stdTimeCurrency: ['', Validators.required],
      ovrTimeBR: ['', Validators.required],
      ovrTimeBRCurrency: ['', Validators.required],
    });
    this.talents.push(talentGroup);
  }

  // Method to remove a talent form group
  removeTalent(index: number) {
    this.talents.removeAt(index);
  }

  onSubmit() {
    if (this.purchaseOrderForm.valid) {
      console.log('this.purchaseOrderForm.value >>',this.purchaseOrderForm.value);
      this.purchaseOrderForm?.disable();
    }
  }

  onReset() {
    this.purchaseOrderForm.reset();
    this.purchaseOrderForm?.enable();
  }
}
