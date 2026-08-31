// @ts-check
import { test, expect } from '@playwright/test';
import AuthorizationPage from '../models/AuthorizationPage.js'
import UsersPage from '../models/UsersPage.js'

test.beforeEach(async ({ page}) => {
    const autoPageTaskManager = new AuthorizationPage(page)
      await autoPageTaskManager.goto();
      await autoPageTaskManager.login('Username','Password')
    
      await autoPageTaskManager.buttonSign.click()
    
      const head = page.getByRole('heading')
    
      await expect(head).toContainText('Welcome to the administration');
})

test.describe('создание новых пользователей', ()=>{

test('отображение формы создания пользователя', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()
  await userPageTaskManager.buttonCreate.click()

  await expect(userPageTaskManager.inputEmail).toBeVisible();
  await expect(userPageTaskManager.inputFirstName).toBeVisible();
  await expect(userPageTaskManager.inputLastName).toBeVisible();
  await expect(userPageTaskManager.buttonSave).toBeVisible();
});

test('cоздание пользователя', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()
  await userPageTaskManager.buttonCreate.click()

  await userPageTaskManager.createUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)

  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('Element created');
  
  await userPageTaskManager.menuUsers.click()

  await expect(page.getByRole('cell', { name: 'cin@ya.ru' , exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Cin', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Zin' , exact: true })).toBeVisible(); 

})
})

test.describe('просмотр списка пользователей', ()=>{

test('отображение таблицы пользователей', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()

  await expect(userPageTaskManager.tableUsers).toBeVisible()

  await expect(page.getByRole('columnheader', { name: 'Select all' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Sort by id descending' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Sort by email ascending' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Sort by first name ascending' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Sort by last name ascending' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Sort by created at ascending' })).toBeVisible();

})

test('отображение списка пользователей', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()

  for(let user of userPageTaskManager.usersArr){
    const tr = page.getByRole('row')
                   .filter({ hasText: user.email })
                   
    await expect(tr.getByRole('cell', {name: user.id , exact: true})).toBeVisible()
    await expect(tr.getByRole('cell', {name: user.firstName , exact: true})).toBeVisible()
    await expect(tr.getByRole('cell', {name: user.lastName , exact: true})).toBeVisible()
  }

})

})


test.describe('pедактирование информации о пользователях', ()=>{

test('отображение страницы редактирования пользователя', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()

  await userPageTaskManager.buttonCreate.click()

  await userPageTaskManager.createUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)
  await userPageTaskManager.buttonSave.click()
  await userPageTaskManager.menuUsers.click()

  const tr = page.getByRole('row')
                 .filter({ hasText: userPageTaskManager.user.email })

  await tr.click()

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

test('редактирование пользователя', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()

  await userPageTaskManager.buttonCreate.click()

  await userPageTaskManager.createUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)
  await userPageTaskManager.buttonSave.click()
  await userPageTaskManager.menuUsers.click()

  const tr = page.getByRole('row')
                 .filter({ hasText: userPageTaskManager.user.email })

  await tr.click()

  await userPageTaskManager.inputEmail.fill('test@example.com')
  await userPageTaskManager.inputFirstName.fill('Tom')
  await userPageTaskManager.inputLastName.fill('Bond')

  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('Element updated');

  await expect(page.getByRole('cell', { name: 'test@example.com' , exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Tom', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Bond' , exact: true })).toBeVisible(); 

  await expect(page.getByRole('cell', { name: userPageTaskManager.user.email , exact: true })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: userPageTaskManager.user.firstName, exact: true })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: userPageTaskManager.user.lastName , exact: true })).not.toBeVisible(); 


  const trUpdate = page.getByRole('row')
                 .filter({ hasText: 'test@example.com'})

  await trUpdate.click()

  await expect(userPageTaskManager.inputEmail).toHaveValue('test@example.com');
  await expect(userPageTaskManager.inputFirstName).toHaveValue('Tom');
  await expect(userPageTaskManager.inputLastName).toHaveValue('Bond');

  await userPageTaskManager.buttonShow.click()
  
  await expect(page.getByText('Emailtest@example.com')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('test@example.com');
  await expect(page.getByText('First nameTom')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('Tom');
  await expect(page.getByText('Last nameBond')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('Bond');

})

test('валидация полей', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()

  await userPageTaskManager.buttonCreate.click()

  await userPageTaskManager.inputEmail.fill(' ')
  await userPageTaskManager.inputFirstName.fill(' ')
  await userPageTaskManager.inputLastName.fill(' ')

  await userPageTaskManager.buttonSave.click()

  await expect(page.getByText('Email *Incorrect email format')).toBeVisible();

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');

  await userPageTaskManager.inputFirstName.fill('1')
  await userPageTaskManager.inputLastName.fill('.')

  await userPageTaskManager.inputEmail.fill('a')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(page.getByText('Email *Incorrect email format')).toBeVisible();

  await userPageTaskManager.inputEmail.fill('t@')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(page.getByText('Email *Incorrect email format')).toBeVisible();
  
  await userPageTaskManager.inputEmail.fill('t@t.')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(page.getByText('Email *Incorrect email format')).toBeVisible();

  await userPageTaskManager.inputEmail.fill('t@t.t')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('Element created');
  await userPageTaskManager.menuUsers.click()

  const tr = page.getByRole('row')
                 .filter({ hasText: 't@t.t'})

  await tr.click()

  await userPageTaskManager.inputFirstName.fill('')
  await userPageTaskManager.inputLastName.fill('')

  await userPageTaskManager.buttonSave.click()

  await expect(page.getByText('First name *Required')).toBeVisible();
  await expect(page.getByText('Last name *Required')).toBeVisible();
  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');

  await userPageTaskManager.inputFirstName.fill('.')
  await userPageTaskManager.inputLastName.fill('1')


  await userPageTaskManager.inputEmail.fill('a')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(page.getByText('Email *Incorrect email format')).toBeVisible();

  await userPageTaskManager.inputEmail.fill('t@')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(page.getByText('Email *Incorrect email format')).toBeVisible();
  
  await userPageTaskManager.inputEmail.fill('t@t.')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('The form is not valid. Please');
  await expect(page.getByText('Email *Incorrect email format')).toBeVisible();

  await userPageTaskManager.inputEmail.fill('t@t.t')
  await userPageTaskManager.buttonSave.click()

  await expect(userPageTaskManager.alert).toContainText('Element updated');

})

})


