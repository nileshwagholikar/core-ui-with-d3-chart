import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
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
    this.selectedCellDataList = [];

    // generate data for selected Cell
    this.batteryDataList.forEach(batteryData => {
      const cellData: ICellData = {
        cellDate: batteryData['date'],
        cellValue: batteryData[this.selectedBatteryCell],
      };
      this.selectedCellDataList.push(cellData);
    });

    // Call generate chart function
    this.generateD3Chart(this.selectedCellDataList);
  }

  generateD3Chart(data) {
    // if no data is passed it will return empty. No error is thrown
    if (!data) {
      return;
    }

    // set Graph design parameters
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = document.querySelector('.chart-wrapper').clientWidth - margin.left - margin.right // Use the window's width
    , height = window.innerHeight - margin.top - margin.bottom - 350; // Use the window's height

    // Loop through data to Convert cellDate data to date
    data.forEach(function(d) {
      d.cellDate = new Date(d.cellDate.replace(/-/g, '/'));
    });

    // set the ranges for x axis and y axis
    const datesArray = data.map(d => d.cellDate);
    const minDate = Math.min(...datesArray);
    const maxDate = Math.max(...datesArray);

    const x = d3.scaleTime()
              .domain([minDate, maxDate]) // input
              .range([0, width]);

    const valuesArray = data.map(d => d.cellValue);
    const minCellVal = new Date((Math.min(...valuesArray)).toString().replace(/-/g, '/'));
    const maxCellVal = new Date((Math.max(...valuesArray)).toString().replace(/-/g, '/'));
    const y = d3.scaleLinear()
              .domain([minCellVal, maxCellVal]) // input
              .range([height, 0]);

    // Remove Old SVG to generate new SVG
    d3.select('.chart-wrapper').select('svg').remove();

    // Add the new SVG
    const svg = d3.select('.chart-wrapper')
    .data(data)
    .append('svg')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append('g')
    .attr('transform', `translate(${ margin.left }, ${ margin.top })`);

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) {
                                return d.cellDate;
                              }));
    y.domain([0, d3.max(data, function(d) {
                                return d.cellValue;
                              })]);

    // Add Line Graph
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('class', 'line')
        .attr('d', d3.line()
          .x(function(d) { return x(d.cellDate)})
          .y(function(d) { return y(d.cellValue)})
        );

    // Add the X Axis
    svg.append('g')
        .attr('transform', `translate(0,${ height })`)
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
        .call(d3.axisLeft(y));
  }
}
