import { type Page, type Locator } from '@playwright/test';

export type Gender = 'Male' | 'Female';

export type MetricBmiInput = {
    age: number,
    gender: Gender,
    heightCm: number,
    weightKg: number,
};

export class BmiCalculatorPage {
    private readonly page: Page;
    private readonly metricUnitsTab: Locator;
    private readonly ageInput: Locator;
    private readonly heightInput: Locator;
    private readonly weightInput: Locator;
    private readonly genderLabels: Record<Gender, Locator>;
    private readonly calculateButton: Locator;
    readonly heading: Locator; // Exposed solely for web-first assertion in tests/
    readonly result: Locator; // Exposed solely for web-first assertion in tests/

    constructor(page: Page) {
        this.page = page;
        this.metricUnitsTab = page.getByRole('link', { name: 'Metric Units', exact: true });
        // The inputs have no accessible name: take the textbox of the innermost form row
        // whose label cell matches (the page's layout rows also contain these cells).
        const inputInRow = (label: string): Locator => page
            .getByRole('row')
            .filter({ hasNot: page.getByRole('row') })
            .filter({ has: page.getByRole('cell', { name: label, exact: true }) })
            .getByRole('textbox');
        this.ageInput = inputInRow('Age');
        this.heightInput = inputInRow('Height');
        this.weightInput = inputInRow('Weight');
        // The radio inputs are visually hidden behind custom marks; their visible label is clicked.
        this.genderLabels = {
            Male: page.getByText('Male', { exact: true }),
            Female: page.getByText('Female', { exact: true }),
        };
        this.calculateButton = page.getByRole('button', { name: 'Calculate' });
        this.heading = page.getByRole('heading', { name: 'BMI Calculator', level: 1 });
        this.result = page.getByText(/^BMI = [\d.]+ kg\/m2\s*\(.+\)$/);
    }

    async open(): Promise<void> {
        await this.page.goto('https://www.calculator.net/bmi-calculator.html');
    }

    /** Calculates BMI on the Metric Units tab and waits for the result page to load. */
    async calculateMetric({ age, gender, heightCm, weightKg }: MetricBmiInput): Promise<void> {
        await this.metricUnitsTab.click();
        await this.ageInput.fill(String(age));
        await this.genderLabels[gender].click();
        await this.heightInput.fill(String(heightCm));
        await this.weightInput.fill(String(weightKg));
        await this.calculateButton.click();
        await this.page.waitForURL('**/bmi-calculator.html?*ctype=metric*');
    }
}
