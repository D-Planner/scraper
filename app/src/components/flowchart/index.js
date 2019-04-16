import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { csData } from '../../services/mock_data';

const Flowchart = (props) => {
  return (
    <div>
      <ForceGraph2D
        graphData={csData}
        nodeLabel="orc_number"
        linkWidth={3}
        linkDirectionalArrowLength={10}
        linkDirectionalArrowRelPos={1}
        backgroundColor="#e8e8e8"
      />
    </div>
  );
};

export default Flowchart;
