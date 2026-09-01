import { test, expect } from '@playwright/test';
import AuthorizationPage from '../models/AuthorizationPage.js'
import StatusesPage from '../models/StatusesPage.js'


test.beforeEach(async ({ page}) => {
    const autoPageTaskManager = new AuthorizationPage(page)
      await autoPageTaskManager.goto();
      await autoPageTaskManager.login('Username','Password')
    
      await autoPageTaskManager.buttonSign.click()
    
      const head = page.getByRole('heading')
    
      await expect(head).toContainText('Welcome to the administration');
})


test.describe('создание новых статусов', ()=>{

test('отображение формы создания статуса', async ({ page }) => {
    const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()
    await statusPageTaskManager.buttonCreate.click()

    await expect(statusPageTaskManager.inputName).toBeVisible();
    await expect(statusPageTaskManager.inputSlug).toBeVisible();
    await expect(statusPageTaskManager.buttonSave).toBeVisible();

})

test('cоздание статуса', async ({ page }) => {
  const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()
    await statusPageTaskManager.buttonCreate.click()

    await statusPageTaskManager.createStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)

    await statusPageTaskManager.buttonSave.click()

    await expect(statusPageTaskManager.alert).toContainText('Element created');
  
    await statusPageTaskManager.menuStatuses.click()

    await expect(page.getByRole('cell', { name: statusPageTaskManager.status.name , exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: statusPageTaskManager.status.slug, exact: true })).toBeVisible();

})

})


test.describe('просмотр списка статусов', ()=>{

test('отображение таблицы статусов', async ({ page }) => {
    const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()

    await expect(statusPageTaskManager.tableStatuses).toBeVisible()

    await expect(page.getByRole('columnheader', { name: 'Select all' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Sort by id descending' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Sort by name ascending' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Sort by slug ascending' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Sort by created at ascending' })).toBeVisible();

})

test('отображение списка статусов', async ({ page }) => {
    const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()


    for(let status of statusPageTaskManager.statusesArr){
        const tr = page.getByRole('row')
                   .filter({ hasText: status.slug })
                   
        await expect(tr.getByRole('cell', {name: status.id , exact: true})).toBeVisible()
        await expect(tr.getByRole('cell', {name: status.name , exact: true})).toBeVisible()
  }

})
})


test.describe('pедактирование информации о статусах', ()=>{

test('отображение страницы редактирования статуса', async ({ page }) => {
    const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()
    await statusPageTaskManager.buttonCreate.click()

    await statusPageTaskManager.createStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)

    await statusPageTaskManager.buttonSave.click()

    await statusPageTaskManager.menuStatuses.click()

  const tr = page.getByRole('row')
                 .filter({ hasText: statusPageTaskManager.status.slug })

  await tr.click()

  await expect(statusPageTaskManager.inputName).toBeVisible();
  await expect(statusPageTaskManager.inputSlug).toBeVisible();
  await expect(statusPageTaskManager.buttonSave).toBeVisible();
  await expect(statusPageTaskManager.buttonDel).toBeVisible();
  await expect(statusPageTaskManager.buttonShow).toBeVisible();

  await expect(statusPageTaskManager.inputName).toHaveValue(statusPageTaskManager.status.name);
  await expect(statusPageTaskManager.inputSlug).toHaveValue(statusPageTaskManager.status.slug);
 
})

test('редактирование статуса', async ({ page }) => {
    const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()
    await statusPageTaskManager.buttonCreate.click()

    await statusPageTaskManager.createStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)

    await statusPageTaskManager.buttonSave.click()

    await statusPageTaskManager.menuStatuses.click()

    const tr = page.getByRole('row')
                 .filter({ hasText: statusPageTaskManager.status.slug })

    await tr.click()

    await statusPageTaskManager.inputName.fill('Done')
    await statusPageTaskManager.inputSlug.fill('done')

    await statusPageTaskManager.buttonSave.click()

    await expect(statusPageTaskManager.alert).toContainText('Element updated');

    await expect(page.getByRole('cell', { name: 'Done' , exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'done', exact: true })).toBeVisible();

    await expect(page.getByRole('cell', { name: statusPageTaskManager.status.name , exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: statusPageTaskManager.status.slug, exact: true })).not.toBeVisible();

    const trUpdate = page.getByRole('row')
                 .filter({ hasText: 'done'})

    await trUpdate.click()

    await expect(statusPageTaskManager.inputName).toHaveValue('Done');
    await expect(statusPageTaskManager.inputSlug).toHaveValue('done');

    await statusPageTaskManager.buttonShow.click()

    await expect(page.getByText('NameDone')).toBeVisible();
    await expect(page.locator('#main-content')).toContainText('Done');

})
})


