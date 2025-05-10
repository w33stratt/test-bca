import { createReducer, on } from '@ngrx/store';
import * as SaldoActions from '../actions/saldo.action';
import { SaldoDTO } from '../../../components/user/saldo-list/dtos/saldo.dto';

export interface SaldoState {
    saldo: SaldoDTO[];
    error: string | null;
}

export const initialState: SaldoState = {
    saldo: [],
    error: null,
};

export const saldoReducer = createReducer(
    initialState,
    on(SaldoActions.loadSaldoSuccess, (state, { saldo }) => ({ ...state, saldo })),
    on(SaldoActions.loadSaldoFailure, (state, { error }) => ({ ...state, error }))
);
