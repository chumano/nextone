export interface BaseObjectCRUD {
    isActive: boolean;
    isDeleted: boolean;

    createdDate?: string;
    createdBy?: string | null;

    updatedDate?: string;
    updatedBy?: string | null;
}