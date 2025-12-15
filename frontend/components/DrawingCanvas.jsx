import React, { Component } from 'react';
import { Stage, Layer, Line, Arrow, Circle } from 'react-konva';

class DrawingCanvas extends Component {
  state = {
    shapes: [],
    isDrawing: false,
  };

  handleMouseDown = () => {
    this.setState({ isDrawing: true });
    const pos = this.stageRef.getPointerPosition();
    const { tool, color, size } = this.props;

    let newShape = {
        type: tool,
        points: [pos.x, pos.y],
        color: color,
        size: parseInt(size),
    };

    if (tool === 'circle') {
        newShape.radius = 0;
    } else if (tool === 'arrow') {
        newShape.points.push(pos.x, pos.y);
    }

    this.setState({
      shapes: [...this.state.shapes, newShape],
    });
  };

  handleMouseMove = () => {
    if (!this.state.isDrawing) return;

    const stage = this.stageRef;
    const point = stage.getPointerPosition();
    let lastShape = this.state.shapes[this.state.shapes.length - 1];

    if (!lastShape) return;

    if (lastShape.type === 'pen') {
        lastShape.points = lastShape.points.concat([point.x, point.y]);
    } else if (lastShape.type === 'arrow') {
        lastShape.points[2] = point.x;
        lastShape.points[3] = point.y;
    } else if (lastShape.type === 'circle') {
        const dx = point.x - lastShape.points[0];
        const dy = point.y - lastShape.points[1];
        lastShape.radius = Math.sqrt(dx * dx + dy * dy);
    }
    
    this.state.shapes.splice(this.state.shapes.length - 1, 1, lastShape);
    this.setState({ shapes: this.state.shapes.concat() });
  };

  handleMouseUp = () => {
    this.setState({ isDrawing: false });
    // Here you would typically call a prop function to save the drawing state
    // For example: this.props.onDrawEnd(this.state.shapes);
  };

  render() {
    return (
      <Stage
        width={this.props.width}
        height={this.props.height}
        onContentMousedown={this.handleMouseDown}
        onContentMousemove={this.handleMouseMove}
        onContentMouseup={this.handleMouseUp}
        ref={node => {
          this.stageRef = node;
        }}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}
      >
        <Layer>
          {this.state.shapes.map((shape, i) => {
            switch(shape.type) {
                case 'pen':
                    return <Line key={i} points={shape.points} stroke={shape.color} strokeWidth={shape.size} tension={0.5} lineCap="round" />;
                case 'arrow':
                    return <Arrow key={i} points={shape.points} stroke={shape.color} strokeWidth={shape.size} />;
                case 'circle':
                    return <Circle key={i} x={shape.points[0]} y={shape.points[1]} radius={shape.radius} stroke={shape.color} strokeWidth={shape.size} />;
                default:
                    return null;
            }
          })}
        </Layer>
      </Stage>
    );
  }
}

export default DrawingCanvas;
