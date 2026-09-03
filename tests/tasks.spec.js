import { test, expect } from '@playwright/test';
import AuthorizationPage from '../models/AuthorizationPage.js'
import TasksPage from '../models/TasksPage.js'


test.beforeEach(async ({ page}) => {
    const autoPageTaskManager = new AuthorizationPage(page)
      await autoPageTaskManager.goto();
      await autoPageTaskManager.login('Username','Password')
    
      await autoPageTaskManager.buttonSign.click()
    
      const head = page.getByRole('heading')
    
      await expect(head).toContainText('Welcome to the administration');
})


test.describe('создание новых задач', ()=>{

test('отображение формы создания задачи', async ({ page }) => {
    const tasksPageTaskManager = new TasksPage(page)

    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.buttonCreate.click()

    await expect(tasksPageTaskManager.selectAssignee).toBeVisible();
    await expect(tasksPageTaskManager.inputTitle).toBeVisible();
    await expect(tasksPageTaskManager.inputContent).toBeVisible();
    await expect(tasksPageTaskManager.selectStatus).toBeVisible();
    await expect(tasksPageTaskManager.selectLabel).toBeVisible();
    await expect(tasksPageTaskManager.buttonSave).toBeVisible();

})

test('cоздание задачи', async ({ page }) => {
    const tasksPageTaskManager = new TasksPage(page)

    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.buttonCreate.click()

    await tasksPageTaskManager.createTasks(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)

    await tasksPageTaskManager.buttonSave.click()

    await expect(tasksPageTaskManager.alert).toContainText('Element created');
  
    await tasksPageTaskManager.menuTasks.click()

    const taskCard = page.getByRole('button', { name: 'Task Test Test' })

    await expect(taskCard).toBeVisible();

    await taskCard.getByLabel('Show').click();

    await expect(page.getByText(tasksPageTaskManager.task.assignee)).toBeVisible();
    await expect(page.locator('form')).toContainText(tasksPageTaskManager.task.assignee);
    await expect(page.locator('form')).toContainText(tasksPageTaskManager.task.title);
    await expect(page.locator('form')).toContainText(tasksPageTaskManager.task.content);
    await expect(page.getByRole('link', { name: tasksPageTaskManager.task.label })).toBeVisible();

})
})


test.describe('просмотр доски и фильтров', ()=>{

test('отображение доски задач', async ({ page }) => {
   const tasksPageTaskManager = new TasksPage(page)

    await tasksPageTaskManager.menuTasks.click()

    await expect(tasksPageTaskManager.selectAssignee).toBeVisible();
    await expect(tasksPageTaskManager.selectStatus).toBeVisible();
    await expect(tasksPageTaskManager.selectLabel).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Draft' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'To Review' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'To Be Fixed' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'To Publish' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Published' })).toBeVisible();

})

test('фильтрация', async ({ page }) => {
    const tasksPageTaskManager = new TasksPage(page)

    await tasksPageTaskManager.menuTasks.click()

    await tasksPageTaskManager.selectAssignee.click();
    await page.getByRole('option', { name: 'jack@yahoo.com' }).click();

    for(let assignee of tasksPageTaskManager.tasksArr){
        const button = page.getByRole('button', {name: `${assignee.title} Description of task`});
        if(assignee.assignee == 'jack@yahoo.com'){
            await expect(button).toBeVisible();
        } else{
            await expect(button).not.toBeVisible();
        }
    }

    await page.getByRole('combobox', { name: 'Assignee jack@yahoo.com' }).click();
    await page.getByRole('option', { name: 'Clear value' }).click();

    await tasksPageTaskManager.selectStatus.click();
    await page.getByRole('option', { name: 'Draft'  }).click();

    for(let status of tasksPageTaskManager.tasksArr){
        const button = page.getByRole('button', {name: `${status.title} Description of task`});
        if(status.status == 'Draft'){
            await expect(button).toBeVisible();
        } else{
            await expect(button).not.toBeVisible();
        }
    }

    await page.getByRole('combobox', { name: 'Status Draft' }).click();
    await page.getByRole('option', { name: 'Clear value' }).click();

    await tasksPageTaskManager.selectLabel.click();
    await page.getByRole('option', { name: 'bug'  }).click();

    for(let label of tasksPageTaskManager.tasksArr){
        const button = page.getByRole('button', {name: `${label.title} Description of task` });
        if(label.label?.includes('bug') && label.label.length === 1){
            await expect(button).toBeVisible();
        } else {
            await expect(button).not.toBeVisible();
        }
    }

    await tasksPageTaskManager.selectStatus.click();
    await page.getByRole('option', { name: 'To Publish'  }).click();

    await tasksPageTaskManager.selectAssignee.click();
    await page.getByRole('option', { name: 'jack@yahoo.com' }).click();

    for(let task of tasksPageTaskManager.tasksArr){
        const button = page.getByRole('button', {name: `${task.title} Description of task` });
        if(task.label?.includes('bug') && (task.assignee == 'jack@yahoo.com') && (task.status == 'To Publish')){
            await expect(button).toBeVisible();
        } else{
            await expect(button).not.toBeVisible();
        }
    }

})
})


