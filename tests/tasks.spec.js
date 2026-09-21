import { test, expect }  from '../models/loggedPage.js'
import TasksPage from '../models/TasksPage.js'
import {tasksArr} from '../__fixtures__/tasksData.js'


test.describe('создание новых задач', ()=>{
test('отображение формы создания задачи', async ({ loggedPage }) => {
    const tasksPageTaskManager = new TasksPage(loggedPage)
    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.buttonCreate.click()

    await expect(tasksPageTaskManager.selectAssignee).toBeVisible();
    await expect(tasksPageTaskManager.inputTitle).toBeVisible();
    await expect(tasksPageTaskManager.inputContent).toBeVisible();
    await expect(tasksPageTaskManager.selectStatus).toBeVisible();
    await expect(tasksPageTaskManager.selectLabel).toBeVisible();
    await expect(tasksPageTaskManager.buttonSave).toBeVisible();
})

test('cоздание задачи', async ({ loggedPage }) => {
    const tasksPageTaskManager = new TasksPage(loggedPage)
    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.buttonCreate.click()
    await tasksPageTaskManager.createTasks(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)
    await tasksPageTaskManager.buttonSave.click()

    await expect(tasksPageTaskManager.alert).toContainText('Element created');
  
    await tasksPageTaskManager.menuTasks.click()
    const taskCard = loggedPage.getByRole('button', { name: `${tasksPageTaskManager.task.title} ${tasksPageTaskManager.task.content}` })

    await expect(taskCard).toBeVisible();

    await taskCard.getByLabel('Show').click();

    await expect(loggedPage.getByText(tasksPageTaskManager.task.assignee)).toBeVisible();
    await expect(loggedPage.locator('form')).toContainText(tasksPageTaskManager.task.assignee);
    await expect(loggedPage.locator('form')).toContainText(tasksPageTaskManager.task.title);
    await expect(loggedPage.locator('form')).toContainText(tasksPageTaskManager.task.content);
    await expect(loggedPage.getByRole('link', { name: tasksPageTaskManager.task.label })).toBeVisible();
})
})


test.describe('просмотр доски и фильтров', ()=>{
test('отображение доски задач', async ({ loggedPage }) => {
    const tasksPageTaskManager = new TasksPage(loggedPage)
    await tasksPageTaskManager.menuTasks.click()

    await expect(tasksPageTaskManager.selectAssignee).toBeVisible();
    await expect(tasksPageTaskManager.selectStatus).toBeVisible();
    await expect(tasksPageTaskManager.selectLabel).toBeVisible();
    await expect(loggedPage.getByRole('heading', { name: 'Draft' })).toBeVisible();
    await expect(loggedPage.getByRole('heading', { name: 'To Review' })).toBeVisible();
    await expect(loggedPage.getByRole('heading', { name: 'To Be Fixed' })).toBeVisible();
    await expect(loggedPage.getByRole('heading', { name: 'To Publish' })).toBeVisible();
    await expect(loggedPage.getByRole('heading', { name: 'Published' })).toBeVisible();

})

test('фильтрация', async ({ loggedPage }) => {
    const tasksPageTaskManager = new TasksPage(loggedPage)
    await tasksPageTaskManager.menuTasks.click()
    await tasksPageTaskManager.selectAssignee.click();
    await loggedPage.getByRole('option', { name: 'jack@yahoo.com' }).click();
    for(let assignee of tasksArr){
        const button = loggedPage.getByRole('button', {name: `${assignee.title} Description of task`});
        if(assignee.assignee == 'jack@yahoo.com'){
            await expect(button).toBeVisible();
        } else{
            await expect(button).not.toBeVisible();
        }
    }
    await loggedPage.getByRole('combobox', { name: 'Assignee jack@yahoo.com' }).click();
    await loggedPage.getByRole('option', { name: 'Clear value' }).click();

    await tasksPageTaskManager.selectStatus.click();

    await loggedPage.getByRole('option', { name: 'Draft'  }).click();

    for(let status of tasksArr){
        const button = loggedPage.getByRole('button', {name: `${status.title} Description of task`});
        if(status.status == 'Draft'){
            await expect(button).toBeVisible();
        } else{
            await expect(button).not.toBeVisible();
        }
    }
    await loggedPage.getByRole('combobox', { name: 'Status Draft' }).click();
    await loggedPage.getByRole('option', { name: 'Clear value' }).click();
    await tasksPageTaskManager.selectLabel.click();
    await loggedPage.getByRole('option', { name: 'bug'  }).click();
    for(let label of tasksArr){
        const button = loggedPage.getByRole('button', {name: `${label.title} Description of task` });
        if(label.label?.includes('bug') && label.label.length === 1){
            await expect(button).toBeVisible();
        } else {
            await expect(button).not.toBeVisible();
        }
    }
    await tasksPageTaskManager.selectStatus.click();
    await loggedPage.getByRole('option', { name: 'To Publish'  }).click();
    await tasksPageTaskManager.selectAssignee.click();
    await loggedPage.getByRole('option', { name: 'jack@yahoo.com' }).click();
    for(let task of tasksArr){
        const button = loggedPage.getByRole('button', {name: `${task.title} Description of task` });
        if(task.label?.includes('bug') && (task.assignee == 'jack@yahoo.com') && (task.status == 'To Publish')){
            await expect(button).toBeVisible();
        } else{
            await expect(button).not.toBeVisible();
        }
    }
})
})


