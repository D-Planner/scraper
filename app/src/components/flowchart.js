import React, { Component } from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom'; 

export default class Flowchart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [4,8,15,16,23,42]
        }

        this.createBarChart = this.createBarChart.bind(this);
    }

    componentDidMount() {
        this.createBarChart();
    }

    createBarChart() {
        let div = new ReactFauxDOM.createElement('div');
        d3.select(div).html('hello world');
        return div.toReact();
    }

    render() {
        return this.createBarChart();
    }
}