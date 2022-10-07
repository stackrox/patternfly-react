import React from 'react';
import {
  EdgeStyle,
  TopologyView,
  VisualizationProvider,
  VisualizationSurface,
  useComponentFactory,
  NodeShape,
  NodeStatus,
  useModel,
  ComponentFactory,
  ModelKind,
  DefaultNode,
  GraphComponent,
  Model
} from '@patternfly/react-topology';

import '../TopologyDemo/TopologyDemo.css';
import CustomEdge from './CustomEdge';

const model: Model = {
  graph: {
    id: 'g1',
    type: 'graph'
  },
  nodes: [
    {
      height: 75,
      width: 75,
      id: 'default-1',
      label: 'Node 1',
      shape: NodeShape.ellipse,
      status: NodeStatus.default,
      type: 'node',
      x: 60,
      y: 20
    },
    {
      height: 75,
      width: 75,
      id: 'default-2',
      label: 'Node 2',
      shape: NodeShape.ellipse,
      status: NodeStatus.default,
      type: 'node',
      x: 360,
      y: 20
    },
    {
      height: 75,
      width: 75,
      id: 'default-3',
      label: 'Node 3',
      shape: NodeShape.ellipse,
      status: NodeStatus.default,
      type: 'node',
      x: 60,
      y: 270
    }
  ],
  edges: [
    {
      id: 'edge-default-2-default-1',
      type: 'edge',
      source: 'default-2',
      target: 'default-1',
      edgeStyle: EdgeStyle.default,
      data: {
        edgeColor: 'green'
      }
    },
    {
      id: 'edge-default-2-default-3',
      type: 'edge',
      source: 'default-2',
      target: 'default-3',
      edgeStyle: EdgeStyle.default,
      data: {
        edgeColor: 'red'
      }
    }
  ]
};
const TopologyComponent = () => {
  useComponentFactory(
    React.useCallback<ComponentFactory>((kind, type) => {
      if (type === ModelKind.graph) {
        return GraphComponent;
      }
      if (type === ModelKind.node) {
        return DefaultNode;
      }
      if (type === ModelKind.edge) {
        return CustomEdge;
      }
      return undefined;
    }, [])
  );

  useModel(model);

  return (
    <TopologyView>
      <VisualizationSurface />
    </TopologyView>
  );
};

export const TopologyEdgeColorDemo: React.FunctionComponent = React.memo(() => (
  <div className="pf-ri__topology-demo">
    <VisualizationProvider>
      <TopologyComponent />
    </VisualizationProvider>
  </div>
));

TopologyEdgeColorDemo.displayName = 'TopologyEdgeColorDemo';
