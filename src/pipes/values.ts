import {Pipe, PipeTransform} from "@angular/core";

/**
 * This pipe transforms an object with property names into an array with its property values
 * @see https://webcake.co/object-properties-in-angular-2s-ngfor/
 */
@Pipe({
  name: 'values',
  pure: false
})
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

    /*
     * Sort array objects if first arg is "sort"
     */
    if(args && args.indexOf("sort") > -1) {

      // Sort "hardcoded" by distance-beeline
      dataArr.sort((a: Object, b: Object): number => {
        return a['route']['distance-beeline'] > b['route']['distance-beeline'] ? 1 : -1;
      });
    }

    // return the resulting array
    return dataArr;
  }

  /**
   * Helper method extracts sort by criteria from string
   * @param argument
   */
  private extractSortByCriteria(argument: String): String {

    let start = argument.indexOf("(");
    let end = argument.indexOf(")");

    return argument.substr(start, end);
  }
}
