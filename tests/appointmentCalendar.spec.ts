import { test, expect } from '../fixtures/heroku.fixture';

test.describe('Date & Time Pickers - calendar widget (Appointment)', () => {
    test('opens on the month given in ?month', async ({ dateTimePickersPage }) => {
        await dateTimePickersPage.openCalendarAt('2026-02');

        await expect(dateTimePickersPage.calendar).toBeVisible();
        await expect(dateTimePickersPage.calendarMonth).toHaveText('February 2026');
    });

    test('Next month and Previous month change the shown month', async ({ dateTimePickersPage }) => {
        await dateTimePickersPage.openCalendarAt('2026-02');

        await dateTimePickersPage.moveCalendar(1);
        await expect(dateTimePickersPage.calendarMonth).toHaveText('March 2026');

        await dateTimePickersPage.moveCalendar(-1);
        await expect(dateTimePickersPage.calendarMonth).toHaveText('February 2026');
    });

    test('rolls over to the next year after December', async ({ dateTimePickersPage }) => {
        await dateTimePickersPage.openCalendarAt('2026-12');

        await dateTimePickersPage.moveCalendar(1);

        await expect(dateTimePickersPage.calendarMonth).toHaveText('January 2027');
    });

    test('picking a day fills Appointment with YYYY-MM-DD and closes the calendar', async ({ dateTimePickersPage }) => {
        await dateTimePickersPage.openCalendarAt('2026-02');
        await dateTimePickersPage.moveCalendar(1);

        await dateTimePickersPage.pickAppointmentDay(14);

        await expect(dateTimePickersPage.appointmentInput).toHaveValue('2026-03-14');
        await expect(dateTimePickersPage.calendar).toBeHidden();
    });

    test('Appointment field is read-only', async ({ dateTimePickersPage }) => {
        await dateTimePickersPage.open();

        await expect(dateTimePickersPage.appointmentInput).not.toBeEditable();
    });
});
