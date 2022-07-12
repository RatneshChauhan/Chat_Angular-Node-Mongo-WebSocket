// my-loader.component.ts
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.scss']
})
export class MyLoaderComponent implements OnInit {

  loading: boolean;

  constructor(private loaderService: LoaderService, private spinner: NgxSpinnerService) {

    this.loaderService.isLoading.subscribe((v) => {
      console.log(v);
      if(v)
      this.spinner.show();
      else
      this.spinner.hide();
      
      this.loading = v;
    });

  }
  ngOnInit() {
  }

}
