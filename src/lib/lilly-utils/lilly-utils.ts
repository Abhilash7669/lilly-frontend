import { StatusValue, TodoData } from "@/app/(protected)/dashboard/workspace/todo/_types/type";


export class LILLY_DATE {

    static startOfTodayUTC(): Date {
        const date = new Date();

        const startOfDayUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

        const utcISOString = startOfDayUTC;

        return utcISOString;
    }

    static endOfTodayUTC(): Date {
        const date = new Date();

        const endOfDayUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

        const utcISOString = endOfDayUTC;
        return utcISOString;
    };

    static toUTC(date: Date) {
        const targetDate = new Date(date);
        const utcDate = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate()));
        return utcDate;
    }

    static toISOString(date: Date | undefined): string {

        if(!date) return "";

        const toISOString = date.toISOString();
        return toISOString;
    }

}

export class LILLY_TODO {

    static findUpdatedContainerIndex(containersArray: TodoData[], status: StatusValue) {
        const containerIndex = containersArray.findIndex(
            item => item.status === status
        );

        if(containerIndex === -1) return -1;

        return containerIndex;
    }

}