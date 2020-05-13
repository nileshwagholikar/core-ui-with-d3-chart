import { Component, OnInit } from "@angular/core";
import * as d3 from "d3";
import { D3DataService } from './d3-data.service';
import ICellData from './ICellData';
import IBatteryData from './IBatteryData';

@Component({
  templateUrl: "d3chart.component.html",
})
export class D3ChartComponent implements OnInit {
  selectedCellDataList: ICellData[];
  batteryDataList: IBatteryData[];
  batteryCellsList: any[] = ["C1","C2","C3"];
  selectedBatteryCell: any;

  constructor(private _D3DataService: D3DataService) {}

  ngOnInit(): void {
    this.getBatteryData();
  }

  getBatteryData() {
    this._D3DataService.getBatteryData().subscribe((batteryDataList) => {
      this.batteryDataList = batteryDataList;
      this.batteryCellsList = Object.keys(batteryDataList[0]).reduce((accumulator, key) => {
          if(key != 'date'){
            accumulator.push(key);
          }
          return accumulator;
      }, []);
      this.onCellSelect(this.batteryCellsList[0]);
    });
  }

  getCellData() {
    this._D3DataService.getCellData().subscribe((cellData) => {
      this.selectedCellDataList = cellData;
    });
  }

  onCellSelect(value:string){
    this.selectedBatteryCell = value;
    console.log("The selected cell value is " + value);
    this.selectedCellDataList = [];
    this.batteryDataList.forEach(batteryData => {
      const cellData: ICellData = {
        cellDate: batteryData["date"],
        cellValue: batteryData[this.selectedBatteryCell],
      };
      this.selectedCellDataList.push(cellData);
    })
    this.generateD3Chart(this.selectedCellDataList);
  }

  generateD3Chart(graphData){
    if(!graphData) return;

    // format the data
    var data = graphData;

    // Use the margin convention practice 
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
    , width = document.querySelector(".chart-wrapper").clientWidth - margin.left - margin.right // Use the window's width 
    , height = window.innerHeight - margin.top - margin.bottom - 350; // Use the window's height

    data.forEach(function(d) {
      d.cellDate = new Date(d.cellDate.replace(/-/g,"/"));
    });

    // set the ranges
    var datesArray = data.map(data => data.cellDate);
    var minDate = Math.min(...datesArray);
    var maxDate = Math.max(...datesArray);

    var x = d3.scaleTime()
              .domain([minDate, maxDate]) // input
              .range([0, width]);

    var valuesArray = data.map(data => data.cellValue);
    var minCellVal = new Date((Math.min(...valuesArray)).toString().replace(/-/g,"/"));
    var maxCellVal = new Date((Math.max(...valuesArray)).toString().replace(/-/g,"/"));
    var y = d3.scaleLinear()
              .domain([minCellVal, maxCellVal]) // input
              .range([height, 0]);

    // Remove SVG to generate new SVG
    d3.select("svg").remove();

    // Add the SVG to the page and employ #2
    var svg = d3.select(".chart-wrapper")
    .data(data)
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { 
                                return d.cellDate; 
                              }));
    y.domain([0, d3.max(data, function(d) { 
                                return d.cellValue; 
                              })]);

    // Add the valueline path.
    svg.enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("class", "line")
        .attr("d", d3.line()
          .x(function(d) { return x(d.cellDate) })
          .y(function(d) { return y(d.cellValue) })
        );

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
  }
}
