import { type Page, type Locator } from '@playwright/test';

type RowData = {
    lastName: string;
    firstName: string;
    due: number;
};

type TableId = 'table1' | 'table2';

const TABLE_INDEX: Record<TableId, number> = { table1: 0, table2: 1 };

const COLUMN = { lastName: 0, firstName: 1, due: 3 } as const;

export class TablePage {
    private readonly page: Page;
    private readonly tables: Locator;

    constructor(page: Page) {
        this.page = page;
        this.tables = page.getByRole('table');
    }

    async open(): Promise<void> {
        await this.page.goto('https://the-internet.herokuapp.com/tables');
    }

    async getTableData(tableId: TableId): Promise<RowData[]> {
        const rows = this.tables
            .nth(TABLE_INDEX[tableId])
            .getByRole('row')
            .filter({ has: this.page.getByRole('cell') });

        const data: RowData[] = [];
        for (const row of await rows.all()) {
            const cells = (await row.getByRole('cell').allTextContents()).map(text => text.trim());
            data.push({
                lastName: cells[COLUMN.lastName] ?? '',
                firstName: cells[COLUMN.firstName] ?? '',
                due: parseFloat((cells[COLUMN.due] ?? '').replace('$', '')),
            });
        }
        return data;
    }

    async getMaxDuePerson(tableId: TableId): Promise<string[]> {
        return this.getPeopleWithDue(tableId, Math.max);
    }

    async getMinDuePerson(tableId: TableId): Promise<string[]> {
        return this.getPeopleWithDue(tableId, Math.min);
    }

    private async getPeopleWithDue(
        tableId: TableId,
        pick: (...values: number[]) => number,
    ): Promise<string[]> {
        const tableData = await this.getTableData(tableId);
        const targetDue = pick(...tableData.map(row => row.due));
        return tableData
            .filter(row => row.due === targetDue)
            .map(row => `${row.firstName} ${row.lastName}`);
    }
}
