import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})

export class SearchPipe implements PipeTransform {

  public transform(value:any, keys: string, term: string) {

    if (!term) return value;
    //@ts-ignore
    const searched = (value || []).filter(item => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));
    return searched

  }

}
