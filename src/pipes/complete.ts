import {Pipe, PipeTransform} from "@angular/core";

/**
 * This pipe returns only data objects which have a "complete" flag
 * @see https://webcake.co/object-properties-in-angular-2s-ngfor/
 */
@Pipe({name: 'complete'})
export class CompletePipe implements PipeTransform {
  transform(value: any, args?: any[]): any[] {

    // create instance vars to store keys and final output
    let keyArr: any[] = Object.keys(value),
      dataArr = [];

    // loop through the object,
    keyArr.forEach((key: any) => {

      // pushing values to the return array,
      // BUT only if there is a flag "complete"
      if(value[key].hasOwnProperty("complete") && value[key]["complete"] == true) {
        dataArr.push(value[key]);
      }
    });

    // return the resulting array
    return dataArr;
  }
}
