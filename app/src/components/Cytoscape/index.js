import React, { Component } from 'react';
import { connect } from 'react-redux';
import ForceGraph2D from 'react-force-graph-2d';
import { Departments, departmentsWithFullName, gradient } from '../../constants';
import { courseSearch } from '../../actions';

import './cytoscape.scss';

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = { nodes: [], links: [] };

    this.selectedDept = '';
  }

  componentDidMount() {
    this.props.courseSearch().then(() => {
      this.updateGraph(c => true);
    });
  }

  updateGraph = (fn) => {
    const linkIDs = [];

    const links = this.props.courses.filter(c => fn(c))
      .map((course) => {
        return course.prerequisites.map((prereq) => {
          const dependencyType = Object.keys(prereq).find((key) => {
            return (prereq[key].length > 0 && key !== '_id');
          });
          if (['req', 'grade'].includes(dependencyType)) {
            linkIDs.push(course.id);
            return prereq[dependencyType].map((c) => {
              linkIDs.push(c.id);
              return { target: course.id, source: c.id, color: '#aaaaaa' };
            }).flat();
          } else return [];
        }).flat();
      }).flat();

    const nodes = this.props.courses.map((course) => {
      if (linkIDs.includes(course.id)) {
        return {
          id: course.id,
          name: course.name,
          title: course.title,
          department: course.department,
          val: 1,
        };
      } else return null;
    }).filter(e => e !== null);


    this.setState({
      links,
      nodes,
    }, () => {
      console.log(this.state);
    });
  }

  getColor = (n) => {
    return gradient.rgbAt(Departments.indexOf(n.department) / Departments.length);
  }

  focusGraph = (dep) => {
    if (dep.length) this.updateGraph(c => c.department === dep);
    else this.updateGraph(c => true);
  }

  render() {
    return (
      <div className="graphContainer">
        <div className="selector">
          <select default=""
            onChange={(e) => {
              this.selectedDept = e.target.value;
              this.focusGraph(e.target.value);
            }
            }
          >
            <option value="">Choose a Department</option>
            {
              Departments.sort().map((dep, i) => {
                return <option value={dep} key={i.toString()}>{departmentsWithFullName[dep]}</option>;
              })
            }
          </select>
        </div>
        <div className="interactiveContainer">
          <div className="graph">
            <ForceGraph2D
              graphData={{ nodes: this.state.nodes, links: this.state.links }}
              nodeLabel="title"
              linkWidth={1}
              linkDirectionalArrowLength={10}
              linkDirectionalArrowRelPos={1}
              nodeAutoColorBy={d => this.getColor(d)}
              nodeVisibility={(d) => {
                if (d.links) return true;
                return false;
              }}
              zoom={[1]}
              backgroundColor="#e8e8e8"
              onNodeDragEnd={(node) => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  courses: state.courses.results,
});

export default connect(mapStateToProps, { courseSearch })(Graph);
