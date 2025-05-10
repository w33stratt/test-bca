import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { SaldoService } from './service/saldo.service';
import { SaldoDTO } from './dtos/saldo.dto';
import { Subject, Subscription, catchError, of, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-saldo-list',
  templateUrl: './saldo-list.component.html',
  styleUrl: './saldo-list.component.css'
})
export class SaldoListComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject();
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();

  saldoList: SaldoDTO[] = [];
  transactions: any[] = [];
  selectedSaldoId: any;
  addSaldoForm: any;
  addTransactionForm: any;
  loading = false;

  constructor(private fb: FormBuilder, private saldoService: SaldoService) {
    // Form untuk menambah saldo baru
    this.addSaldoForm = this.fb.group({
      saldoName: ['', Validators.required],
      saldoAmount: [0, [Validators.required, Validators.min(1)]],
    });

    // Form untuk menambah transaksi baru
    this.addTransactionForm = this.fb.group({
      transactionType: ['', Validators.required],
      transactionAmount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.getSaldoList();
  }

  // Mengambil daftar saldo 
  getSaldoList(): void {
    this.loading = true;
    this.saldoService.getSaldo().pipe(
      catchError(error => {
        alert('Gagal mengambil data saldo: ' + error);
        return of([]);
      }),
      takeUntil(this.unsubscribe$)
    )
      .subscribe(response => {
        this.saldoList = response;
        this.loading = false;
      });
  }

  // Mengambil transaksi berdasarkan saldo ID 
  onViewTransactions(saldoId: any): void {
    this.selectedSaldoId = saldoId;
    this.loading = true;
    this.saldoService.getTransactions(saldoId).pipe(
      catchError(error => {
        alert('Gagal mengambil transaksi: ' + error);
        return of([]);
      }),
      takeUntil(this.unsubscribe$)
    )
      .subscribe(transactions => {
        this.transactions = transactions;
        this.loading = false;
      });
  }

  // Menambahkan saldo baru 
  onAddSaldo(): void {
    if (this.addSaldoForm.valid) {
      const newSaldo = this.addSaldoForm.value;
      this.saldoService.addSaldo(newSaldo).pipe(
        switchMap(() => this.saldoService.getSaldo()),
        catchError(error => {
          alert('Gagal menambahkan saldo: ' + error);
          return of([]);
        }),
        takeUntil(this.unsubscribe$)
      )
        .subscribe(response => {
          this.saldoList = response;
          alert('Saldo berhasil ditambahkan!');
          this.addSaldoForm.reset();
        });
    }
  }

  // Menambahkan transaksi baru 
  onAddTransaction(): void {
    if (this.addTransactionForm.valid && this.selectedSaldoId !== null) {
      const newTransaction = { ...this.addTransactionForm.value, saldoId: this.selectedSaldoId };
      this.saldoService.addTransaction(newTransaction).pipe(
        switchMap(() => this.saldoService.getTransactions(this.selectedSaldoId)), // Refresh transaksi setelah berhasil menambah transaksi
        catchError(error => {
          alert('Gagal menambahkan transaksi: ' + error);
          return of([]);
        }),
        takeUntil(this.unsubscribe$)
      )
        .subscribe(transactions => {
          this.transactions = transactions;
          alert('Transaksi berhasil ditambahkan!');
          this.addTransactionForm.reset();
        });
    }
  }

  // Mengaktifkan saldo 
  onActivate(saldo: any): void {
    this.saldoService.activateSaldo(saldo.id).pipe(
      switchMap(() => this.saldoService.getSaldo()),
      catchError(error => {
        alert('Gagal mengaktifkan saldo: ' + error);
        return of([]);
      }),
      takeUntil(this.unsubscribe$)
    )
      .subscribe(response => {
        this.saldoList = response;
        alert('Saldo berhasil diaktifkan!');
      });
  }

  // Menonaktifkan saldo 
  onDeactivate(saldo: any): void {
    this.saldoService.deactivateSaldo(saldo.id).pipe(
      switchMap(() => this.saldoService.getSaldo()), // Refresh daftar saldo setelah menonaktifkan saldo
      catchError(error => {
        alert('Gagal menonaktifkan saldo: ' + error);
        return of([]);
      }),
      takeUntil(this.unsubscribe$)
    )
      .subscribe(response => {
        this.saldoList = response;
        alert('Saldo berhasil dinonaktifkan!');
      });
  }

  // Export transaksi ke PDF
  // exportToPDF(): void {
  //   const doc = new jsPDF();
  //   doc.text('Daftar Transaksi', 10, 10);
  //   this.transactions.forEach((transaction, index) => {
  //     doc.text(`${transaction.transactionType}: Rp ${transaction.transactionAmount}`, 10, 20 + index * 10);
  //   });
  //   doc.save('transaksi-list.pdf');
  // }

  // Export transaksi ke Excel
  // exportToExcel(): void {
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('transactions-table')!);
  //   const wb: XLSX.WorkBook = { Sheets: { 'Transaksi': ws }, SheetNames: ['Transaksi'] };
  //   XLSX.writeFile(wb, 'transaksi-list.xlsx');
  // }
  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
}
