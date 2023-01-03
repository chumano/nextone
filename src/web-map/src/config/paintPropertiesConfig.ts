import { LayerType } from "../interfaces";

interface PropertiesConfig {
    groups: {
        name: string,
        title?: string,
        properties: string[]
    }[]
}
export const PropertyNames :{[key:string]:string} ={
    //point
    'circle-color' :'Màu điểm',
    'circle-size':'Kích thước điểm',

    'symbol-enabled': 'Dùng biểu tượng?',
    'symbol-image' : 'Biểu tượng',
    'symbol-scale' : 'Tỉ lệ biểu tượng',

    //line
    'line-color': 'Màu đường',
    'line-width': 'Chiều rộng',
    'line-style': 'Kiểu đường',

    //fill
    'fill-transparent-enabled': 'Nền trong suốt?',
    'fill-color':'Màu nền',
    
    'theme-enabled': 'Tô màu theo giá trị?',
    'theme-column': 'Trường dữ liệu',
    'theme-value-min':'Giá trị nhỏ nhất',
    'theme-value-max': 'Giá trị lớn nhất',
    'theme-color1': 'Màu 1',
    'theme-color2': 'Màu 2',
    'theme-color3': 'Màu 3',

    //text
    'text-enabled': 'Sử dụng chữ',
    'text-column': 'Trường dữ liệu',
    'text-color':'Màu chữ',
    'text-font':'Kiểu chữ',
    'text-size':'Kích thước chữ',

    'text-halo-enabled': 'Vẽ bóng chữ?',
    'text-halo-color':'Màu bóng',
    'text-halo-width':'Kích thước bóng',

    'text-rotate-enabled':'Xoay chữ?',
    'text-rorate-column':'Trường xoay',

    //common
    'outline-enabled': 'Vẽ viền?',
    'outline-color':'Màu viền',
    'outline-width':'Chiều rộng',
    'outline-style':'Kiểu viền'
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
    'theme-value-min',
    'theme-value-max',
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
                title:'Thuộc tính vẽ',
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
                title: 'Biểu tượng',
                properties: [
                    'symbol-enabled',
                    'symbol-image',
                    'symbol-scale',
                ]
            },
            {
                name: 'text',
                title:'Chữ',
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
                title:'Thuộc tính vẽ',
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
                title:'Chữ',
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
                title:'Thuộc tính vẽ',
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
                title:'Màu nền',
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
                title:'Chữ',
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
