import React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Topology/topology-components';
import {
  DefaultConnectorTerminal,
  Edge,
  EdgeTerminalType,
  getEdgeAnimationDuration,
  getEdgeStyleClassModifier,
  Layer,
  NodeStatus,
  Point,
  TOP_LAYER,
  useHover,
  WithContextMenuProps,
  WithRemoveConnectorProps,
  WithSelectionProps,
  WithSourceDragProps,
  WithTargetDragProps
} from '@patternfly/react-topology';
import _ from 'lodash';

type BaseEdgeProps = {
  children?: React.ReactNode;
  element: Edge;
  dragging?: boolean;
  className?: string;
  animationDuration?: number;
  startTerminalType?: EdgeTerminalType;
  startTerminalClass?: string;
  startTerminalStatus?: NodeStatus;
  startTerminalSize?: number;
  endTerminalType?: EdgeTerminalType;
  endTerminalClass?: string;
  endTerminalStatus?: NodeStatus;
  endTerminalSize?: number;
  tag?: string;
  tagClass?: string;
  tagStatus?: NodeStatus;
} & Partial<
  WithRemoveConnectorProps & WithSourceDragProps & WithTargetDragProps & WithSelectionProps & WithContextMenuProps
>;

export const getConnectorStartPoint = (startPoint: Point, endPoint: Point, size: number): [number, number] => {
  const length = Math.sqrt((endPoint.x - startPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2);
  if (!length) {
    return [0, 0];
  }
  const ratio = (length - size) / length;

  return [startPoint.x + (endPoint.x - startPoint.x) * ratio, startPoint.y + (endPoint.y - startPoint.y) * ratio];
};

const CustomEdge: React.FunctionComponent<BaseEdgeProps> = ({
  element,
  dragging,
  sourceDragRef,
  targetDragRef,
  animationDuration,
  onShowRemoveConnector,
  onHideRemoveConnector,
  startTerminalType = EdgeTerminalType.none,
  startTerminalClass,
  startTerminalStatus,
  startTerminalSize = 14,
  endTerminalType = EdgeTerminalType.directional,
  endTerminalClass,
  endTerminalStatus,
  endTerminalSize = 14,
  children,
  className,
  selected,
  onSelect,
  onContextMenu
}) => {
  const [hover, hoverRef] = useHover();
  const startPoint = element.getStartPoint();
  const endPoint = element.getEndPoint();

  // eslint-disable-next-line patternfly-react/no-layout-effect
  React.useLayoutEffect(() => {
    if (hover && !dragging) {
      onShowRemoveConnector && onShowRemoveConnector();
    } else {
      onHideRemoveConnector && onHideRemoveConnector();
    }
  }, [hover, dragging, onShowRemoveConnector, onHideRemoveConnector]);

  const groupClassName = css(
    styles.topologyEdge,
    className,
    dragging && 'pf-m-dragging',
    hover && !dragging && 'pf-m-hover',
    selected && !dragging && 'pf-m-selected'
  );

  const edgeAnimationDuration = animationDuration ?? getEdgeAnimationDuration(element.getEdgeAnimationSpeed());
  const linkClassName = css(styles.topologyEdgeLink, getEdgeStyleClassModifier(element.getEdgeStyle()));

  const bendpoints = element.getBendpoints();

  const d = `M${startPoint.x} ${startPoint.y} ${bendpoints.map((b: Point) => `L${b.x} ${b.y} `).join('')}L${
    endPoint.x
  } ${endPoint.y}`;

  const bgStartPoint =
    !startTerminalType || startTerminalType === EdgeTerminalType.none
      ? [startPoint.x, startPoint.y]
      : getConnectorStartPoint(_.head(bendpoints) || endPoint, startPoint, startTerminalSize);
  const bgEndPoint =
    !endTerminalType || endTerminalType === EdgeTerminalType.none
      ? [endPoint.x, endPoint.y]
      : getConnectorStartPoint(_.last(bendpoints) || startPoint, endPoint, endTerminalSize);
  const backgroundPath = `M${bgStartPoint[0]} ${bgStartPoint[1]} ${bendpoints
    .map((b: Point) => `L${b.x} ${b.y} `)
    .join('')}L${bgEndPoint[0]} ${bgEndPoint[1]}`;

  const edgeColor = element?.getData()?.edgeColor || undefined;

  return (
    <Layer id={dragging || hover ? TOP_LAYER : undefined}>
      <g
        ref={hoverRef}
        data-test-id="edge-handler"
        className={groupClassName}
        onClick={onSelect}
        onContextMenu={onContextMenu}
      >
        <path
          className={css(styles.topologyEdgeBackground)}
          d={backgroundPath}
          onMouseEnter={onShowRemoveConnector}
          onMouseLeave={onHideRemoveConnector}
        />
        <path
          className={linkClassName}
          d={d}
          style={{ animationDuration: `${edgeAnimationDuration}s`, stroke: edgeColor }}
        />
        <DefaultConnectorTerminal
          className={startTerminalClass}
          isTarget={false}
          edge={element}
          size={startTerminalSize}
          dragRef={sourceDragRef}
          terminalType={startTerminalType}
          status={startTerminalStatus}
          highlight={dragging || hover}
        />
        <DefaultConnectorTerminal
          className={endTerminalClass}
          isTarget
          dragRef={targetDragRef}
          edge={element}
          size={endTerminalSize}
          terminalType={endTerminalType}
          status={endTerminalStatus}
          highlight={dragging || hover}
        />
        {children}
      </g>
    </Layer>
  );
};

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge;
