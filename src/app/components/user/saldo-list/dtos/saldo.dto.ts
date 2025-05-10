export interface SaldoDTO {
    id?: number;
    saldoName: string;
    saldoAmount: number;
    saldoStatus?: 'Aktif' | 'Nonaktif';
}