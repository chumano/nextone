export interface BaseObjectCRUD {
    isActive: boolean;
    isDeleted: boolean;

    createdDate?: string;
    createdBy?: string;

    updatedDate?: string;
    updatedBy?: string;
}