import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentStatus',
  standalone: true
})
export class PaymentStatusPipe implements PipeTransform {

  transform( status:string): any {

    if(status === 'pending'){
      return 'pendente'
    }else if(status === 'paid' ){
      return 'pago'
    }
    return null;
  }

}
