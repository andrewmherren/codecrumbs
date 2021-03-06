import React from 'react';
import { connect } from 'react-redux';

import { selectCodeCrumb } from 'core/dataBus/actions';
import { getSource, getSourceLayout, getCodeCrumbsUserChoice } from 'core/dataBus/selectors';
import { getCheckedState } from 'core/controlsBus/selectors';
import Tree from './Tree';

const mapStateToProps = (state, props) => {
  const {
    sourceDiagramOn,
    dependenciesDiagramOn,
    codeCrumbsDiagramOn,
    codeCrumbsMinimize,
    codeCrumbsLineNumbers
  } = getCheckedState(state);

  const { namespace } = props;
  const namespaceProps = { namespace };
  const { filesMap } = getSource(state, namespaceProps);
  const { filesLayoutMap } = getSourceLayout(state, namespaceProps);
  const { selectedCrumbedFlowKey } = getCodeCrumbsUserChoice(state, namespaceProps);

  return {
    filesLayoutMap,
    filesMap,
    selectedCrumbedFlowKey,
    sourceDiagramOn,
    dependenciesDiagramOn,
    codeCrumbsDiagramOn,
    codeCrumbsMinimize,
    codeCrumbsLineNumbers
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { namespace } = props;
  return {
    onCodeCrumbSelect: options => dispatch(selectCodeCrumb(options, namespace))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tree);
