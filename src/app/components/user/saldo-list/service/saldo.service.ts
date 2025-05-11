import { Injectable } from "@angular/core";
import { environment } from "../../../../environment/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, of } from "rxjs";
import { SaldoDTO } from "../dtos/saldo.dto";
import { TransactionDTO } from "../dtos/transactions.dto";

@Injectable({
    providedIn: 'root',
})
export class SaldoService {
    private baseUrl = '/APITestCoding/v1/Saldo';  // API base URL untuk saldo
    private baseUrlTransaksi = '/APITestCoding/v1/Transaksi';  // API base URL untuk transaksi

    constructor(private http: HttpClient) { }

    // Mengambil daftar saldo
    getSaldo(): Observable<SaldoDTO[]> {
        return this.http.get<SaldoDTO[]>(this.baseUrl).pipe(
            catchError((error) => {
                console.error('Error fetching saldo:', error);
                return of([]);
            })
        );
    }

    // Menambahkan saldo baru
    addSaldo(saldo: SaldoDTO): Observable<SaldoDTO> {
        return this.http.post<SaldoDTO>(`${this.baseUrl}/New`, saldo).pipe(
            catchError((error) => {
                console.error('Error adding saldo:', error);
                return of({} as SaldoDTO);
            })
        );
    }

    // Mengaktifkan saldo
    activateSaldo(id: number): Observable<SaldoDTO> {
        return this.http.post<SaldoDTO>(`${this.baseUrl}/Activate`, { id }).pipe(
            catchError((error) => {
                console.error('Error activating saldo:', error);
                return of({} as SaldoDTO);
            })
        );
    }

    // Menonaktifkan saldo
    deactivateSaldo(id: number): Observable<SaldoDTO> {
        return this.http.post<SaldoDTO>(`${this.baseUrl}/Inactive`, { id }).pipe(
            catchError((error) => {
                console.error('Error deactivating saldo:', error);
                return of({} as SaldoDTO);
            })
        );
    }

    // Menambahkan transaksi baru
    addTransaction(transaction: { transactionType: string; transactionAmount: number; idSaldo: number }): Observable<any> {
        return this.http.post<any>(`${this.baseUrlTransaksi}/New`, transaction).pipe(
            catchError((error) => {
                console.error('Error adding transaction:', error);
                return of(null);
            })
        );
    }

    // Mendapatkan transaksi berdasarkan saldo
    getTransactions(saldoId: number): Observable<TransactionDTO[]> {
        const body = { idSaldo: saldoId };

        return this.http.post<any[]>(`${this.baseUrlTransaksi}`, body).pipe(
            catchError((error) => {
                console.error('Error fetching transactions:', error);
                return of([]);
            })
        );
    }

    // Mengedit transaksi (menggunakan POST)
    editTransaction(transactionId: number, updatedTransaction: { transactionType: string; transactionAmount: number; transactionUpdateDate: string }): Observable<TransactionDTO | null> {
        const body = {
            id: transactionId,
            transactionType: updatedTransaction.transactionType,
            transactionAmount: updatedTransaction.transactionAmount,
            transactionUpdateDate: updatedTransaction.transactionUpdateDate,
        };

        return this.http.post<TransactionDTO>(`${this.baseUrlTransaksi}/Edit`, body).pipe(
            catchError((error) => {
                console.error('Error editing transaction:', error);
                return of(null);
            })
        );
    }

    // Menghapus transaksi
    deleteTransaction(transactionId: number): Observable<any> {
        const body = { id: transactionId }; // Body yang sesuai dengan format delete

        return this.http.post<any>(`${this.baseUrlTransaksi}/Delete`, body).pipe(
            catchError((error) => {
                console.error('Error deleting transaction:', error);
                return of(null);  // Mengembalikan null jika gagal
            })
        );
    }
}