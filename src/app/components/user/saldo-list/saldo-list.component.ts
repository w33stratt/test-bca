import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { SaldoService } from './service/saldo.service';
import { SaldoDTO } from './dtos/saldo.dto';

@Component({
  selector: 'app-saldo-list',
  templateUrl: './saldo-list.component.html',
  styleUrl: './saldo-list.component.css'
})
export class SaldoListComponent implements OnInit {
  saldoList: SaldoDTO[] = [];
  transactions: any[] = [];
  selectedSaldoId: any;
  addSaldoForm: any;
  addTransactionForm: any;

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
    this.saldoService.getSaldo().subscribe({
      next: (response) => {
        this.saldoList = response;
      },
      error: (error) => {
        alert('Gagal mengambil data saldo: ' + error);
      },
    });
  }

  // Mengambil transaksi berdasarkan saldo
  onViewTransactions(saldoId: any): void {
    this.selectedSaldoId = saldoId;
    this.saldoService.getTransactions(saldoId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (error) => {
        alert('Gagal mengambil transaksi: ' + error);
      },
    });
  }

  // Menambahkan saldo baru
  onAddSaldo(): void {
    if (this.addSaldoForm.valid) {
      const newSaldo = this.addSaldoForm.value;
      this.saldoService.addSaldo(newSaldo).subscribe({
        next: (response) => {
          alert('Saldo berhasil ditambahkan!');
          this.getSaldoList();  // Refresh daftar saldo
          this.addSaldoForm.reset();
        },
        error: (error) => {
          alert('Gagal menambahkan saldo: ' + error);
        },
      });
    }
  }

  // Menambahkan transaksi baru
  onAddTransaction(): void {
    if (this.addTransactionForm.valid && this.selectedSaldoId !== null) {
      const newTransaction = { ...this.addTransactionForm.value, saldoId: this.selectedSaldoId };
      this.saldoService.addTransaction(newTransaction).subscribe({
        next: (response) => {
          alert('Transaksi berhasil ditambahkan!');
          this.onViewTransactions(this.selectedSaldoId);  // Refresh transaksi
          this.addTransactionForm.reset();
        },
        error: (error) => {
          alert('Gagal menambahkan transaksi: ' + error);
        },
      });
    }
  }

  // Mengaktifkan saldo
  onActivate(saldo: any): void {
    this.saldoService.activateSaldo(saldo.id).subscribe({
      next: (response) => {
        alert('Saldo berhasil diaktifkan!');
        this.getSaldoList();  // Refresh daftar saldo
      },
      error: (error) => {
        alert('Gagal mengaktifkan saldo: ' + error);
      },
    });
  }

  // Menonaktifkan saldo
  onDeactivate(saldo: any): void {
    this.saldoService.deactivateSaldo(saldo.id).subscribe({
      next: (response) => {
        alert('Saldo berhasil dinonaktifkan!');
        this.getSaldoList();  // Refresh daftar saldo
      },
      error: (error) => {
        alert('Gagal menonaktifkan saldo: ' + error);
      },
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
}
