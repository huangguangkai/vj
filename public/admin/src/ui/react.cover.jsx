
import React from 'react'

export default React.createClass({
  getDefaultProps() {
    return {
      width: 320,
      height: 180,
    }
  },
  render() {
    const props = this.props;
    const width = props.width;
    const height = props.height;
    let style = props.style || {};

    style = Object.assign({
      width: width,
      height: height
    }, style);

    return (
      <div className="cover" style={style}>
        <div className="title" style={{
          backgroundImage: function() {
            if (props.nameImage) {
              return `url(${props.nameImage}?imageView2/2/w/${width})`
            }
          }()
        }}>
        {(() => {
          if (!props.nameImage) {
            return (
              <table className="text">
                <tbody>
                  <tr>
                      <td>{props.name}</td>
                  </tr>
                </tbody>
              </table>
            )
          }
        })()}
        </div>
        <div className="mask"></div>
        <div className="pic" style={{
          backgroundImage: `url(${props.coverUrl}?imageView2/2/w/${width})`
        }}></div>
      </div>
    )
  },
});