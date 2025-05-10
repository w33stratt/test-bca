import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as SaldoActions from '../actions/saldo.action';
import { of } from 'rxjs';
import { SaldoService } from '../../../components/user/saldo-list/service/saldo.service';

@Injectable()
export class SaldoEffects {
    constructor(
        private actions$: Actions,
        private saldoService: SaldoService
    ) { }

    loadSaldo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SaldoActions.loadSaldo),
            switchMap(() => {
                const saldoObservable = this.saldoService.getSaldo();

                if (!saldoObservable) {
                    return of(SaldoActions.loadSaldoFailure({ error: 'No data returned' }));
                }

                return saldoObservable.pipe(
                    map((saldo) => SaldoActions.loadSaldoSuccess({ saldo })),
                    catchError((error) =>
                        of(SaldoActions.loadSaldoFailure({ error: error.message }))
                    )
                );
            })
        )
    );
}
