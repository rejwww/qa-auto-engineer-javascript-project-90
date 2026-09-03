import { test, expect } from '@playwright/test';
import AuthorizationPage from '../models/AuthorizationPage.js'
import LabelsPage from '../models/LabelsPage.js'


test.beforeEach(async ({ page}) => {
    const autoPageTaskManager = new AuthorizationPage(page)
    await autoPageTaskManager.goto();
    await autoPageTaskManager.login('Username','Password')
    await autoPageTaskManager.buttonSign.click()
    const head = page.getByRole('heading')
    await expect(head).toContainText('Welcome to the administration');
})

test.describe('создание новых лейблов', ()=>{
test('отображение формы создания лейбла', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.menuLabels.click()
    await labelPageTaskManager.buttonCreate.click()

    await expect(labelPageTaskManager.inputName).toBeVisible();
    await expect(labelPageTaskManager.buttonSave).toBeVisible();

})

test('cоздание лейбла', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.menuLabels.click()
    await labelPageTaskManager.buttonCreate.click()
    await labelPageTaskManager.createLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.buttonSave.click()

    await expect(labelPageTaskManager.alert).toContainText('Element created');
  
    await labelPageTaskManager.menuLabels.click()

    await expect(page.getByRole('cell', { name: labelPageTaskManager.label.name , exact: true })).toBeVisible();
   
})
})



test.describe('просмотр списка лейблов', ()=>{
test('отображение таблицы лейблов', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.menuLabels.click()

    await expect(labelPageTaskManager.tableLabels).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Select all' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Sort by name ascending' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Sort by created at ascending' })).toBeVisible();
})

test('отображение списка лейблов', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.menuLabels.click()
    for(let label of labelPageTaskManager.labelsArr){
        const tr = page.getByRole('row')
                   .filter({ hasText: label.name})
                   
        await expect(tr.getByRole('cell', {name: label.id , exact: true})).toBeVisible()
        await expect(tr.getByRole('cell', {name: label.name , exact: true})).toBeVisible()
  }
})
})


test.describe('pедактирование информации о лейблах', ()=>{
test('отображение страницы редактирования лейбла', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.completeСreationLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.menuLabels.click()
    const tr = page.getByRole('row')
                 .filter({ hasText: labelPageTaskManager.label.name })
    await tr.click()

    await expect(labelPageTaskManager.inputName).toBeVisible();
    await expect(labelPageTaskManager.buttonSave).toBeVisible();
    await expect(labelPageTaskManager.buttonDel).toBeVisible();
    await expect(labelPageTaskManager.buttonShow).toBeVisible();
    await expect(labelPageTaskManager.inputName).toHaveValue(labelPageTaskManager.label.name);  
})

test('редактирование лейбла', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.completeСreationLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.menuLabels.click()
    const tr = page.getByRole('row')
                 .filter({ hasText: labelPageTaskManager.label.name })
    await tr.click()
    await labelPageTaskManager.inputName.fill('Block')
    await labelPageTaskManager.buttonSave.click()

    await expect(labelPageTaskManager.alert).toContainText('Element updated');
    await expect(page.getByRole('cell', { name: 'Block' , exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: labelPageTaskManager.label.name , exact: true })).not.toBeVisible();

    const trUpdate = page.getByRole('row')
                 .filter({ hasText: 'Block'})
    await trUpdate.click()

    await expect(labelPageTaskManager.inputName).toHaveValue('Block');
    await labelPageTaskManager.buttonShow.click()
    await expect(page.getByText('NameBlock')).toBeVisible();
    await expect(page.locator('#main-content')).toContainText('Block');

})
})


test.describe('удаление лейблов', ()=>{
test('удаление одного лейбла через карточку', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.completeСreationLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.menuLabels.click()
    const tr = page.getByRole('row')
                 .filter({ hasText: labelPageTaskManager.label.name })
    await tr.click()
    await labelPageTaskManager.buttonDel.click()

    await expect(labelPageTaskManager.alert).toContainText('Element deleted');
    await expect(page.getByRole('cell', { name: labelPageTaskManager.label.name , exact: true })).not.toBeVisible();

})

test('удаление одного лейбла через список', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.completeСreationLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.menuLabels.click()
    const checkboxUser = page.getByRole('row')
                 .filter({ hasText: labelPageTaskManager.label.name})
                 .getByRole('checkbox')
    await checkboxUser.check()

    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

    await labelPageTaskManager.buttonDel.click()

    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
    await expect(labelPageTaskManager.alert).toContainText('Element deleted');
    await expect(page.getByRole('cell', { name: labelPageTaskManager.label.name , exact: true })).not.toBeVisible();
})
})


test.describe('массовое удаление лейблов', ()=>{
test('удаление нескольких лейблов', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.menuLabels.click()
    for(let i = 0; i < labelPageTaskManager.labelsArr.length - 1; i++){
        const label = labelPageTaskManager.labelsArr[i]
        const checkboxUser = page.getByRole('row')
                    .filter({ hasText: label.name })
                    .getByRole('checkbox')
        await checkboxUser.check()
    }

    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

    await labelPageTaskManager.buttonDel.click()

    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
  
    for(let i = 0; i < labelPageTaskManager.labelsArr.length - 1; i++){
        const label = labelPageTaskManager.labelsArr[i]
        
    await expect(page.getByRole('cell', { name: label.name , exact: true })).not.toBeVisible();
    }
})

test('удаление всех лейблов', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    await labelPageTaskManager.menuLabels.click()
    const checkboxUsers = page.getByRole('checkbox', { name: 'Select all' })
    await checkboxUsers.check()

    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

    await labelPageTaskManager.buttonDel.click()

    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
    await expect(page.getByText('No Labels yet.')).toBeVisible();
    await expect(labelPageTaskManager.buttonCreate).toBeVisible();
})

test('удаление всех лейблов с нескольких страниц', async ({ page }) => {
    const labelPageTaskManager = new LabelsPage(page)
    const noLabelsText = page.getByText('No Labels yet.')
    const checkboxSelectAll = page.getByRole('checkbox', { name: 'Select all' })
    await labelPageTaskManager.menuLabels.click()
    while (true) {
        if (await noLabelsText.isVisible()) {
        break
        }
    await checkboxSelectAll.check()

    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible()

    await labelPageTaskManager.buttonDel.click()
    await expect.poll(async () => {
      const noLabels = await noLabelsText.isVisible().catch(() => false)
      const hasCheckbox = await checkboxSelectAll.isVisible().catch(() => false)
      return noLabels || hasCheckbox
    }, { timeout: 10000, intervals: [500, 1000] })
    if (!await noLabelsText.isVisible()) {
      await labelPageTaskManager.menuLabels.click()
    }
  }

    await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible()
    await expect(noLabelsText).toBeVisible()
    await expect(labelPageTaskManager.buttonCreate).toBeVisible()
})
})