test.describe('pедактирование информации задач', ()=>{

test('отображение страницы редактирования задачи', async ({ page }) => {
     const tasksPageTaskManager = new TasksPage(page)

    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.buttonCreate.click()

    await tasksPageTaskManager.createTasks(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)

    await tasksPageTaskManager.buttonSave.click()

    await expect(tasksPageTaskManager.alert).toContainText('Element created');
  
    await tasksPageTaskManager.menuTasks.click()

    const taskCard = page.getByRole('button', { name: 'Task Test Test' }).getByRole('link', { name: 'Edit' })

    await taskCard.click()

    await expect(tasksPageTaskManager.selectAssignee).toBeVisible();
    await expect(tasksPageTaskManager.inputTitle).toBeVisible();
    await expect(tasksPageTaskManager.inputContent).toBeVisible();
    await expect(tasksPageTaskManager.selectStatus).toBeVisible();
    await expect(tasksPageTaskManager.selectLabel).toBeVisible();
    await expect(tasksPageTaskManager.buttonSave).toBeVisible();
    await expect(tasksPageTaskManager.buttonDel).toBeVisible();
    await expect(tasksPageTaskManager.buttonShow).toBeVisible();

    await expect(page.getByLabel(tasksPageTaskManager.task.assignee)).toContainText(tasksPageTaskManager.task.assignee);
    await expect(tasksPageTaskManager.inputTitle).toHaveValue(tasksPageTaskManager.task.title);
    await expect(tasksPageTaskManager.inputContent).toHaveValue(tasksPageTaskManager.task.content);
    await expect(page.getByLabel(tasksPageTaskManager.task.status)).toContainText(tasksPageTaskManager.task.status);
    await expect(page.getByLabel(tasksPageTaskManager.task.label)).toContainText(tasksPageTaskManager.task.label);


})

test('редактирование задачи', async ({ page }) => {
    const tasksPageTaskManager = new TasksPage(page)

    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.buttonCreate.click()

    await tasksPageTaskManager.createTasks(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)

    await tasksPageTaskManager.buttonSave.click()
  
    await tasksPageTaskManager.menuTasks.click()

    const taskCard = page.getByRole('button', { name: 'Task Test Test' }).getByRole('link', { name: 'Edit' })

    await taskCard.click()

    await tasksPageTaskManager.inputTitle.fill('Other task')
    await tasksPageTaskManager.inputContent.fill('Other content')

    await tasksPageTaskManager.selectAssignee.click()
    await tasksPageTaskManager.page.getByRole('option', { name: 'john@google.com'}).click();
    await tasksPageTaskManager.selectStatus.click()
    await tasksPageTaskManager.page.getByRole('option', { name: 'To Review' }).click();
    await tasksPageTaskManager.selectLabel.click()
    await tasksPageTaskManager.page.getByRole('option', { name: 'task' }).click();
    await tasksPageTaskManager.page.getByRole('option', { name: 'bug' }).click();
    await tasksPageTaskManager.page.locator('.MuiBackdrop-root').click();

    await tasksPageTaskManager.buttonSave.click()

    await expect(tasksPageTaskManager.alert).toContainText('Element updated');

    const taskCardUpdate = page.getByRole('button', { name: 'Other task' })

    await expect(taskCardUpdate).toBeVisible();
    await expect(taskCard).not.toBeVisible();

    await taskCardUpdate.getByLabel('Show').click();

    await expect(page.getByText('john@google.com')).toBeVisible();
    await expect(page.locator('form')).toContainText('john@google.com');
    await expect(page.locator('form')).toContainText('Other task');
    await expect(page.locator('form')).toContainText('Other content');
    await expect(page.getByRole('link', { name: 'task'})).toBeVisible();
    await expect(page.getByRole('link', { name: 'bug'})).not.toBeVisible();

})

test('перемещение задачи между колонками', async ({ page }) => {
       const tasksPageTaskManager = new TasksPage(page)

    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.buttonCreate.click()

    await tasksPageTaskManager.createTasks(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)

    await tasksPageTaskManager.buttonSave.click()
  
    await tasksPageTaskManager.menuTasks.click()

    const taskCard = page.locator('[data-rfd-droppable-id="1"]').getByRole('button', { name: 'Task Test Test' })

    const targetColumn = page.locator('[data-rfd-droppable-id="2"]'); // To Review

// drag-and-drop через mouse events
  const cardBox = await taskCard.boundingBox();
  const targetBox = await targetColumn.boundingBox();

//Стартовые координаты карточки
  const startX = cardBox.x + cardBox.width / 2;
  const startY = cardBox.y + cardBox.height / 2;
//Конечные координаты в колонке 
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y; 

// мышь наведена на центр карточки
  await page.mouse.move(startX, startY);
  await page.mouse.down();

// первый сдвиг
  await page.mouse.move(startX + 5, startY + 5);
//ожидание
  await page.waitForTimeout(200);
// фиксируем шаг и сдвигаемся к конечной точке
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    const x = startX + ((endX - startX) * i) / steps;
    const y = startY + ((endY - startY) * i) / steps;
    await page.mouse.move(x, y);
    await page.waitForTimeout(50);
  }
//ожидание
  await page.waitForTimeout(300);
// отпускаем мышь
  await page.mouse.up();


    const taskCardNewStatus = page.locator('[data-rfd-droppable-id="2"]').getByRole('button', { name: 'Task Test Test' })

    await expect(taskCardNewStatus).toBeVisible();
    await expect(taskCard).not.toBeVisible();
});

})

