import {Pipe, PipeTransform} from '@angular/core';
import {Post} from '../../shared/interfaces';

@Pipe({
  name: 'searchPosts'
})
export class SearchPipe implements PipeTransform {
  transform(posts: Post[], search = ''): Post[] {
    return search.trim()
      ? posts.filter(({ title }) => title.toLowerCase().includes(search.toLowerCase()))
      : posts;
  }
}
