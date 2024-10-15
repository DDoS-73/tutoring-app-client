export interface Statistics {
    labels: string[];
    paidData: number[];
    unpaidData: number[];
    hoursData: number[];
    unpaidAmount: number;
    workObjects: {
        paid: WorkObjectStatistics;
        unpaid: WorkObjectStatistics;
    };
}

export interface WorkObjectStatistics {
    labels: string[];
    data: number[];
}