test.describe('удаление статусов', ()=>{

test('удаление одного статуса через карточку', async ({ page }) => {
    const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()
    await statusPageTaskManager.buttonCreate.click()
    await statusPageTaskManager.createStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)
    await statusPageTaskManager.buttonSave.click()

    await statusPageTaskManager.menuStatuses.click()

    const tr = page.getByRole('row')
                 .filter({ hasText: statusPageTaskManager.status.slug })

    await tr.click()

    await statusPageTaskManager.buttonDel.click()

    await expect(statusPageTaskManager.alert).toContainText('Element deleted');

    await expect(page.getByRole('cell', { name: statusPageTaskManager.status.name , exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: statusPageTaskManager.status.slug, exact: true })).not.toBeVisible();

})

test('удаление одного статуса через список', async ({ page }) => {
  const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()
    await statusPageTaskManager.buttonCreate.click()
    await statusPageTaskManager.createStatus(statusPageTaskManager.status.name, statusPageTaskManager.status.slug)
    await statusPageTaskManager.buttonSave.click()

    await statusPageTaskManager.menuStatuses.click()

  const checkboxUser = page.getByRole('row')
                 .filter({ hasText: statusPageTaskManager.status.slug})
                 .getByRole('checkbox')

  await checkboxUser.check()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

  await statusPageTaskManager.buttonDel.click()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();

  await expect(statusPageTaskManager.alert).toContainText('Element deleted');

   await expect(page.getByRole('cell', { name: statusPageTaskManager.status.name , exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: statusPageTaskManager.status.slug, exact: true })).not.toBeVisible();

})
})



test.describe('массовое удаление статусов', ()=>{

test('удаление нескольких статусов', async ({ page }) => {
    const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()


   for(let i = 0; i < statusPageTaskManager.statusesArr.length - 1; i++){
    const status = statusPageTaskManager.statusesArr[i]
    const checkboxUser = page.getByRole('row')
                   .filter({ hasText: status.slug })
                   .getByRole('checkbox')
    await checkboxUser.check()
   }

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

  await statusPageTaskManager.buttonDel.click()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
  
for(let i = 0; i < statusPageTaskManager.statusesArr.length - 1; i++){
    const status = statusPageTaskManager.statusesArr[i]
    
  await expect(page.getByRole('cell', { name: status.name , exact: true })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: status.slug, exact: true })).not.toBeVisible();
  
   }
  
})

test('удаление всех статусов', async ({ page }) => {
    const statusPageTaskManager = new StatusesPage(page)

    await statusPageTaskManager.menuStatuses.click()

  const checkboxUsers = page.getByRole('checkbox', { name: 'Select all' })

  await checkboxUsers.check()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

  await statusPageTaskManager.buttonDel.click()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
  await expect(page.getByText('No Task statuses yet.')).toBeVisible();
  await expect(statusPageTaskManager.buttonCreate).toBeVisible();
  
})


test('удаление всех лейблов с нескольких страниц', async ({ page }) => {
  const statusPageTaskManager = new StatusesPage(page)

  const noLabelsText = page.getByText('No Task statuses yet.')
  const checkboxSelectAll = page.getByRole('checkbox', { name: 'Select all' })

  await statusPageTaskManager.menuStatuses.click()

  while (true) {
    if (await noLabelsText.isVisible()) {
      break
    }

    await checkboxSelectAll.check()
    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible()
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

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible()
  await expect(noLabelsText).toBeVisible()
  await expect(statusPageTaskManager.buttonCreate).toBeVisible()
})
})