test.describe('удаление пользователей', ()=>{

test('удаление одного пользователя через карточку', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()
  await userPageTaskManager.buttonCreate.click()
  await userPageTaskManager.createUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)
  await userPageTaskManager.buttonSave.click()
  await userPageTaskManager.menuUsers.click()

  const tr = page.getByRole('row')
                 .filter({ hasText: userPageTaskManager.user.email})

  await tr.click()

  await userPageTaskManager.buttonDel.click()

  await expect(userPageTaskManager.alert).toContainText('Element deleted');

  await expect(page.getByRole('cell', { name: userPageTaskManager.user.email , exact: true })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: userPageTaskManager.user.firstName, exact: true })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: userPageTaskManager.user.lastName , exact: true })).not.toBeVisible(); 
  
})

test('удаление одного пользователя через список', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()
  await userPageTaskManager.buttonCreate.click()
  await userPageTaskManager.createUser(userPageTaskManager.user.email, userPageTaskManager.user.firstName,userPageTaskManager.user.lastName)
  await userPageTaskManager.buttonSave.click()
  await userPageTaskManager.menuUsers.click()

  const checkboxUser = page.getByRole('row')
                 .filter({ hasText: userPageTaskManager.user.email})
                 .getByRole('checkbox')

  await checkboxUser.click()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

  await userPageTaskManager.buttonDel.click()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();

  await expect(userPageTaskManager.alert).toContainText('Element deleted');

  await expect(page.getByRole('cell', { name: userPageTaskManager.user.email , exact: true })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: userPageTaskManager.user.firstName, exact: true })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: userPageTaskManager.user.lastName , exact: true })).not.toBeVisible(); 
 
})

})

test.describe('массовое удаление пользователей', ()=>{

test('удаление нескольких пользователей', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()


   for(let i = 0; i < userPageTaskManager.usersArr.length - 1; i++){
    const user = userPageTaskManager.usersArr[i]
    const checkboxUser = page.getByRole('row')
                   .filter({ hasText: user.email })
                   .getByRole('checkbox')
    await checkboxUser.check()
   }

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

  await userPageTaskManager.buttonDel.click()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
  
for(let i = 0; i < userPageTaskManager.usersArr.length - 1; i++){
    const user = userPageTaskManager.usersArr[i]
    
  await expect(page.getByRole('cell', { name: user.email , exact: true })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: user.firstName, exact: true })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: user.lastName , exact: true })).not.toBeVisible(); 
 
   }
  
})

test('удаление всех пользователей', async ({ page }) => {
  const userPageTaskManager = new UsersPage(page)

  await userPageTaskManager.menuUsers.click()

  const checkboxUsers = page.getByRole('checkbox', { name: 'Select all' })

  await checkboxUsers.check()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).toBeVisible();

  await userPageTaskManager.buttonDel.click()

  await expect(page.locator('[data-test="bulk-actions-toolbar"]')).not.toBeVisible();
  await expect(page.getByText('No Users yet.')).toBeVisible();
  await expect(userPageTaskManager.buttonCreate).toBeVisible();
  
})
})