import {Pipe, PipeTransform} from "@angular/core";

/**
 * This pipe transforms an object with property names into an array with its property values
 * @see https://webcake.co/object-properties-in-angular-2s-ngfor/
 */
@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
  transform(value: any, args?: any[]): any[] {
    // create instance vars to store keys and final output
    let keyArr: any[] = Object.keys(value),
      dataArr = [];

    // loop through the object,
    // pushing values to the return array
    keyArr.forEach((key: any) => {
      dataArr.push(value[key]);
    });

    // return the resulting array
    return dataArr;
  }
}