test.describe('pедактирование информации задач', ()=>{
test('отображение страницы редактирования задачи', async ({ loggedPage }) => {
    const tasksPageTaskManager = new TasksPage(loggedPage)
    await tasksPageTaskManager.completeСreationTask(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)  
    await tasksPageTaskManager.menuTasks.click()
    const taskCard = loggedPage.getByRole('button', { name: `${tasksPageTaskManager.task.title} ${tasksPageTaskManager.task.content}` }).getByRole('link', { name: 'Edit' })
    await taskCard.click()

    await expect(tasksPageTaskManager.selectAssignee).toBeVisible();
    await expect(tasksPageTaskManager.inputTitle).toBeVisible();
    await expect(tasksPageTaskManager.inputContent).toBeVisible();
    await expect(tasksPageTaskManager.selectStatus).toBeVisible();
    await expect(tasksPageTaskManager.selectLabel).toBeVisible();
    await expect(tasksPageTaskManager.buttonSave).toBeVisible();
    await expect(tasksPageTaskManager.buttonDel).toBeVisible();
    await expect(tasksPageTaskManager.buttonShow).toBeVisible();
    await expect(loggedPage.getByLabel(tasksPageTaskManager.task.assignee)).toContainText(tasksPageTaskManager.task.assignee);
    await expect(tasksPageTaskManager.inputTitle).toHaveValue(tasksPageTaskManager.task.title);
    await expect(tasksPageTaskManager.inputContent).toHaveValue(tasksPageTaskManager.task.content);
    await expect(loggedPage.getByLabel(tasksPageTaskManager.task.status)).toContainText(tasksPageTaskManager.task.status);
    await expect(loggedPage.getByLabel(tasksPageTaskManager.task.label)).toContainText(tasksPageTaskManager.task.label);
})

test('редактирование задачи', async ({ loggedPage }) => {
    const tasksPageTaskManager = new TasksPage(loggedPage)
    await tasksPageTaskManager.completeСreationTask(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label) 
  
    await tasksPageTaskManager.menuTasks.click()
    const taskCard = loggedPage.getByRole('button', { name: `${tasksPageTaskManager.task.title} ${tasksPageTaskManager.task.content}`}).getByRole('link', { name: 'Edit' })
    await taskCard.click()
    await tasksPageTaskManager.editTask(tasksPageTaskManager.taskUpdate.title,tasksPageTaskManager.taskUpdate.content,
                                        tasksPageTaskManager.taskUpdate.assignee)
   
    await expect(tasksPageTaskManager.alert).toContainText('Element updated');

    const taskCardUpdate = loggedPage.getByRole('button', { name: 'Other task' })

    await expect(taskCardUpdate).toBeVisible();
    await expect(taskCard).not.toBeVisible();

    await taskCardUpdate.getByLabel('Show').click();

    await expect(loggedPage.getByText('john@google.com')).toBeVisible();
    await expect(loggedPage.locator('form')).toContainText('john@google.com');
    await expect(loggedPage.locator('form')).toContainText('Other task');
    await expect(loggedPage.locator('form')).toContainText('Other content');
    await expect(loggedPage.getByRole('link', { name: 'task'})).toBeVisible();
    await expect(loggedPage.getByRole('link', { name: 'bug'})).not.toBeVisible();
})

test('перемещение задачи между колонками', async ({ loggedPage }) => {
    const tasksPageTaskManager = new TasksPage(loggedPage)
    await tasksPageTaskManager.completeСreationTask(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)  
    await tasksPageTaskManager.menuTasks.click()

    await tasksPageTaskManager.moveTaskBetweenColumns('[data-rfd-droppable-id="1"]','[data-rfd-droppable-id="2"]')

    const taskCard = loggedPage.locator('[data-rfd-droppable-id="1"]').getByRole('button', { name: `${tasksPageTaskManager.task.title} ${tasksPageTaskManager.task.content}` })
    const taskCardNewStatus = loggedPage.locator('[data-rfd-droppable-id="2"]').getByRole('button', { name: `${tasksPageTaskManager.task.title} ${tasksPageTaskManager.task.content}` })

    await expect(taskCardNewStatus).toBeVisible();
    await expect(taskCard).not.toBeVisible();
})
})

test.describe('удаление задач', ()=>{
test('удаление задачи через редактирование', async ({ loggedPage }) => {
    const tasksPageTaskManager = new TasksPage(loggedPage)
    await tasksPageTaskManager.completeСreationTask(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label)   
    await tasksPageTaskManager.menuTasks.click()
    const taskCard = loggedPage.getByRole('button', { name: `${tasksPageTaskManager.task.title} ${tasksPageTaskManager.task.content}` }).getByRole('link', { name: 'Edit' })
    await taskCard.click()
    await tasksPageTaskManager.buttonDel.click()

    await expect(tasksPageTaskManager.alert).toContainText('Element deleted');
    await expect(taskCard).not.toBeVisible();
})


test('удаление задачи через просмотр', async ({ loggedPage }) => {
    const tasksPageTaskManager = new TasksPage(loggedPage)
    await tasksPageTaskManager.completeСreationTask(tasksPageTaskManager.task.assignee,tasksPageTaskManager.task.title,
                                           tasksPageTaskManager.task.content, tasksPageTaskManager.task.status,
                                           tasksPageTaskManager.task.label) 
    await tasksPageTaskManager.menuTasks.click()
    const taskCard = loggedPage.getByRole('button', { name: `${tasksPageTaskManager.task.title} ${tasksPageTaskManager.task.content}` }).getByRole('link', { name: 'Show' })
    await taskCard.click()
    await tasksPageTaskManager.buttonDel.click()

    await expect(tasksPageTaskManager.alert).toContainText('Element deleted');
    await expect(taskCard).not.toBeVisible();
})
})


