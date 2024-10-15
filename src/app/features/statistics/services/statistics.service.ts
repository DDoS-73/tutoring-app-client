import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Statistics } from '../models/statistics.model';

@Injectable()
export class StatisticsService {
    private url = environment.backendApi;

    constructor(private http: HttpClient) {}

    public getMonthStatistics(dayOfMonth: string) {
        const params = { dayOfMonth };
        return this.http.get<Statistics>(`${this.url}/statistics/month`, {
            params,
        });
    }
}
