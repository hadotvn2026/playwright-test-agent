import { test, expect } from '@playwright/test';

test('verify max due person is Jason Doe', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables')

    // list objects
    let rowsObject = [];
    const rows = await page.locator('#table1 tbody tr').all();

    for (const row of rows) {
        const cells = await row.locator('td').all();
        const lastName = await cells[0].textContent();
        const firstName = await cells[1].textContent();
        const dueCell = await cells[3].textContent();
        const due = parseFloat(dueCell?.replace('$', '') || '0'); // Remove the dollar sign from the due value and convert to float
        rowsObject.push({
            lastName,
            firstName,
            due
        });
    }

    const dueValues = rowsObject.map(row => row.due);
    const maxDue = Math.max(...dueValues);

    const maxDuePerson: string[] = rowsObject
        .filter(row => row.due === maxDue)
        .map(row => `${row.firstName} ${row.lastName}`);

    expect(maxDuePerson).toStrictEqual(['Jason Doe']);
})

test('verify sort by lastname a-z or z-a', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/tables')

    // Click on the "Last Name" header to sort the table by last name
    await page.locator('#table1').getByRole('columnheader', { name: 'Last Name' }).click();
    await page.locator('#table1').getByRole('columnheader', { name: 'Last Name' }).click();
    // list objects
    let rowsObject = [];
    const rows = await page.locator('#table1 tbody tr').all();

    for (const row of rows) {
        const cells = await row.locator('td').all();
        const lastName = await cells[0].textContent();
        const firstName = await cells[1].textContent();
        const dueCell = await cells[3].textContent();
        const due = parseFloat(dueCell?.replace('$', '') || '0'); // Remove the dollar sign from the due value and convert to float
        rowsObject.push({
            lastName,
            firstName,
            due
        });
    }
    const lastNames = rowsObject.map(row => row.lastName);
    console.log('Last Names:', lastNames);
    const sortedLastNames = lastNames.sort((a, b) => b.localeCompare(a)); // sort the last names in ascending order
    console.log('Sorted Last Names:', sortedLastNames);
    expect(lastNames).toEqual(sortedLastNames); // compare the original last names with the sorted last names
})