test.describe('удаление задач', ()=>{

test('удаление задачи через редактирование', async ({ page }) => {
        const tasksPageTaskManager = new TasksPage(page)

    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.buttonCreate.click()

    await tasksPageTaskManager.createTasks(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)

    await tasksPageTaskManager.buttonSave.click()
  
    await tasksPageTaskManager.menuTasks.click()

    const taskCard = page.getByRole('button', { name: 'Task Test Test' }).getByRole('link', { name: 'Edit' })

    await taskCard.click()

    await tasksPageTaskManager.buttonDel.click()

    await expect(tasksPageTaskManager.alert).toContainText('Element deleted');

    await expect(taskCard).not.toBeVisible();
})


test('удаление задачи через просмотр', async ({ page }) => {
        const tasksPageTaskManager = new TasksPage(page)

    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.buttonCreate.click()

    await tasksPageTaskManager.createTasks(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)

    await tasksPageTaskManager.buttonSave.click()
  
    await tasksPageTaskManager.menuTasks.click()

    const taskCard = page.getByRole('button', { name: 'Task Test Test' }).getByRole('link', { name: 'Show' })

    await taskCard.click()

    await tasksPageTaskManager.buttonDel.click()

    await expect(tasksPageTaskManager.alert).toContainText('Element deleted');

    await expect(taskCard).not.toBeVisible();

})
})


