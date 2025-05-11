import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaldoService } from './service/saldo.service';
import { SaldoDTO } from './dtos/saldo.dto';
import { Subject, Subscription, catchError, of, switchMap, takeUntil } from 'rxjs';
import { TransactionDTO } from './dtos/transactions.dto';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-saldo-list',
  templateUrl: './saldo-list.component.html',
  styleUrl: './saldo-list.component.css'
})
export class SaldoListComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject();
  _onDestroy$: Subject<Boolean> = new Subject<Boolean>();

  saldoList: SaldoDTO[] = [];
  transactions: TransactionDTO[] = [];
  selectedSaldoId: number = 0;
  selectedTransaction: any;
  addSaldoForm: FormGroup;
  addTransactionForm: FormGroup;
  loading = false;
  editTransactionForm: FormGroup;

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

    this.editTransactionForm = this.fb.group({
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
      const newTransaction = { ...this.addTransactionForm.value, idSaldo: this.selectedSaldoId };
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
          this.getSaldoList();
        });
    }
  }

  // Mengedit transaksi
  onEditTransaction(transaction: any): void {
    this.selectedTransaction = transaction;  // Menyimpan transaksi yang dipilih
    this.editTransactionForm.setValue({
      transactionType: transaction.transactionType,
      transactionAmount: transaction.transactionAmount,
    });
  }

  onSubmitEditTransaction(): void {
    if (this.editTransactionForm.valid) {
      const updatedTransaction = this.editTransactionForm.value;
      const transactionUpdateDate = new Date().toISOString();
      updatedTransaction.transactionUpdateDate = transactionUpdateDate;

      this.saldoService.editTransaction(this.selectedTransaction!.id, updatedTransaction).subscribe({
        next: (response) => {
          alert('Transaksi berhasil diperbarui!');
          this.onViewTransactions(this.selectedSaldoId);  // Refresh transaksi
          this.getSaldoList();  // Refresh daftar saldo
          this.editTransactionForm.reset();
        },
        error: (error) => {
          alert('Gagal mengedit transaksi: ' + error);
        },
      });
    }
  }

  // Menghapus transaksi
  onDeleteTransaction(transactionId: number): void {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      this.saldoService.deleteTransaction(transactionId).subscribe({
        next: (response) => {
          alert('Transaksi berhasil dihapus!');
          this.onViewTransactions(this.selectedSaldoId);  // Refresh transaksi
          this.getSaldoList();  // Refresh daftar saldo
        },
        error: (error) => {
          alert('Gagal menghapus transaksi: ' + error);
        },
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

  // Export to PDF (Mencakup Saldo dan Transaksi)
  exportToPDF(): void {
    const doc = new jsPDF();

    const saldo = this.saldoList.find((saldo) => saldo.id === this.selectedSaldoId);
    if (saldo) {
      doc.text(`Nama Saldo: ${saldo.saldoName}`, 10, 10);
      doc.text(`Jumlah Saldo: Rp ${saldo.saldoAmount}`, 10, 20);
      doc.text(`Status: ${saldo.saldoStatus}`, 10, 30);
      doc.text('Transaksi:', 10, 40);
    }

    // Menambahkan Transaksi
    let y = 60;
    this.transactions.forEach((transaction, index) => {
      doc.text(`Transaksi #${index + 1}`, 10, y);
      doc.text(`Jenis Transaksi: ${transaction.transactionType}`, 10, y + 10);
      doc.text(`Nominal: Rp ${transaction.transactionAmount}`, 10, y + 20);
      doc.text(`Tanggal Transaksi: ${transaction.transactionInputDate}`, 10, y + 30);
      doc.text(`Tanggal Edit Transaksi: ${transaction.transactionUpdateDate}`, 10, y + 40);
      y += 50;
    });

    doc.save('transaksi-report.pdf');
  }

  // Export to Excel (Mencakup Saldo dan Transaksi)
  exportToExcel(): void {
    const saldoData = this.saldoList.find((saldo) => saldo.id === this.selectedSaldoId);

    const reportData = this.transactions.map((transaction) => ({
      "Saldo Name": saldoData ? saldoData.saldoName : '',
      "Saldo Amount": saldoData ? saldoData.saldoAmount : 0,
      "Transaction Type": transaction.transactionType,
      "Transaction Amount": transaction.transactionAmount,
      "Transaction Date": transaction.transactionInputDate,
      "Transaction Update Date": transaction.transactionUpdateDate,
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(reportData);
    const wb: XLSX.WorkBook = { Sheets: { 'Transaksi': ws }, SheetNames: ['Transaksi'] };
    XLSX.writeFile(wb, 'transaksi-report.xlsx');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }
}
