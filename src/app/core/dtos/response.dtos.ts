export interface ResponseArrayDTO<T> {
    message: string;
    status: number;
    data: DataDTO<T>;
}

export interface DataDTO<T> {
    data: T;
    length: number;
    result: T;
    total: number;
}

export interface ResponseObjectDTO<T> {
    message: string;
    status: number;
    data: T;
}