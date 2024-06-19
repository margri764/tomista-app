import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentStatus',
  standalone: true
})
export class PaymentStatusPipe implements PipeTransform {

  transform( status:string): any {

    if(status === 'pending'){
      return 'Pendente'
    }else if(status === 'paid' ){
      return 'Pago'
    }else if(status === 'refund' || status === 'refunded' ){
      return 'Reembolsado'
    }
    return null;
  }

}
