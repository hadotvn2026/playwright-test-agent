import { test as base } from '@playwright/test';
import { BmiCalculatorPage } from '../../pages/bmi-calculator.page';

type CalculatorFixtures = {
    bmiCalculatorPage: BmiCalculatorPage,
}

export const test = base.extend<CalculatorFixtures>({
    bmiCalculatorPage: async ({ page }, use) => {
        await use(new BmiCalculatorPage(page));
    },
});

export { expect } from '@playwright/test';
