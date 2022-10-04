import * as React from 'react';
import { useLayoutFactory, useComponentFactory, useModel, Model } from '@patternfly/react-topology';

import withTopologySetup from '../../../utils/withTopologySetup';
import defaultComponentFactory from '../../../utils/defaultComponentFactory';
import defaultLayoutFactory from '../../../utils/defaultLayoutFactory';
import stylesComponentFactory from '../../../utils/stylesComponentFactory';

const response = {
  epoch: 0,
  nodes: [
    {
      entity: {
        type: 'DEPLOYMENT',
        id: '050f6a94-9c72-42d2-88a1-13b5cc955a24',
        deployment: {
          name: 'collector',
          namespace: 'stackrox',
          cluster: 'production',
          listenPorts: [
            { port: 8080, l4protocol: 'L4_PROTOCOL_TCP' },
            { port: 9090, l4protocol: 'L4_PROTOCOL_TCP' }
          ]
        }
      },
      internetAccess: false,
      policyIds: [],
      nonIsolatedIngress: false,
      nonIsolatedEgress: false,
      queryMatch: true,
      outEdges: {
        '1': {
          properties: [
            { port: 8443, protocol: 'L4_PROTOCOL_TCP', lastActiveTimestamp: '2022-10-04T01:17:59.600458171Z' }
          ]
        }
      }
    },
    {
      entity: {
        type: 'DEPLOYMENT',
        id: '6f878a16-d19a-453b-b844-f5df83f60371',
        deployment: {
          name: 'sensor',
          namespace: 'stackrox',
          cluster: 'production',
          listenPorts: [
            { port: 8443, l4protocol: 'L4_PROTOCOL_TCP' },
            { port: 9090, l4protocol: 'L4_PROTOCOL_TCP' },
            { port: 9443, l4protocol: 'L4_PROTOCOL_TCP' }
          ]
        }
      },
      internetAccess: false,
      policyIds: [],
      nonIsolatedIngress: false,
      nonIsolatedEgress: false,
      queryMatch: true,
      outEdges: {
        '3': {
          properties: [
            { port: 443, protocol: 'L4_PROTOCOL_TCP', lastActiveTimestamp: '2022-10-04T01:17:59.600464331Z' }
          ]
        },
        '4': {
          properties: [
            { port: 443, protocol: 'L4_PROTOCOL_TCP', lastActiveTimestamp: '2022-10-04T01:17:59.600465651Z' }
          ]
        }
      }
    },
    {
      entity: {
        type: 'DEPLOYMENT',
        id: 'e9fb2e80-6706-424f-a488-885afd57ee16',
        deployment: {
          name: 'admission-control',
          namespace: 'stackrox',
          cluster: 'production',
          listenPorts: [{ port: 8443, l4protocol: 'L4_PROTOCOL_TCP' }]
        }
      },
      internetAccess: false,
      policyIds: [],
      nonIsolatedIngress: false,
      nonIsolatedEgress: false,
      queryMatch: true,
      outEdges: {
        '1': {
          properties: [
            { port: 8443, protocol: 'L4_PROTOCOL_TCP', lastActiveTimestamp: '2022-10-04T01:17:59.600460762Z' }
          ]
        },
        '3': {
          properties: [
            { port: 443, protocol: 'L4_PROTOCOL_TCP', lastActiveTimestamp: '2022-10-04T01:17:59.600462311Z' }
          ]
        },
        '4': {
          properties: [
            { port: 443, protocol: 'L4_PROTOCOL_TCP', lastActiveTimestamp: '2022-10-04T01:17:59.600466242Z' }
          ]
        }
      }
    },
    {
      entity: { type: 'INTERNET', id: 'afa12424-bde3-4313-b810-bb463cbe8f90' },
      internetAccess: false,
      policyIds: [],
      nonIsolatedIngress: false,
      nonIsolatedEgress: false,
      queryMatch: false,
      outEdges: {
        '1': {
          properties: [
            { port: 9443, protocol: 'L4_PROTOCOL_TCP', lastActiveTimestamp: '2022-10-04T01:17:59.600463051Z' }
          ]
        },
        '2': {
          properties: [
            { port: 8443, protocol: 'L4_PROTOCOL_TCP', lastActiveTimestamp: '2022-10-04T01:17:59.600463622Z' }
          ]
        }
      }
    },
    {
      entity: {
        type: 'EXTERNAL_SOURCE',
        id: '__MzUuMjM4LjAuMC8xNQ',
        externalSource: { name: 'Google/us-central1', cidr: '35.238.0.0/15', default: true }
      },
      internetAccess: false,
      policyIds: [],
      nonIsolatedIngress: false,
      nonIsolatedEgress: false,
      queryMatch: false,
      outEdges: {}
    }
  ]
};

function getLabel(entity): String {
  const { type, externalSource, deployment } = entity;
  switch (type) {
    case 'DEPLOYMENT':
      return deployment.name;
    case 'INTERNET':
      return 'Internet';
    case 'EXTERNAL_SOURCE':
      return externalSource.name;
    default:
      return '';
  }
}

function transformData(data): Model {
  const { nodes } = data;
  const dataModel = {
    graph: {
      id: 'stackrox-active-graph',
      type: 'graph',
      layout: 'Concentric'
    },
    nodes: [],
    edges: []
  };
  const groupNodes = {};
  nodes.forEach(({ entity, outEdges }) => {
    // creating each node and adding to data model
    const node = {
      id: entity.id,
      type: 'node',
      width: 75,
      height: 75,
      label: getLabel(entity)
    };
    dataModel.nodes.push(node);

    // to group deployments into namespaces
    if (entity.type === 'DEPLOYMENT') {
      const { namespace } = entity.deployment;
      if (groupNodes[namespace]) {
        groupNodes[namespace].children.push(entity.id);
      } else {
        groupNodes[namespace] = {
          id: namespace,
          type: 'group',
          children: [entity.id],
          group: true,
          label: namespace,
          style: { padding: 15 },
          data: {
            collapsible: true,
            showContextMenu: false
          }
        };
      }
    }

    // creating edges based off of outEdges per node and adding to data model
    Object.keys(outEdges).forEach(nodeIdx => {
      const edge = {
        id: entity.id + nodes[nodeIdx].entity.id,
        type: 'edge',
        source: entity.id,
        target: nodes[nodeIdx].entity.id
      };
      dataModel.edges.push(edge);
    });
  });

  // add group nodes to data model
  dataModel.nodes.push(...Object.values(groupNodes));
  return dataModel;
}

export const StackRoxNetworkGraphDataDemo: React.FunctionComponent = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useLayoutFactory(defaultLayoutFactory);
  useComponentFactory(stylesComponentFactory);
  useModel(React.useMemo((): Model => transformData(response), []));
  return null;
});

StackRoxNetworkGraphDataDemo.displayName = 'StackRoxNetworkGraphDataDemo';
