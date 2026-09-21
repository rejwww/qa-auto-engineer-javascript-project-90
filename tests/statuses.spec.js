import { test, expect }  from '../models/loggedPage.js'
import StatusesPage from '../models/StatusesPage.js'
import {statusesArr} from '../__fixtures__/ststusesData.js'


test.describe('создание новых статусов', ()=>{
test('отображение формы создания статуса', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.menuStatuses.click()
    await statusPageTaskManager.buttonCreate.click()

    await expect(statusPageTaskManager.inputName).toBeVisible();
    await expect(statusPageTaskManager.inputSlug).toBeVisible();
    await expect(statusPageTaskManager.buttonSave).toBeVisible();

})

test('cоздание статуса', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.menuStatuses.click()
    await statusPageTaskManager.buttonCreate.click()
    await statusPageTaskManager.createStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)
    await statusPageTaskManager.buttonSave.click()

    await expect(statusPageTaskManager.alert).toContainText('Element created');
  
    await statusPageTaskManager.menuStatuses.click()

    await expect(loggedPage.getByRole('cell', { name: statusPageTaskManager.status.name , exact: true })).toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: statusPageTaskManager.status.slug, exact: true })).toBeVisible();
})
})


test.describe('просмотр списка статусов', ()=>{
test('отображение таблицы статусов', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.menuStatuses.click()

    await expect(statusPageTaskManager.tableStatuses).toBeVisible()
    await expect(loggedPage.getByRole('columnheader', { name: 'Select all' })).toBeVisible();
    await expect(loggedPage.getByRole('columnheader', { name: 'Sort by id descending' })).toBeVisible();
    await expect(loggedPage.getByRole('columnheader', { name: 'Sort by name ascending' })).toBeVisible();
    await expect(loggedPage.getByRole('columnheader', { name: 'Sort by slug ascending' })).toBeVisible();
    await expect(loggedPage.getByRole('columnheader', { name: 'Sort by created at ascending' })).toBeVisible();

})

test('отображение списка статусов', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.menuStatuses.click()
    for(let status of statusesArr){
        const tr = loggedPage.getByRole('row')
                   .filter({ hasText: status.slug })
                   
        await expect(tr.getByRole('cell', {name: status.id , exact: true})).toBeVisible()
        await expect(tr.getByRole('cell', {name: status.name , exact: true})).toBeVisible()
  }
})
})


test.describe('pедактирование информации о статусах', ()=>{
test('отображение страницы редактирования статуса', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.completeСreationStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)
    await statusPageTaskManager.openRow(statusPageTaskManager.status.slug)

    await expect(statusPageTaskManager.inputName).toBeVisible();
    await expect(statusPageTaskManager.inputSlug).toBeVisible();
    await expect(statusPageTaskManager.buttonSave).toBeVisible();
    await expect(statusPageTaskManager.buttonDel).toBeVisible();
    await expect(statusPageTaskManager.buttonShow).toBeVisible();
    await expect(statusPageTaskManager.inputName).toHaveValue(statusPageTaskManager.status.name);
    await expect(statusPageTaskManager.inputSlug).toHaveValue(statusPageTaskManager.status.slug);
  
})

test('редактирование статуса', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.completeСreationStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)
    await statusPageTaskManager.openRow(statusPageTaskManager.status.slug)
    await statusPageTaskManager.inputName.fill('Done')
    await statusPageTaskManager.inputSlug.fill('done')
    await statusPageTaskManager.buttonSave.click()
    await expect(statusPageTaskManager.alert).toContainText('Element updated');

    await expect(loggedPage.getByRole('cell', { name: 'Done' , exact: true })).toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: 'done', exact: true })).toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: statusPageTaskManager.status.name , exact: true })).not.toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: statusPageTaskManager.status.slug, exact: true })).not.toBeVisible();

    const trUpdate = loggedPage.getByRole('row')
                 .filter({ hasText: 'done'})
    await trUpdate.click()

    await expect(statusPageTaskManager.inputName).toHaveValue('Done');
    await expect(statusPageTaskManager.inputSlug).toHaveValue('done');

    await statusPageTaskManager.buttonShow.click()

    await expect(loggedPage.getByText('NameDone')).toBeVisible();
    await expect(loggedPage.locator('#main-content')).toContainText('Done');
})
})


test.describe('удаление статусов', ()=>{
test('удаление одного статуса через карточку', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.completeСreationStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)
    await statusPageTaskManager.openRow(statusPageTaskManager.status.slug)
    await statusPageTaskManager.buttonDel.click()

    await expect(statusPageTaskManager.alert).toContainText('Element deleted');
    await expect(loggedPage.getByRole('cell', { name: statusPageTaskManager.status.name , exact: true })).not.toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: statusPageTaskManager.status.slug, exact: true })).not.toBeVisible();

})

test('удаление одного статуса через список', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.completeСreationStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)
    await statusPageTaskManager.menuStatuses.click()
    await statusPageTaskManager.selectRow(statusPageTaskManager.status.slug)

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

    await statusPageTaskManager.buttonDel.click()

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
    await expect(statusPageTaskManager.alert).toContainText('Element deleted');
    await expect(loggedPage.getByRole('cell', { name: statusPageTaskManager.status.name , exact: true })).not.toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: statusPageTaskManager.status.slug, exact: true })).not.toBeVisible();

})
})



test.describe('массовое удаление статусов', ()=>{
test('удаление нескольких статусов', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.menuStatuses.click()
    for(let i = 0; i < statusesArr.length - 1; i++){
      const status = statusesArr[i]
     await statusPageTaskManager.selectRow(status.slug)
    }

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

    await statusPageTaskManager.buttonDel.click()

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
    
    for(let i = 0; i < statusesArr.length - 1; i++){
        const status = statusesArr[i]
        
    await expect(loggedPage.getByRole('cell', { name: status.name , exact: true })).not.toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: status.slug, exact: true })).not.toBeVisible(); 
      }
})

test('удаление всех статусов', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    await statusPageTaskManager.menuStatuses.click()
    const checkboxUsers = loggedPage.getByRole('checkbox', { name: 'Select all' })
    await checkboxUsers.check()

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

    await statusPageTaskManager.buttonDel.click()

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
    await expect(loggedPage.getByText('No Task statuses yet.')).toBeVisible();
    await expect(statusPageTaskManager.buttonCreate).toBeVisible();
})


test('удаление всех лейблов с нескольких страниц', async ({ loggedPage }) => {
    const statusPageTaskManager = new StatusesPage(loggedPage)
    const noLabelsText = loggedPage.getByText('No Task statuses yet.')
    const checkboxSelectAll = loggedPage.getByRole('checkbox', { name: 'Select all' })
    await statusPageTaskManager.menuStatuses.click()
    for (let i = 0; i < 10; i++) {
      if (await noLabelsText.isVisible()) {
        break
      }
    await checkboxSelectAll.check()
    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible()

    await statusPageTaskManager.buttonDel.click()

    await expect.poll(async () => {
      const noLabels = await noLabelsText.isVisible().catch(() => false)
      const hasCheckbox = await checkboxSelectAll.isVisible().catch(() => false)
      return noLabels || hasCheckbox
    }, { timeout: 10000, intervals: [500, 1000] })
    if (!await noLabelsText.isVisible()) {
      await statusPageTaskManager.menuStatuses.click()
    }
  }

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible()
    await expect(noLabelsText).toBeVisible()
    await expect(statusPageTaskManager.buttonCreate).toBeVisible()
})
})