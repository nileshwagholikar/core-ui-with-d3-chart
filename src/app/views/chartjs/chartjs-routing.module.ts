import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartJSComponent } from './chartjs.component';
import { D3ChartComponent } from './d3chart/d3chart.component';

const routes: Routes = [
  {
    path: '',
    // component: ChartJSComponent,
    data: {
      title: 'Charts'
    },
    children: [
      {
        path: '',
        redirectTo: 'chartjs'
      },
      {
        path: 'chartjs',
        component: ChartJSComponent,
        data: {
          title: 'ChartsJS'
        }
      },
      {
        path: 'd3chart',
        component: D3ChartComponent,
        data: {
          title: 'D3 Chart'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartJSRoutingModule {}
