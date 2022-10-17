// file deepcode ignore no-invalid-this: the this keyword is being used for testing purposes only in this file
const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

process.env.NODE_ENV = 'test';

// TODO: expose API from Calendar so this duplication is not needed
const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
const weekDay = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];

function log(msg)
{
    console.log(`${(new Date()).toISOString().substr(0, 19)}: ${msg}`);
}

describe('Application launch', function()
{
    this.timeout(10000);
    beforeEach(async function()
    {
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..')],
            waitTimeout: 10000,
            quitTimeout: 200
        });
        log('Start app...')
        await this.app.start();
        log('App started.')
    });

    afterEach(async function()
    {
        log(`App is running: ${this.app && this.app.isRunning()}`)
        if (this.app && this.app.isRunning())
        {
            log('Stop app...');
            await this.app.stop();
            log('App stoped');
        }
    });

    it('App opens correctly', async function()
    {
        log('Running test');
        const { client, browserWindow } = this.app;
        await client.waitUntilWindowLoaded();
        const title = await browserWindow.getTitle();
        assert.equal(title, 'Time to Leave');
        log('Running test - Done');
    });

    it('Calendar opens on Current Month/Year', async function()
    {
        log('Running test');
        const { client } = this.app;
        await client.waitUntilWindowLoaded();

        const monthYear = await client.$('#month-year');
        const monthYearText = await monthYear.getText();
        const today = new Date();
        assert.equal(monthYearText, `${months[today.getMonth()]} ${today.getFullYear()}`);
        log('Running test - Done');
    });

    it('Change to Day View', async function()
    {
        log('Running test');
        const { client } = this.app;
        await client.waitUntilWindowLoaded();

        const switchViewBtn = await client.$('#switch-view');
        await switchViewBtn.click();
        const headerDate = await client.$('#header-date');
        const headerDateText = await headerDate.getText();
        const today = new Date();
        assert.equal(headerDateText, `${weekDay[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`);
        log('Running test - Done');
    });

    it('Calendar change to previous Month', async function()
    {
        log('Running test');
        const { client } = this.app;
        await client.waitUntilWindowLoaded();

        const prevMonth = await client.$('#prev-month');
        prevMonth.click();
        const monthYear = await client.$('#month-year');
        const monthYearText = await monthYear.getText();
        const today = new Date();
        const prevMonthDate = new Date(today.getFullYear(), today.getMonth(), -1);
        assert.equal(monthYearText, `${months[prevMonthDate.getMonth()]} ${prevMonthDate.getFullYear()}`);
        log('Running test - Done');
    });

    it('Calendar change to next Month', async function()
    {
        log('Running test');
        const { client } = this.app;
        await client.waitUntilWindowLoaded();

        const nextMonth = await client.$('#next-month');
        nextMonth.click();
        const monthYear = await client.$('#month-year');
        const monthYearText = await monthYear.getText();
        const today = new Date();
        const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        assert.equal(monthYearText, `${months[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`);
        log('Running test - Done');
    });

    it('Calendar change to pervious Day', async function()
    {
        log('Running test');
        const { client } = this.app;
        await client.waitUntilWindowLoaded();
        const switchViewBtn = await client.$('#switch-view');
        await switchViewBtn.click();
        const prevDay = await client.$('#prev-day');
        prevDay.click();
        const headerDate = await client.$('#header-date');
        const headerDateText = await headerDate.getText();
        const today = new Date();
        const previousDayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        assert.equal(headerDateText, `${weekDay[previousDayDate.getDay()]}, ${months[previousDayDate.getMonth()]} ${previousDayDate.getDate()}, ${previousDayDate.getFullYear()}`);
        log('Running test - Done');
    });

    it('Calendar change to next Day', async function()
    {
        log('Running test');
        const { client } = this.app;
        await client.waitUntilWindowLoaded();
        const switchViewBtn = await client.$('#switch-view');
        await switchViewBtn.click();
        const nextDay = await client.$('#next-day');
        nextDay.click();
        const headerDate = await client.$('#header-date');
        const headerDateText = await headerDate.getText();
        const today = new Date();
        const nextDayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        assert.equal(headerDateText, `${weekDay[nextDayDate.getDay()]}, ${months[nextDayDate.getMonth()]} ${nextDayDate.getDate()}, ${nextDayDate.getFullYear()}`);
        log('Running test - Done');
    });
});
