import axios, { AxiosInstance, AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MapInfo } from '../../interfaces';

let lastId = 5;
const maps: MapInfo[] = [
    {
        Id: "Map1",
        Name: "Map Khu vực 1",
        Layers: []
    },
    {
        Id: "Map2",
        Name: "Map Tp. HCM",
        Layers: []
    },
    {
        Id: "Map3",
        Name: "Map Tỉnh Đồng Tháp",
        Layers: []
    },
    {
        Id: "Map4",
        Name: "Map 4",
        Layers: []
    },
    {
        Id: "Map5",
        Name: "Map 5",
        Layers: []
    }
];

const mockMapApi = (axiosInstance: AxiosInstance) => {
    const mockMapApi = new MockAdapter(axiosInstance, { delayResponse: 500 });
    mockMapApi.onGet('/maps')
        .reply(200, maps);

    mockMapApi.onPost('/maps')
        .reply((config) => {
            let data = JSON.parse(config.data);
            lastId++;
            data.Id = "Map" + lastId;
            maps.push(data);
            return [200, data];
        });

    mockMapApi.onPut(/\/maps\/\s+/)
        .reply((config) => {
            const url = config.url;
            const data = JSON.parse(config.data);
            return [200, data];
        });

    mockMapApi.onDelete(/\/maps\/\s+/)
        .reply((config) => {
            const url = config.url;
            const data = JSON.parse(config.data);
            return [200, data];
        });

}

export default mockMapApi;