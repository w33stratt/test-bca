import { Injectable } from "@angular/core";
import { environment } from "../../../../environment/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { SaldoDTO } from "../dtos/saldo.dto";

@Injectable({
    providedIn: 'root',
})
export class SaldoService {
    private baseUrl = '/APITestCoding/v1/Saldo';
    private baseUrlTransaksi = '/APITestCoding/v1/Transaksi';

    constructor(private http: HttpClient) { }

    // Mengambil daftar saldo
    getSaldo(): Observable<SaldoDTO[]> {
        return this.http.get<SaldoDTO[]>(this.baseUrl);
    }

    // Menambahkan saldo baru
    addSaldo(saldo: { saldoName: string; saldoAmount: number }): Observable<SaldoDTO> {
        return this.http.post<SaldoDTO>(`${this.baseUrl}/New`, saldo);
    }

    // Mengaktifkan saldo
    activateSaldo(id: number): Observable<SaldoDTO> {
        return this.http.post<SaldoDTO>(`${this.baseUrl}/Activate`, { id });
    }

    // Menonaktifkan saldo
    deactivateSaldo(id: number): Observable<SaldoDTO> {
        return this.http.post<SaldoDTO>(`${this.baseUrl}/Inactive`, { id });
    }

    // Menambahkan transaksi baru
    addTransaction(transaction: { transactionType: string; transactionAmount: number; saldoId: number }): Observable<any> {
        return this.http.post<any>(`${this.baseUrlTransaksi}/New`, transaction);
    }

    // Mendapatkan transaksi berdasarkan saldo
    getTransactions(saldoId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrlTransaksi}/Transaksi?saldoId=${saldoId}`);
    }

    // Mengedit transaksi
    editTransaction(transactionId: number, updatedTransaction: { transactionType: string; transactionAmount: number }): Observable<any> {
        return this.http.put<any>(`${this.baseUrlTransaksi}/Transaksi/Edit/${transactionId}`, updatedTransaction);
    }

    // Menghapus transaksi
    deleteTransaction(transactionId: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrlTransaksi}/Transaksi/Delete/${transactionId}`);
    }
}