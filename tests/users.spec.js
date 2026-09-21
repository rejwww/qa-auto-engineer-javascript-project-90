import { test, expect }  from '../models/loggedPage.js'
import UsersPage from '../models/UsersPage.js'
import {usersArr} from '../__fixtures__/usersData.js'


test.describe('создание новых пользователей', ()=>{
test('отображение формы создания пользователя', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.menuUsers.click()
  await userPageTaskManager.buttonCreate.click()

  await expect(userPageTaskManager.inputEmail).toBeVisible();
  await expect(userPageTaskManager.inputFirstName).toBeVisible();
  await expect(userPageTaskManager.inputLastName).toBeVisible();
  await expect(userPageTaskManager.buttonSave).toBeVisible();
});

test('cоздание пользователя', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.menuUsers.click()
  await userPageTaskManager.buttonCreate.click()
  await userPageTaskManager.createUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('Element created');
  
  await userPageTaskManager.menuUsers.click()

  await expect(loggedPage.getByRole('cell', { name: 'cin@ya.ru' , exact: true })).toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: 'Cin', exact: true })).toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: 'Zin' , exact: true })).toBeVisible(); 
})
})

test.describe('просмотр списка пользователей', ()=>{
test('отображение таблицы пользователей', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.menuUsers.click()

  await expect(userPageTaskManager.tableUsers).toBeVisible()
  await expect(loggedPage.getByRole('columnheader', { name: 'Select all' })).toBeVisible();
  await expect(loggedPage.getByRole('columnheader', { name: 'Sort by id descending' })).toBeVisible();
  await expect(loggedPage.getByRole('columnheader', { name: 'Sort by email ascending' })).toBeVisible();
  await expect(loggedPage.getByRole('columnheader', { name: 'Sort by first name ascending' })).toBeVisible();
  await expect(loggedPage.getByRole('columnheader', { name: 'Sort by last name ascending' })).toBeVisible();
  await expect(loggedPage.getByRole('columnheader', { name: 'Sort by created at ascending' })).toBeVisible();

})

test('отображение списка пользователей', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.menuUsers.click()
  for(let user of usersArr){
    const tr = loggedPage.getByRole('row')
                   .filter({ hasText: user.email })
                   
  await expect(tr.getByRole('cell', {name: user.id , exact: true})).toBeVisible()
  await expect(tr.getByRole('cell', {name: user.firstName , exact: true})).toBeVisible()
  await expect(tr.getByRole('cell', {name: user.lastName , exact: true})).toBeVisible()
  }
})
})


test.describe('pедактирование информации о пользователях', ()=>{
test('отображение страницы редактирования пользователя', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.completeСreationUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)
  await userPageTaskManager.openRow(userPageTaskManager.user.email)

  await expect(userPageTaskManager.inputEmail).toBeVisible();
  await expect(userPageTaskManager.inputFirstName).toBeVisible();
  await expect(userPageTaskManager.inputLastName).toBeVisible();
  await expect(userPageTaskManager.buttonSave).toBeVisible();
  await expect(userPageTaskManager.buttonDel).toBeVisible();
  await expect(userPageTaskManager.buttonShow).toBeVisible();
  await expect(userPageTaskManager.inputEmail).toHaveValue(userPageTaskManager.user.email);
  await expect(userPageTaskManager.inputFirstName).toHaveValue(userPageTaskManager.user.firstName);
  await expect(userPageTaskManager.inputLastName).toHaveValue(userPageTaskManager.user.lastName);
}) 

test('редактирование пользователя', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.completeСreationUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)
  await userPageTaskManager.openRow(userPageTaskManager.user.email)
  await userPageTaskManager.inputEmail.fill('test@example.com')
  await userPageTaskManager.inputFirstName.fill('Tom')
  await userPageTaskManager.inputLastName.fill('Bond')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('Element updated');
  await expect(loggedPage.getByRole('cell', { name: 'test@example.com' , exact: true })).toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: 'Tom', exact: true })).toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: 'Bond' , exact: true })).toBeVisible(); 
  await expect(loggedPage.getByRole('cell', { name: userPageTaskManager.user.email , exact: true })).not.toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: userPageTaskManager.user.firstName, exact: true })).not.toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: userPageTaskManager.user.lastName , exact: true })).not.toBeVisible(); 

  const trUpdate = loggedPage.getByRole('row')
                 .filter({ hasText: 'test@example.com'})
  await trUpdate.click()

  await expect(userPageTaskManager.inputEmail).toHaveValue('test@example.com');
  await expect(userPageTaskManager.inputFirstName).toHaveValue('Tom');
  await expect(userPageTaskManager.inputLastName).toHaveValue('Bond');

  await userPageTaskManager.buttonShow.click()
  
  await expect(loggedPage.getByText('Emailtest@example.com')).toBeVisible();
  await expect(loggedPage.locator('#main-content')).toContainText('test@example.com');
  await expect(loggedPage.getByText('First nameTom')).toBeVisible();
  await expect(loggedPage.locator('#main-content')).toContainText('Tom');
  await expect(loggedPage.getByText('Last nameBond')).toBeVisible();
  await expect(loggedPage.locator('#main-content')).toContainText('Bond');
})

