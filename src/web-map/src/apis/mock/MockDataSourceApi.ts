import axios, { AxiosInstance, AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { DataSource, DataSourceType, GeoType } from '../../interfaces';

let lastId = 5;
const datasources: DataSource[] = [
    {
        Id: "Source1",
        Name: "Bản đồ nền 1",
        SourceFile: "shapfile.zip",
        DataSourceType: DataSourceType.ShapeFile,
        GeoType: GeoType.Fill,
        Properties: {}
    },
    {
        Id: "Source2",
        Name: "Đường nội bộ",
        SourceFile: "shapfile1.zip",
        DataSourceType: DataSourceType.ShapeFile,
        GeoType: GeoType.Line,
        Properties: {}
    }, 
    {
        Id: "Source3",
        Name: "Cơ quan hành chính",
        SourceFile: "shapfile2.zip",
        DataSourceType: DataSourceType.ShapeFile,
        GeoType: GeoType.Point,
        Properties: {}
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