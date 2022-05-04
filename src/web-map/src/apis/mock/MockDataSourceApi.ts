import axios, { AxiosInstance, AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { DataSource, DataSourceType, GeoType } from '../../interfaces';

let lastId = 5;
const datasources: DataSource[] = [
    {
        id: "Source1",
        name: "Bản đồ nền 1",
        pourceFile: "shapfile.zip",
        dataSourceType: DataSourceType.shapeFile,
        geoType: GeoType.fill,
        properties: {}
    },
    {
        id: "Source2",
        name: "Đường nội bộ",
        pourceFile: "shapfile1.zip",
        dataSourceType: DataSourceType.shapeFile,
        geoType: GeoType.line,
        properties: {}
    }, 
    {
        id: "Source3",
        name: "Cơ quan hành chính",
        pourceFile: "shapfile2.zip",
        dataSourceType: DataSourceType.shapeFile,
        geoType: GeoType.point,
        properties: {}
    }
];
const mockDataSourceApi = (axiosInstance: AxiosInstance) => {
    const mockApi = new MockAdapter(axiosInstance, { delayResponse: 500 });
    mockApi.onGet('/datasources')
        .reply(200, datasources);

        mockApi.onPost('/datasources')
        .reply((config) => {
            let data = JSON.parse(config.data);
            lastId++;
            data.Id = "Source" + lastId;
            datasources.push(data);
            return [200, data];
        });

        mockApi.onPut(/\/datasources\/\s+/)
        .reply((config) => {
            const url = config.url;
            const data = JSON.parse(config.data);
            return [200, data];
        });

        mockApi.onDelete(/\/datasources\/\s+/)
        .reply((config) => {
            const url = config.url;
            const data = JSON.parse(config.data);
            return [200, data];
        });
}

export default mockDataSourceApi;