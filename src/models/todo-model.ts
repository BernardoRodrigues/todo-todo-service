import { PriorityModel } from "./priority-model";

export interface TodoModel {

    id: string;
    userId: string;
    startDate: Date | string;
    endDate: Date | string;
    title: string;
    isDone: boolean;
    isCancelled: boolean;
    priority: PriorityModel;

}