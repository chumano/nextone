import axios, { AxiosInstance, AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MapInfo } from '../../interfaces';

let lastId = 5;
const maps: MapInfo[] = [
    {
        id: "Map1",
        name: "Map Khu vực 1",
        layers: []
    },
    {
        id: "Map2",
        name: "Map Tp. HCM",
        layers: []
    },
    {
        id: "Map3",
        name: "Map Tỉnh Đồng Tháp",
        layers: []
    },
    {
        id: "Map4",
        name: "Map 4",
        layers: []
    },
    {
        id: "Map5",
        name: "Map 5",
        layers: []
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