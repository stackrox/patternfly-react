import React from 'react';
import {
  EdgeStyle,
  Model,
  TopologyView,
  VisualizationProvider,
  VisualizationSurface,
  useComponentFactory,
  EdgeTerminalType,
  NodeShape,
  NodeStatus,
  useModel,
  ComponentFactory,
  ModelKind,
  DefaultNode,
  DefaultEdge,
  GraphComponent
} from '@patternfly/react-topology';

import './TopologyDemo.css';

const CustomEdge = props => {
  const { tag, tagStatus } = props?.element?.data;
  return <DefaultEdge {...props} tag={tag} tagStatus={tagStatus} />;
};

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
    }
  ],
  edges: [
    {
      id: 'edge-default-1-default-2',
      type: 'edge',
      source: 'default-1',
      target: 'default-2',
      edgeStyle: EdgeStyle.default,
      data: {
        endTerminalType: EdgeTerminalType.directional,
        tag: 'UDP: 43',
        tagStatus: 'default'
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

export const TopologyEdgeTerminalDemo: React.FunctionComponent = React.memo(() => (
  <div className="pf-ri__topology-demo">
    <VisualizationProvider>
      <TopologyComponent />
    </VisualizationProvider>
  </div>
));

TopologyEdgeTerminalDemo.displayName = 'TopologyEdgeTerminalDemo';
