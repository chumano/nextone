import { LayerType } from "../interfaces";

interface PropertiesConfig {
    groups: {
        name: string,
        properties: string[]
    }[]
}

export const paintProperties = [
    //point
    'circle-color',
    'circle-size',

    'symbol-enabled',
    'symbol-image',
    'symbol-scale',

    //line
    'line-color',
    'line-width',
    'line-style',

    //fill
    'fill-transparent-enabled',
    'fill-color',
    
    'theme-enabled',
    'theme-column',
    'theme-column-min',
    'theme-column-max',
    'theme-color1',
    'theme-color2',
    'theme-color3',

    //text
    'text-enabled',
    'text-column',
    'text-color',
    'text-font',
    'text-size',

    'text-halo-enabled',
    'text-halo-color',
    'text-halo-width',

    'text-rotate-enabled',
    'text-rorate-column',

    //common
    'outline-enabled',
    'outline-color',
    'outline-width',
    'outline-style'
]
export const paintPropertiesConfig: { [key: LayerType]: PropertiesConfig } = {
    'point': {
        groups: [
            {
                name: 'paint',
                properties: [
                    'circle-color',
                    'circle-size',

                    'outline-enabled',
                    'outline-color',
                    'outline-width',
                    'outline-style'
                ]
            },
            {
                name: 'symbol',
                properties: [
                    'symbol-enabled',
                    'symbol-image',
                    'symbol-scale',
                ]
            },
            {
                name: 'text',
                properties: [
                    'text-enabled',
                    'text-column',
                    'text-color',
                    'text-font',
                    'text-size',

                    'text-halo-enabled',
                    'text-halo-color',
                    'text-halo-width',

                    'text-rotate-enabled',
                    'text-rorate-column',
                ]
            }
        ]

    },
    'line': {
        groups: [
            {
                name: 'paint',
                properties: [
                    'line-color',
                    'line-width',
                    'line-style',

                    'outline-enabled',
                    'outline-color',
                    'outline-width',
                    'outline-style'
                ]
            },
            {
                name: 'text',
                properties: [
                    'text-enabled',
                    'text-column',
                    'text-color',
                    'text-font',
                    'text-size',

                    'text-halo-enabled',
                    'text-halo-color',
                    'text-halo-width',

                    'text-rotate-enabled',
                    'text-rorate-column',
                ]
            }
        ]
    },
    'fill': {
        groups: [
            {
                name: 'paint',
                properties: [
                    'fill-transparent-enabled',
                    'fill-color',

                    'outline-enabled',
                    'outline-color',
                    'outline-width',
                    'outline-style'
                ]
            },
            {
                name: 'theme',
                properties: [
                    'theme-enabled',
                    'theme-column',
                    'theme-value-min',
                    'theme-value-max',
                    'theme-color1',
                    'theme-color2',
                    'theme-color3',

                ]
            }
            ,
            {
                name: 'text',
                properties: [
                    'text-enabled',
                    'text-column',
                    'text-color',
                    'text-font',
                    'text-size',

                    'text-halo-enabled',
                    'text-halo-color',
                    'text-halo-width',

                    'text-rotate-enabled',
                    'text-rorate-column',
                ]
            }
        ]
    },
    'other': {
        groups: []
    }
}

export const getPropertiesConfigForType = (type: LayerType): PropertiesConfig => {
    const confg = paintPropertiesConfig[type];
    if (confg) return confg;
    return paintPropertiesConfig.other;
}
