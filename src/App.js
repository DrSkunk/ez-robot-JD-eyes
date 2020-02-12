import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const EyeWrapper = styled.div`
  display: flex;
`;

const PixelWrapper = styled.div`
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-gap: 5px;
  margin-left: 10px;
  margin-top: 10px;
`;

const Pixel = styled.div`
  /* margin-top: 5px; */
  height: 100px;
  width: 100px;
  box-sizing: border-box;
  border: 1px solid black;
  :hover {
    border: 1px solid red;
  }
`;

function Eye(props) {
  const { pixels, onPixelClick, side } = props;
  const base = side === 'left' ? 0 : 9;
  return (
    <PixelWrapper>
      {pixels.map((pixel, index) => (
        <Pixel
          key={`pixel${index}`}
          style={{ backgroundColor: pixel }}
          onClick={() => onPixelClick(base + index)}
        />
      ))}
    </PixelWrapper>
  );
}

function hexTo3BitRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) >> 5,
        g: parseInt(result[2], 16) >> 5,
        b: parseInt(result[3], 16) >> 5
      }
    : { r: 0, g: 0, b: 0 };
}

export default class App extends Component {
  state = {
    name: '',
    selectedColor: '#fff',
    eyes: Array(18).fill('#000000'),
    copied: false
  };

  handleColorChange = color => {
    this.setState({ selectedColor: color.hex });
  };

  onPixelClick = index => {
    this.setState(state => {
      state.eyes[index] = state.selectedColor;
      console.log(state);
      return state;
    });
  };

  onNameChange = e => {
    console.log(e.target.value);
    this.setState({ name: e.target.value });
  };

  render() {
    const { selectedColor, selectedIndex, eyes, name, copied } = this.state;

    const eyeOutput = eyes.map(pixel => hexTo3BitRgb(pixel));

    let output;
    if (name === '') {
      output = JSON.stringify(eyeOutput, null, 2);
    } else {
      output = JSON.stringify(
        {
          [name]: eyeOutput
        },
        null,
        2
      );
    }

    return (
      <div>
        {selectedIndex}
        <EyeWrapper>
          <Eye
            pixels={eyes.slice(0, eyes.length / 2)}
            onPixelClick={this.onPixelClick}
            side="left"
          />
          <Eye
            pixels={eyes.slice(eyes.length / 2, eyes.length)}
            onPixelClick={this.onPixelClick}
            side="right"
          />
          <SketchPicker
            color={selectedColor}
            onChange={this.handleColorChange}
            disableAlpha={true}
          />
        </EyeWrapper>

        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={this.onNameChange} />
        </div>
        {copied ? <span style={{ color: 'red' }}>Copied.</span> : null}
        <CopyToClipboard
          text={output}
          onCopy={() => this.setState({ copied: true })}
        >
          <button>Copy to clipboard with button</button>
        </CopyToClipboard>
        <SyntaxHighlighter language="javascript" style={docco}>
          {output}
        </SyntaxHighlighter>
      </div>
    );
  }
}
