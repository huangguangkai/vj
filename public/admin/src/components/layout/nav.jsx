
import React from 'react'
import {Link} from 'react-router'
import classNames from 'classnames'

import routes from '../../mixins/routes'

const Item = React.createClass({
  render() {
    const self = this;
    const props = self.props;

    const itemClass = classNames({
      item: true,
      active: location.hash.indexOf(props.route) !== -1
    })

    return (
      <Link className={itemClass}
      to={props.route}>
      {props.children}</Link>
    )
  }
})

const Module = React.createClass({
    handleToggle() {
      const self = this
      const props = self.props
      if (props.active) {
        $(self.refs.items).slideToggle(200)
      } else {
        props.onModuleToggle(props.name)
      }
    },
    componentDidMount() {
      this.refs.items.style.display = this.props.active ? 'block' : 'none'
    },
    componentDidUpdate() {
      if (this.props.active) {
        $(this.refs.items).slideDown(200)
      } else {
        $(this.refs.items).slideUp(200)
      }
    },
    render() {
      const self = this
      const props = self.props

      return (
        <div className="module">
          <div className="title" onClick={this.handleToggle}>
          <i className="icon-dropdown"></i>{props.name}</div>
          <div ref="items" className="items">
          {((items) => {
            return items.map(function (item) {
              return <Item key={item.route} route={item.route}>{item.text}</Item>
            })
          })(props.items)}
          </div>
        </div>
      )
    }
})

const Nav = React.createClass({
    mixins: [routes],
    getInitialState() {
      return {
        activeModuleName: '',
        activeSecondName: '',
      }
    },
    handleModuleToggle(modName) {
      const self = this
      this.setState({
        activeModuleName: modName
      })
    },
    componentWillMount() {
      const self = this;
      const props = self.props;
      const curPath = location.hash.replace('#', '');
      const modules = self.modules;
      const history = props.history;

      history.listen(function (location) {

        if (!location) return;

        const path = location.pathname;

        if (path === '/') {
            self.setState({
                activeModuleName: '',
                activeSecondName: '',
            });
            return false;
        }

        for(let k = modules.length; k--;) {
          const mod = modules[k];
          const items = mod.items;

          for(let i = items.length; i--;) {
            const item = items[i];
            const route = item.route;
            const text = item.text;

            if (path.indexOf(route) !== -1) {
              self.setState({
                activeModuleName: mod.name,
                activeSecondName: text,
              });
              break;
            }
          }
        }
      });
    },
    render() {
      const self = this
      const props = self.props
      const modules = self.modules

      return (
        <nav>
          {((modules) => {

            return modules.map(function (mod, i) {
              const modName = mod.name
              const active = self.state.activeModuleName === modName

              return <Module
              active={active}
              onModuleToggle={self.handleModuleToggle}
              key={`${i}${modName}`}
              name={modName}
              items={mod.items}/>
            })

          })(modules)}
        </nav>
      )
    }
})

export default Nav