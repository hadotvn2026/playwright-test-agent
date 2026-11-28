import { test, expect } from '../../fixtures/e2e/heroku.fixture';

test('verify max due person is Jason Doe', async ({ tablePage }) => {
    await tablePage.open();
    const maxDuePerson = await tablePage.getMaxDuePerson('table1');
    expect(maxDuePerson).toStrictEqual(['Jason Doe']);
})