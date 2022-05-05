import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Color from 'color';
import { ChromePicker, SketchPicker, ColorResult } from 'react-color';
import lodash from 'lodash';
import { Button, Popover, Tooltip } from "antd";
import '../../styles/components/input-color.scss'

function formatColor(color: any) {
    const rgb = color.rgb
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
}

const parseColor = (color: any) => {
    // Catch invalid color.
    try {
        return Color(color);
    }
    catch (err) {
        console.warn("Error parsing color: ", err);
        return Color("rgb(255,255,255)");
    }
}

interface InputColorProps {
    name: string;
    style?: any;
    value?: any;
    placeholder?: any;
    onChange: (val: string) => void;
}

const InternalInputColor: React.FC<InputColorProps> = (props) => {

    const [state, setState] = useState({
        pickerOpened: false,
        colorValue: '#fff',
        textValue: '#fff'
    });

    useEffect(() => {
        const colorValue = parseColor(props.value).hex();
        setState((prevState) => {
            return {
                ...prevState,
                colorValue: colorValue,
                textValue: colorValue,
            }
        });
    }, [props.value])


    const handleChange = (color: ColorResult) => {
        const colorValue = color.hex;
        setState((prevState) => {
            return {
                ...prevState,
                colorValue: colorValue,
                textValue: colorValue,
            }
        });
    }

    const handleChangeComplete = (color: ColorResult) => {
        console.log('inputcolor handleChangeComplete');
        const colorValue = color.hex;
        props.onChange(colorValue);
    };

    const togglePicker = () => {
        setState((prevState) => {
            return {
                ...prevState,
                pickerOpened: !prevState.pickerOpened
            }
        });
    }


    const onTextChange = (v: string) => {
        //validate 
        console.log('text changed', v)
        setState((prevState) => {
            return {
                ...prevState,
                textValue: v
            }
        });
    }

    const onTextBlur = (v: string) => {
        //validate 
        console.log('text blur changed', v)
        const colorValue = parseColor(v).hex();
        setState((prevState) => {
            return {
                ...prevState,
                colorValue: colorValue,
                textValue: colorValue,
            }
        });
    }

    var currentColor = parseColor(state.colorValue).object();
    //var color = this.state.background;
    var color = {
        r: currentColor.r,
        g: currentColor.g,
        b: currentColor.b,
        // Rename alpha -> a for ChromePicker
        a: currentColor.alpha
    }

    var swatchStyle = {
        backgroundColor: state.colorValue
    };
    console.log('render inputcolor', currentColor)
    return <div className="input-color-wrapper">
        <Tooltip placement="right"
            visible={state.pickerOpened}
            title={<>
                <ChromePicker
                    disableAlpha={true}
                    color={color}
                    onChange={handleChange}
                    onChangeComplete={handleChangeComplete}
                />
                <div
                    className="input-color-picker-offset"
                    onClick={togglePicker}
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
                    onClick={togglePicker}
                    style={props.style}
                    name={props.name}
                    placeholder={props.placeholder}
                    value={state.textValue}
                    onChange={(e) => onTextChange(e.target.value)}
                    onBlur={(e) => onTextBlur(e.target.value)}
                />
            </div>

        </Tooltip>

    </div>


}

const InputColor = React.memo(InternalInputColor)

export default InputColor;
