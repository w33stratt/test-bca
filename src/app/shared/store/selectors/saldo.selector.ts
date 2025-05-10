import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SaldoState } from '../reducers/saldo.reducer';

export const selectSaldoState = createFeatureSelector<SaldoState>('saldo');

export const selectAllSaldo = createSelector(
    selectSaldoState,
    (state: SaldoState) => state.saldo
);
