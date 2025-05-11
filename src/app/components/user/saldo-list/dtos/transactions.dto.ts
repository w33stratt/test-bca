export interface TransactionDTO {
    id: number;
    transactionType: string;
    transactionAmount: number;
    transactionInputDate: string;
    transactionUpdateDate: string | null; // Nullable karena bisa bernilai null
}