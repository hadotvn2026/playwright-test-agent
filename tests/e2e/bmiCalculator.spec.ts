import { test, expect } from '../../fixtures/e2e/calculator.fixture';
import { type MetricBmiInput } from '../../pages/bmi-calculator.page';
import { calculateBmi, classifyBmi, type BmiClassification } from '../../utils/e2eUtils/bmi.utils';

test('BMI calculator page is displayed', async ({ bmiCalculatorPage }) => {
    await bmiCalculatorPage.open();
    await expect(bmiCalculatorPage.heading).toBeVisible();
});

const cases: Array<{ classification: BmiClassification, input: MetricBmiInput }> = [
    { classification: 'Severe thinness', input: { age: 30, gender: 'Female', heightCm: 170, weightKg: 44 } },
    { classification: 'Moderate thinness', input: { age: 25, gender: 'Male', heightCm: 170, weightKg: 47 } },
    { classification: 'Mild thinness', input: { age: 40, gender: 'Female', heightCm: 170, weightKg: 51 } },
    { classification: 'Normal', input: { age: 35, gender: 'Male', heightCm: 170, weightKg: 63 } },
    { classification: 'Overweight', input: { age: 50, gender: 'Female', heightCm: 170, weightKg: 79 } },
    { classification: 'Obese Class I', input: { age: 45, gender: 'Male', heightCm: 170, weightKg: 94 } },
    { classification: 'Obese Class II', input: { age: 60, gender: 'Female', heightCm: 170, weightKg: 108 } },
    { classification: 'Obese Class III', input: { age: 28, gender: 'Male', heightCm: 170, weightKg: 130 } },
];

cases.forEach(({ classification, input }) => {
    test(`metric BMI for ${input.weightKg} kg / ${input.heightCm} cm is classified as ${classification}`, async ({ bmiCalculatorPage }) => {
        const expectedBmi = calculateBmi(input.weightKg, input.heightCm);
        expect(classifyBmi(expectedBmi)).toBe(classification);

        await bmiCalculatorPage.open();
        await bmiCalculatorPage.calculateMetric(input);

        await expect(bmiCalculatorPage.result).toHaveText(`BMI = ${expectedBmi} kg/m2 (${classification})`);
    });
});
