import React from 'react';
import { connect } from 'react-redux';

import { NO_TRAIL_FLOW } from 'core/constants';
import { CodeCrumbedFlowEdge } from 'components/treeDiagram/component/Edge/CodeCrumbEdge';

import { getCheckedState } from 'core/controlsBus/selectors';
import { getSourceLayout, getCodeCrumbsUserChoice } from 'core/dataBus/selectors';

const FlowEdge = props => {
  const { shiftToCenterPoint, sortedFlowSteps, filesLayoutMap, codeCrumbsMinimize } = props;

  return (
    <React.Fragment>
      {!codeCrumbsMinimize &&
        sortedFlowSteps.map((toItem, i, list) => {
          if (!i) return null;

          const fromItem = list[i - 1];
          const fromFile = filesLayoutMap[fromItem.filePath];
          const toFile = filesLayoutMap[toItem.filePath];

          const edgePoints = [fromItem, toItem].map(crumb => {
            const [cX, cY] = [crumb.y, crumb.x];
            return shiftToCenterPoint(cX, cY);
          });

          return (
            <CodeCrumbedFlowEdge
              key={`cc-flow-edge-${fromItem.name}-${toItem.name}`}
              singleCrumbSource={fromFile.children.length === 1}
              singleCrumbTarget={toFile.children.length === 1}
              sourcePosition={edgePoints[0]}
              targetPosition={edgePoints[1]}
              sourceName={fromItem.name}
              targetName={toItem.name}
            />
          );
        })}
    </React.Fragment>
  );
};

const getSortedFlowSteps = ({ codeCrumbedFlowsMap, selectedCrumbedFlowKey, filesLayoutMap }) => {
  const currentFlow = codeCrumbedFlowsMap[selectedCrumbedFlowKey] || {};
  let sortedFlowSteps = [];
  Object.keys(currentFlow).forEach(filePath => {
    const steps = ((filesLayoutMap[filePath] && filesLayoutMap[filePath].children) || [])
      .filter(({ data }) => data.params.flow === selectedCrumbedFlowKey)
      .map(({ data, x, y }) => ({
        name: data.name,
        filePath,
        step: data.params.flowStep,
        flow: selectedCrumbedFlowKey,
        x,
        y
      }));

    sortedFlowSteps = sortedFlowSteps.concat(steps);
  });

  sortedFlowSteps.sort((a, b) => a.step - b.step);

  return sortedFlowSteps;
};

const mapStateToProps = (state, props) => {
  const { codeCrumbsMinimize } = getCheckedState(state);

  const { namespace } = props;
  const namespaceProps = { namespace };

  const { filesLayoutMap } = getSourceLayout(state, namespaceProps);
  const { selectedCrumbedFlowKey, codeCrumbedFlowsMap } = getCodeCrumbsUserChoice(
    state,
    namespaceProps
  );

  // TODO: ftw is this
  const sortedFlowSteps =
    selectedCrumbedFlowKey !== NO_TRAIL_FLOW
      ? getSortedFlowSteps({
          codeCrumbedFlowsMap,
          selectedCrumbedFlowKey,
          filesLayoutMap
        })
      : [];

  return {
    sortedFlowSteps,
    filesLayoutMap,
    codeCrumbsMinimize
  };
};

export default connect(mapStateToProps)(FlowEdge);
