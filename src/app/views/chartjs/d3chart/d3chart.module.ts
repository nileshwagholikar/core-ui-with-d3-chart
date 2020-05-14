import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { D3ChartComponent } from './d3chart.component';
import { D3LineChartComponent } from './d3-line-chart.component';
import { D3DataService } from './d3-data.service';

@NgModule({
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [D3DataService],
  declarations: [D3ChartComponent, D3LineChartComponent],
})
export class D3ChartModule {}
