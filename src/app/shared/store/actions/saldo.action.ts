import { createAction, props } from '@ngrx/store';

export const loadSaldo = createAction('[Saldo] Load Saldo');
export const loadSaldoSuccess = createAction('[Saldo] Load Saldo Success', props<{ saldo: any[] }>());
export const loadSaldoFailure = createAction('[Saldo] Load Saldo Failure', props<{ error: string }>());

export const addSaldo = createAction('[Saldo] Add Saldo', props<{ saldo: any }>());
export const updateSaldo = createAction('[Saldo] Update Saldo', props<{ saldo: any }>());
export const deleteSaldo = createAction('[Saldo] Delete Saldo', props<{ id: number }>());
