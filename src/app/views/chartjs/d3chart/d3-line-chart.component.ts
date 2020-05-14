import {Component, OnInit, OnChanges, Input} from '@angular/core';
import * as d3 from 'd3';
import ICellData from './ICellData';

@Component({
    selector: 'app-d3-line-chart',
    templateUrl: 'd3-line-chart.component.html'
})

export class D3LineChartComponent implements OnInit, OnChanges {
    @Input() data: ICellData[];

    constructor() {}

    ngOnInit(): void {
        this.generateD3Chart(this.data);
    }

    ngOnChanges(): void {
        this.generateD3Chart(this.data);
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
            .attr('preserveAspectRatio', 'xMinYMin')
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
                .x(function(d) { return x(d.cellDate); })
                .y(function(d) { return y(d.cellValue); })
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
