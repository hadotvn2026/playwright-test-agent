export type BmiClassification =
    | 'Severe thinness'
    | 'Moderate thinness'
    | 'Mild thinness'
    | 'Normal'
    | 'Overweight'
    | 'Obese Class I'
    | 'Obese Class II'
    | 'Obese Class III';

// Upper bound (exclusive) of each adult BMI class, in kg/m², labelled as calculator.net shows them.
const CLASSIFICATION_UPPER_BOUNDS: ReadonlyArray<[number, BmiClassification]> = [
    [16, 'Severe thinness'],
    [17, 'Moderate thinness'],
    [18.5, 'Mild thinness'],
    [25, 'Normal'],
    [30, 'Overweight'],
    [35, 'Obese Class I'],
    [40, 'Obese Class II'],
    [Infinity, 'Obese Class III'],
];

/** BMI = weight (kg) / height (m)², rounded to one decimal place. */
export function calculateBmi(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Adult BMI classification for a BMI value in kg/m². */
export function classifyBmi(bmi: number): BmiClassification {
    for (const [upperBound, classification] of CLASSIFICATION_UPPER_BOUNDS) {
        if (bmi < upperBound) {
            return classification;
        }
    }
    return 'Obese Class III';
}
