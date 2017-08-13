import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Problem } from '../data-structure/problem';
import { PROBLEMS } from '../mock-problems';

@Injectable()
export class DataService {

  //problems: Problem[] = PROBLEMS;

  private _problemSource = new BehaviorSubject<Problem[]>([]);

  constructor(private http: Http) { }


  getProblems() : Observable<Problem[]> {
     //return this.problems;
     this.http.get('api/v1/problems')
      .toPromise()
      .then((res: Response) => {
        this._problemSource.next(res.json())
      })
      .catch(this.errorHandler);

      return this._problemSource.asObservable();
  }

  getProblem(id:number) {
    //return this.problems.find((problem) => problem.id===id);
    return this.http.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res: Response) => {
        return res.json();
      })
      .catch(this.errorHandler);
  }


  addProblem(problem : Problem) {
    // problem.id = this.problems.length + 1;
    // this.problems.push(problem);
    const headers = new Headers({"contetn-type":"application/json"});
    this.http.post('api/v1/problems', problem, headers)
      .toPromise()
      .then((res: Response) => {
        this.getProblems();
        return res.json();
      })
      .catch(this.errorHandler);
  }


  buildAndRun(data: any): Promise<Object> {
    const headers = new Headers({"content-type":"application/json"});
    return this.http.post('api/v1/build_and_run', data, headers)
      .toPromise()
      .then((res: Response) => {
        console.log('in client side build and run', res);
        return res.json();
      })
      .catch(this.errorHandler);
  }


  private errorHandler(error:any): Promise<any> {
    console.log('an error occurred');
    return Promise.reject(error);
  }

}

