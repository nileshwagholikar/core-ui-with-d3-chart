import { Component, OnInit } from '@angular/core';
import { D3DataService } from './d3-data.service';
import ICellData from './ICellData';
import IBatteryData from './IBatteryData';

@Component({
  templateUrl: 'd3chart.component.html',
})
export class D3ChartComponent implements OnInit {
  selectedCellDataList: ICellData[];
  batteryDataList: IBatteryData[];
  batteryCellsList: any[];
  selectedBatteryCell: any;

  constructor(private _D3DataService: D3DataService) {}

  ngOnInit(): void {
    // Fetch data on initializing the component
    this.getBatteryData();
  }

  getBatteryData() {
    this._D3DataService.getBatteryData().subscribe((batteryDataList) => {
      this.batteryDataList = batteryDataList;

      // Extract Keys for generating dropdown list
      this.batteryCellsList = Object.keys(batteryDataList[0]).reduce((accumulator, key) => {
          if (key !== 'date') {
            accumulator.push(key);
          }
          return accumulator;
      }, []);

      // if keys are not empty then pass key value to generate graph
      if (this.batteryCellsList.length) {
        this.onCellSelect(this.batteryCellsList[0]);
      }
    });
  }

  onCellSelect(value: string) {
    this.selectedBatteryCell = value;

    // Empty graph data
    this.selectedCellDataList = [];

    // generate data for selected Cell
    this.batteryDataList.forEach(batteryData => {
      const cellData: ICellData = {
        cellDate: batteryData['date'],
        cellValue: batteryData[this.selectedBatteryCell],
      };

      // Add to graph data
      this.selectedCellDataList.push(cellData);
    });
  }
}
