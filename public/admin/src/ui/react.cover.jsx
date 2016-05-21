
import React from 'react'

export default React.createClass({
  render() {
    const props = this.props;

    return (
      <div className="cover" style={{
        width: props.width || 320,
        height: props.height || 180
      }}>
        <div className="title"></div>
        <table className="text">
          <tbody>
            <tr>
                <td>{props.name}</td>
            </tr>
          </tbody>
        </table>
        <div className="mask"></div>
        <div className="pic"></div>
      </div>
    )
  },
});