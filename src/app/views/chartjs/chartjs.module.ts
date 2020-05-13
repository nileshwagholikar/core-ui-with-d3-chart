import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { D3ChartModule } from './d3chart/d3chart.module';

import { ChartJSComponent } from './chartjs.component';
import { ChartJSRoutingModule } from './chartjs-routing.module';

@NgModule({
  imports: [
    ChartJSRoutingModule,
    ChartsModule,
    D3ChartModule
  ],
  declarations: [ ChartJSComponent ]
})
export class ChartJSModule { }