test('валидация полей', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.menuUsers.click()
  await userPageTaskManager.buttonCreate.click()
  await userPageTaskManager.inputEmail.fill(' ')
  await userPageTaskManager.inputFirstName.fill(' ')
  await userPageTaskManager.inputLastName.fill(' ')
  await userPageTaskManager.buttonSave.click()

  await expect(loggedPage.getByText('Email *Incorrect email format')).toBeVisible();
  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');

  await userPageTaskManager.inputFirstName.fill('1')
  await userPageTaskManager.inputLastName.fill('.')
  await userPageTaskManager.inputEmail.fill('a')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(loggedPage.getByText('Email *Incorrect email format')).toBeVisible();

  await userPageTaskManager.inputEmail.fill('t@')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(loggedPage.getByText('Email *Incorrect email format')).toBeVisible();
  
  await userPageTaskManager.inputEmail.fill('t@t.')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(loggedPage.getByText('Email *Incorrect email format')).toBeVisible();

  await userPageTaskManager.inputEmail.fill('t@t.t')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('Element created');

  await userPageTaskManager.menuUsers.click()
  const tr = loggedPage.getByRole('row')
                 .filter({ hasText: 't@t.t'})
  await tr.click()
  await userPageTaskManager.inputFirstName.fill('')
  await userPageTaskManager.inputLastName.fill('')
  await userPageTaskManager.buttonSave.click()

  await expect(loggedPage.getByText('First name *Required')).toBeVisible();
  await expect(loggedPage.getByText('Last name *Required')).toBeVisible();
  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');

  await userPageTaskManager.inputFirstName.fill('.')
  await userPageTaskManager.inputLastName.fill('1')
  await userPageTaskManager.inputEmail.fill('a')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(loggedPage.getByText('Email *Incorrect email format')).toBeVisible();

  await userPageTaskManager.inputEmail.fill('t@')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(loggedPage.getByText('Email *Incorrect email format')).toBeVisible();
  
  await userPageTaskManager.inputEmail.fill('t@t.')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(loggedPage.getByText('Email *Incorrect email format')).toBeVisible();

  await userPageTaskManager.inputEmail.fill('t@t.t')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('Element updated');
})
})


test.describe('удаление пользователей', ()=>{
test('удаление одного пользователя через карточку', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.completeСreationUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)
  await userPageTaskManager.openRow(userPageTaskManager.user.email)
  await userPageTaskManager.buttonDel.click()

  await expect(userPageTaskManager.alert).toContainText('Element deleted');
  await expect(loggedPage.getByRole('cell', { name: userPageTaskManager.user.email , exact: true })).not.toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: userPageTaskManager.user.firstName, exact: true })).not.toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: userPageTaskManager.user.lastName , exact: true })).not.toBeVisible(); 
})

test('удаление одного пользователя через список', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.completeСreationUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)
  await userPageTaskManager.menuUsers.click()
  await userPageTaskManager.selectRow(userPageTaskManager.user.email)

  await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

  await userPageTaskManager.buttonDel.click()

  await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
  await expect(userPageTaskManager.alert).toContainText('Element deleted');
  await expect(loggedPage.getByRole('cell', { name: userPageTaskManager.user.email , exact: true })).not.toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: userPageTaskManager.user.firstName, exact: true })).not.toBeVisible();
  await expect(loggedPage.getByRole('cell', { name: userPageTaskManager.user.lastName , exact: true })).not.toBeVisible(); 
})
})

test.describe('массовое удаление пользователей', ()=>{
test('удаление нескольких пользователей', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.menuUsers.click()
   for(let i = 0; i < usersArr.length - 1; i++){
    const user = usersArr[i]
    await userPageTaskManager.selectRow(user.email)
   }

  await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

  await userPageTaskManager.buttonDel.click()

  await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
  
  for(let i = 0; i < usersArr.length - 1; i++){
      const user = usersArr[i]
      
    await expect(loggedPage.getByRole('cell', { name: user.email , exact: true })).not.toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: user.firstName, exact: true })).not.toBeVisible();
    await expect(loggedPage.getByRole('cell', { name: user.lastName , exact: true })).not.toBeVisible(); 
  
    }
})

test('удаление всех пользователей', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  await userPageTaskManager.menuUsers.click()
  const checkboxUsers = loggedPage.getByRole('checkbox', { name: 'Select all' })
  await checkboxUsers.check()

  await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

  await userPageTaskManager.buttonDel.click()

  await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
  await expect(loggedPage.getByText('No Users yet.')).toBeVisible();
  await expect(userPageTaskManager.buttonCreate).toBeVisible();
})

test('удаление всех пользователей с нескольких страниц', async ({ loggedPage }) => {
  const userPageTaskManager = new UsersPage(loggedPage)
  const noLabelsText = loggedPage.getByText('No Users yet.')
  const checkboxSelectAll = loggedPage.getByRole('checkbox', { name: 'Select all' })
  await userPageTaskManager.menuUsers.click()
  for (let i = 0; i < 10; i++){
      if (await noLabelsText.isVisible()) {
        break
      }
  await checkboxSelectAll.check()
  await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible()
  await userPageTaskManager.buttonDel.click()
  await expect.poll(async () => {
      const noLabels = await noLabelsText.isVisible().catch(() => false)
      const hasCheckbox = await checkboxSelectAll.isVisible().catch(() => false)
      return noLabels || hasCheckbox
    }, { timeout: 10000, intervals: [500, 1000] })
  if (!await noLabelsText.isVisible()) {
      await userPageTaskManager.menuUsers.click()
    }
  }

  await expect(loggedPage.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible()
  await expect(noLabelsText).toBeVisible()
  await expect(userPageTaskManager.buttonCreate).toBeVisible()
})
})