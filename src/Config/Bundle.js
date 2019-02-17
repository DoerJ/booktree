import React, { Component } from 'react';
import { Render } from 'react-dom';
import PropTypes from 'prop-types';


class Bundle extends Component {

  // restrict property types
  static propTypes = {
    modId: PropTypes.string,
    load: PropTypes.func,
    children: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      mod: null
    };
  }
  // 组件初始化时调用
  componentWillMount = () => {
    this.load(this.props);
  }
  //钩子函数：组件接收新的props是调用
  componentWillReceiveProps = (next_props) => {
    if(next_props.modId !== this.props.modId) {
      this.load(next_props);
    }
  }
  // loading the component
  load = (props) => {
    // initialize the state
    this.setState({
      mod: null
    });

    Promise
      .resolve(props.load())
      .then((mod) => {
        this.setState({
          mod: mod.default ? mod.default : mod
        });
      })
  }
  // 组件渲染
  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}

export default Bundle;
