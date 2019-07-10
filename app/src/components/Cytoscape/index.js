import React, { Component } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { connect } from 'react-redux';
import tinygradient from 'tinygradient';
import { Departments } from '../../constants';
import { fetchCourses } from '../../actions';


class Cytoscape extends Component {
  colorsRgb = tinygradient('red', 'green', 'blue').rgb(Departments.length);

  componentWillMount() {
    this.props.fetchCourses();
  }

  elements = () => {
    return this.props.courses.map((course) => {
      let res = [{
        data: { id: course._id, label: course.title, department: course.department },
      }];
      if (course.prerequisites.length) {
        res = res.concat(course.prerequisites.map((dependency) => {
          const dependencyType = Object.keys(dependency).find((key) => {
            return (dependency[key].length > 0 && key !== '_id');
          });
          return ((dependencyType === 'req')
            ? dependency[dependencyType].map((c) => {
              return (c)
                ? { data: { source: course._id, target: c, label: dependencyType } }
                : { data: { source: course._id, target: course._id, label: dependencyType } };
            })
            : []);
        }).flat());
      }
      return res;
    }).flat();
  };


  style = () => {
    return {
      width: '100%',
      height: '600px',
    };
  };

  layoutConcentric = () => {
    return {
      name: 'concentric',

      fit: true, // whether to fit the viewport to the graph
      padding: 30, // the padding on fit
      startAngle: 3 / 2 * Math.PI, // where nodes start in radians
      sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
      clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
      equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
      minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
      nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
      height: undefined, // height of layout area (overrides container height)
      width: undefined, // width of layout area (overrides container width)
      spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      concentric(node) { // returns numeric value for each node, placing higher nodes in levels towards the centre
        return (Departments.includes(node.data('department')))
          ? Departments.indexOf(node.data('department'))
          : -1;
      },
      levelWidth(nodes) { // the letiation of concentric values in each level
        return nodes.maxDegree() / Departments.length;
      },
      animate: false, // whether to transition the node positions
      animationDuration: 500, // duration of animation in ms if enabled
      animationEasing: undefined, // easing of animation if enabled
      // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
      animateFilter(node, i) { return true; },
      ready: undefined, // callback on layoutready
      stop: undefined, // callback on layoutstop
      transform(node, position) { return position; }, // transform a given node position. Useful for changing flow direction in discrete layouts
    };
  };

  layoutCose = () => {
    return {
      name: 'cose',

      // Called on `layoutready`
      ready() {},

      // Called on `layoutstop`
      stop() {},

      // Whether to animate while running the layout
      // true : Animate continuously as the layout is running
      // false : Just show the end result
      // 'end' : Animate with the end result, from the initial positions to the end positions
      animate: false,

      // Easing of the animation for animate:'end'
      animationEasing: undefined,

      // The duration of the animation for animate:'end'
      animationDuration: undefined,

      // A function that determines whether the node should be animated
      // All nodes animated by default on animate enabled
      // Non-animated nodes are positioned immediately when the layout starts
      animateFilter(node, i) { return false; },


      // The layout animates only after this many milliseconds for animate:true
      // (prevents flashing on fast runs)
      animationThreshold: 250,

      // Number of iterations between consecutive screen positions update
      refresh: 20,

      // Whether to fit the network view after when done
      fit: true,

      // Padding on fit
      padding: 30,

      // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      boundingBox: undefined,

      // Excludes the label when calculating node bounding boxes for the layout algorithm
      nodeDimensionsIncludeLabels: false,

      // Randomize the initial positions of the nodes (true) or use existing positions (false)
      randomize: false,

      // Extra spacing between components in non-compound graphs
      componentSpacing: 40,

      // Node repulsion (non overlapping) multiplier
      nodeRepulsion(node) { return 2048; },

      // Node repulsion (overlapping) multiplier
      nodeOverlap: 4,

      // Ideal edge (non nested) length
      idealEdgeLength(edge) { return 32; },

      // Divisor to compute edge forces
      edgeElasticity(edge) { return 32; },

      // Nesting factor (multiplier) to compute ideal edge length for nested edges
      nestingFactor: 1.2,

      // Gravity force (constant)
      gravity: 1,

      // Maximum number of iterations to perform
      numIter: 1000,

      // Initial temperature (maximum node displacement)
      initialTemp: 1000,

      // Cooling factor (how the temperature is reduced between consecutive iterations
      coolingFactor: 0.99,

      // Lower temperature threshold (below this point the layout will end)
      minTemp: 1.0,
    };
  }

  stylesheet = () => {
    return [
      {
        selector: 'node',
        style: {
          width: 20,
          height: 20,
          shape: 'rectangle',
          'background-color': (node) => {
            return Departments.includes(node.data('department'))
              ? this.colorsRgb[(Departments.indexOf(node.data('department')))].toHexString()
              : 'black';
          },
          label: 'data(label)',
        },
      },
      {
        selector: 'edge',
        style: {
          width: 15,
        },
      },
    ];
  }

  render() {
    return (this.props.courses.length)
      ? (
        <CytoscapeComponent
          elements={this.elements()}
          style={this.style()}
          stylesheet={this.stylesheet()}
          zoomingEnabled
          layout={this.layoutCose()}
        />
      )
      : (
        <div> Loading </div>
      );
    // return (
    //   <div>
    //     {this.props.courses.map((c) => {
    //       return (
    //         <div> {c.title} </div>
    //       );
    //     })}
    //   </div>
    // );
  }
}

const mapStateToProps = state => ({
  courses: state.courses.all,
});

export default connect(mapStateToProps, { fetchCourses })(Cytoscape);
