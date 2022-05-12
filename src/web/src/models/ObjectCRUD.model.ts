export interface BaseObjectCRUD {
    IsActive: boolean;
    IsDeleted: boolean;

    CreatedDate?: string;
    CreatedBy?: string;

    UpdatedDate?: string;
    UpdatedBy?: string;
}