import React, { useCallback, useMemo, useRef, useState } from 'react'
import Color from 'color';
import { ChromePicker, SketchPicker,ColorResult } from 'react-color';
import lodash from 'lodash';
import { Button, Popover, Tooltip } from "antd";
import '../../styles/components/input-color.scss'

function formatColor(color: any) {
    const rgb = color.rgb
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
}
interface InputColorProps {
    name: string;
    style?: any;
    defaultValue?: any;
    placeholder?: any;
    onChange: (val: string) => void;
}
class InternalInputColor extends React.Component<InputColorProps, any> {
    
    colorInputRef: any;
    state = {
        pickerOpened: false,
        colorValue: '#fff',
        textValue: '#fff'
    };
    constructor(initProps: any) {
        super(initProps);
        this.state.colorValue = this.parseColor(this.props.defaultValue).hex();
        this.state.textValue = this.state.colorValue;
    }

    handleChange = (color: ColorResult) => {
        this.setState({ 
            colorValue: color.hex,
            textValue: color.hex,
        });
    };

    handleChangeComplete = (color: any) => {
        console.log('inputcolor handleChangeComplete');
        this.props.onChange(color.hex);
    };


    togglePicker = () => {
        this.setState({ pickerOpened: !this.state.pickerOpened })
    }


    onTextChange = (v: string) => {
        //validate 
        console.log('text changed', v)
        this.setState({ textValue: v });
    }

    onTextBlur = (v: string) => {
        //validate 
        console.log('text blur changed', v)
        const color = this.parseColor(v).hex();
        this.setState({ 
            colorValue: color,
            textValue: color,
        });
    }

     parseColor = (color: any) => {
        // Catch invalid color.
        try {
          return Color(color);
        }
        catch(err) {
          console.warn("Error parsing color: ", err);
          return Color("rgb(255,255,255)");
        }
    }

    render() {
        var currentColor = this.parseColor(this.state.colorValue).object();
        //var color = this.state.background;
        var color = {
          r: currentColor.r,
          g: currentColor.g,
          b: currentColor.b,
          // Rename alpha -> a for ChromePicker
          a: currentColor.alpha
        }

        var swatchStyle = {
            backgroundColor: this.state.colorValue
        };
        console.log('render inputcolor', currentColor)
        return <div className="input-color-wrapper">
            {/* {state.pickerOpened && picker} */}
           

            <Tooltip placement="right"
                visible={this.state.pickerOpened}
                title={<>
                    <ChromePicker
                        // presetColors={[
                        //     '#000000', '#D0021B', '#F5A623',
                        //     '#F8E71C', '#8B572A', '#7ED321',
                        //     '#417505', '#BD10E0', '#9013FE', 
                        //     '#50E3C2', '#B8E986', '#4A90E2',
                        //     '#4A4A4A', '#9B9B9B', '#FFFFFF']}
                        disableAlpha={true}
                        color={color}
                        onChange={this.handleChange}
                        onChangeComplete={this.handleChangeComplete}
                    />
                    <div
                        className="input-color-picker-offset"
                        onClick={this.togglePicker}
                        style={{
                            zIndex: -1,
                            position: 'fixed',
                            top: '0px',
                            right: '0px',
                            bottom: '0px',
                            left: '0px',
                        }}
                    />
                </>}>
                <div className='input-color-group'>
                    <div className="input-color-swatch" style={swatchStyle}></div>
                    <input
                        spellCheck="false"
                        autoComplete="off"
                        className="input-color"
                        ref={(input) => this.colorInputRef = input}
                        onClick={this.togglePicker}
                        style={this.props.style}
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        value={this.state.textValue}
                        onChange={(e) => this.onTextChange(e.target.value)}
                        onBlur={(e) => this.onTextBlur(e.target.value)}
                    />
                </div>
                
            </Tooltip>

        </div>
    }

}

const InputColor = React.memo(InternalInputColor)

export default InputColor;
