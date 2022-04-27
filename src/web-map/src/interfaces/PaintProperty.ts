
export type PaintPointPropertyKey = 
"circle-color"
| "circle-opacity"
| "circle-stroke-color"
| "circle-stroke-opacity"
| "circle-blur"
| "circle-radius"
| "circle-stroke-width"

| "icon-image"
| "icon-size"
| "icon-rotate"
| "icon-padding"
| "icon-offset"
| "icon-anchor"

| "icon-color"
| "icon-opacity"
| "icon-halo-color"
| "icon-halo-width";

export type PaintTextPropertyKey = 
"text-field"
| "text-font"
| "text-size"
| "text-line-height"
| "text-anchor"
| "text-rotate"
| "text-offset"	
| "text-color"
| "text-opacity"
| "text-halo-color"
| "text-halo-width";

export type PaintLinePropertyKey =
"line-opacity"
| "line-color"
| "line-width"
| "line-offset";

export type PaintFillPropertyKey =
"fill-opacity"
| "fill-color"
| "fill-antialias"
| "fill-outline-color";

export type PaintPropertyKey =
| PaintPointPropertyKey
| PaintTextPropertyKey
| PaintLinePropertyKey
| PaintFillPropertyKey
| string;