function getOrdinalSuffix(day: number): string {
    const lastTwoDigits = day % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return 'th';
    }

    return ({ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th');
}

export function formatDateWithOrdinalDay(
    date: Date,
    options: Intl.DateTimeFormatOptions,
): string {
    return new Intl.DateTimeFormat('en-US', options)
        .formatToParts(date)
        .map(({ type, value }) =>
            type === 'day' ? `${value}${getOrdinalSuffix(Number(value))}` : value,
        )
        .join('');
}

export function daysFromToday(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}
