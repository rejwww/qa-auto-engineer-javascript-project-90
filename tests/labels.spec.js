import { test, expect }  from '../models/loggedPage.js'
import LabelsPage from '../models/LabelsPage.js'
import {labelsArr} from '../__fixtures__/labelsData.js'


test.describe('создание новых лейблов', ()=>{
test('отображение формы создания лейбла', async ({ loggedPage}) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.menuLabels.click()
    await labelPageTaskManager.buttonCreate.click()

    await expect(labelPageTaskManager.inputName).toBeVisible();
    await expect(labelPageTaskManager.buttonSave).toBeVisible();

})

test('cоздание лейбла', async ({ loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.menuLabels.click()
    await labelPageTaskManager.buttonCreate.click()
    await labelPageTaskManager.createLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.buttonSave.click()

    await expect(labelPageTaskManager.alert).toContainText('Element created');
  
    await labelPageTaskManager.menuLabels.click()

    await expect(loggedPage.getByRole('cell', { name: labelPageTaskManager.label.name , exact: true })).toBeVisible();
   
})
})



test.describe('просмотр списка лейблов', ()=>{
test('отображение таблицы лейблов', async ({ loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.menuLabels.click()

    await expect(labelPageTaskManager.tableLabels).toBeVisible()
    await expect(loggedPage.getByRole('columnheader', { name: 'Select all' })).toBeVisible();
    await expect(loggedPage.getByRole('columnheader', { name: 'Sort by name ascending' })).toBeVisible();
    await expect(loggedPage.getByRole('columnheader', { name: 'Sort by created at ascending' })).toBeVisible();
})

test('отображение списка лейблов', async ({loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.menuLabels.click()
    for(let label of labelsArr){
        const tr = loggedPage.getByRole('row')
                   .filter({ hasText: label.name})
                   
        await expect(tr.getByRole('cell', {name: label.id , exact: true})).toBeVisible()
        await expect(tr.getByRole('cell', {name: label.name , exact: true})).toBeVisible()
  }
})
})


test.describe('pедактирование информации о лейблах', ()=>{
test('отображение страницы редактирования лейбла', async ({ loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.completeСreationLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.openRow(labelPageTaskManager.label.name )

    await expect(labelPageTaskManager.inputName).toBeVisible();
    await expect(labelPageTaskManager.buttonSave).toBeVisible();
    await expect(labelPageTaskManager.buttonDel).toBeVisible();
    await expect(labelPageTaskManager.buttonShow).toBeVisible();
    await expect(labelPageTaskManager.inputName).toHaveValue(labelPageTaskManager.label.name);  
})

test('редактирование лейбла', async ({ loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.completeСreationLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.openRow(labelPageTaskManager.label.name )
    await labelPageTaskManager.inputName.fill('Block')
    await labelPageTaskManager.buttonSave.click()

    await expect(labelPageTaskManager.alert).toContainText('Element updated');
    await expect(loggedPage.getByRole('cell', { name: 'Block' , exact: true })).toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: labelPageTaskManager.label.name , exact: true })).not.toBeVisible();

    const trUpdate = loggedPage.getByRole('row')
                 .filter({ hasText: 'Block'})
    await trUpdate.click()

    await expect(labelPageTaskManager.inputName).toHaveValue('Block');
    await labelPageTaskManager.buttonShow.click()
    await expect(loggedPage.getByText('NameBlock')).toBeVisible();
    await expect(loggedPage.locator('#main-content')).toContainText('Block');

})
})


test.describe('удаление лейблов', ()=>{
test('удаление одного лейбла через карточку', async ({ loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.completeСreationLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.openRow(labelPageTaskManager.label.name )
    await labelPageTaskManager.buttonDel.click()

    await expect(labelPageTaskManager.alert).toContainText('Element deleted');
    await expect(loggedPage.getByRole('cell', { name: labelPageTaskManager.label.name , exact: true })).not.toBeVisible();

})

test('удаление одного лейбла через список', async ({ loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.completeСreationLabel(labelPageTaskManager.label.name)
    await labelPageTaskManager.menuLabels.click()
    await labelPageTaskManager.selectRow(labelPageTaskManager.label.name)

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

    await labelPageTaskManager.buttonDel.click()

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
    await expect(labelPageTaskManager.alert).toContainText('Element deleted');
    await expect(loggedPage.getByRole('cell', { name: labelPageTaskManager.label.name , exact: true })).not.toBeVisible();
})
})


test.describe('массовое удаление лейблов', ()=>{
test('удаление нескольких лейблов', async ({ loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.menuLabels.click()
    for(let i = 0; i < labelsArr.length - 1; i++){
        const label = labelsArr[i]
        await labelPageTaskManager.selectRow(label.name )
    }

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

    await labelPageTaskManager.buttonDel.click()

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
  
    for(let i = 0; i < labelsArr.length - 1; i++){
        const label = labelsArr[i]
        
    await expect(loggedPage.getByRole('cell', { name: label.name , exact: true })).not.toBeVisible();
    }
})

test('удаление всех лейблов', async ({ loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    await labelPageTaskManager.menuLabels.click()
    const checkboxUsers = loggedPage.getByRole('checkbox', { name: 'Select all' })
    await checkboxUsers.check()

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

    await labelPageTaskManager.buttonDel.click()

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
    await expect(loggedPage.getByText('No Labels yet.')).toBeVisible();
    await expect(labelPageTaskManager.buttonCreate).toBeVisible();
})

test('удаление всех лейблов с нескольких страниц', async ({ loggedPage }) => {
    const labelPageTaskManager = new LabelsPage(loggedPage)
    const noLabelsText = loggedPage.getByText('No Labels yet.')
    const checkboxSelectAll = loggedPage.getByRole('checkbox', { name: 'Select all' })
    await labelPageTaskManager.menuLabels.click()
    for (let i = 0; i < 10; i++) {
        if (await noLabelsText.isVisible()) {
        break
        }
    await checkboxSelectAll.check()

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible()

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

    await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible()
    await expect(noLabelsText).toBeVisible()
    await expect(labelPageTaskManager.buttonCreate).toBeVisible()
})
})
