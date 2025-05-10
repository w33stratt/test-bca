import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaldoListComponent } from './saldo-list/saldo-list.component';

const routes: Routes = [
    {
        path: 'user/dashboard',
        // data: { roles: ['Admin'] },
        // component: DashboardComponent,
        // canActivate: [AuthGuard],
    },
    {
        path: 'user/test',
        // data: { roles: ['Admin'] },
        // component: TestComponent,
        // canActivate: [AuthGuard],
    },
    { path: 'user/saldo-list', component: SaldoListComponent },
    // { path: 'transaction-list', component: TransactionListComponent },
    // { path: '', redirectTo: '/saldo-list', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule { }