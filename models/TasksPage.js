export default class TasksPage{

     constructor(page) {
    this.page = page


    this.menuTasks =  page.getByRole('menuitem', { name: 'Tasks' })
    this.buttonCreate = page.getByRole('link', { name: 'Create' })
    this.buttonSave = page.getByRole('button', { name: 'Save' })

    this.buttonDel = page.getByRole('button', { name: 'Delete' })
    this.buttonShow = page.getByRole('link', { name: 'Show' })
    this.buttonEdit = page.getByRole('link', { name: 'Edit' })

    this.selectAssignee = page.getByRole('combobox', { name: 'Assignee' })
    this.inputTitle = page.getByRole('textbox', { name: 'Title' })
    this.inputContent = page.getByRole('textbox', { name: 'Content' })
    this.selectStatus= page.getByRole('combobox', { name: 'Status' })
    this.selectLabel = page.getByRole('combobox', { name: 'Label' })

    this.alert = page.getByRole('alert');

    this.task ={
        assignee:'emily@example.com',
        title:'Task Test',
        content:'Test',
        status:'Draft',
        label:'bug'
    }

    this.taskUpdate ={
        assignee:'john@google.com',
        title:'Other task',
        content:'Other content',
        status:'Draft',
        label:'bug'
    }


    this.columnStatus = [
        {
            name: 'Draft',
            id: '1'
        },
        {
            name: 'To Review',
            id: '2'
        },
        {
            name: 'To Be Fixed',
            id: '3'
        },
        {
            name: 'To Publish',
            id: '4'
        },
        {
            name: 'Published',
            id: '5'
        }

    ]

     }

    async createTasks(assignee,title,content,status,label){
        await this.selectAssignee.click()
        await this.page.getByRole('option', { name: assignee }).click();
        await this.selectStatus.click()
        await this.page.getByRole('option', { name: status }).click();
        await this.selectLabel.click()
        await this.page.getByRole('option', { name: label }).click();
        await this.page.locator('.MuiBackdrop-root').click();
        await this.inputTitle.fill(title)
        await this.inputContent.fill(content)
       
  }

    async completeСreationTask(assignee,title,content,status,label){
        await this.menuTasks.click()
        await this.buttonCreate.click()
        await this.createTasks(assignee,title,content,status,label)
        await this.buttonSave.click()
    }

    async editTask(title, content, assignee){
        await this.inputTitle.fill(title)
        await this.inputContent.fill(content)
        await this.selectAssignee.click()
        await this.page.getByRole('option', { name:assignee}).click();
        await this.selectStatus.click()
        await this.page.getByRole('option', { name: 'To Review' }).click();
        await this.selectLabel.click()
        await this.page.getByRole('option', { name: 'task' }).click();
        await this.page.getByRole('option', { name: 'bug' }).click();
        await this.page.locator('.MuiBackdrop-root').click();
        await this.buttonSave.click()
    }

    async moveTaskBetweenColumns(task, columnId){

    const taskCard = this.page.locator(task).getByRole('button', { name: `${this.task.title} ${this.task.content}` })
    const targetColumn = this.page.locator(columnId); 

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
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
// первый сдвиг
    await this.page.mouse.move(startX + 5, startY + 5);
//ожидание 
    await this.page.waitForTimeout(200);
// фиксируем шаг и сдвигаемся к конечной точке
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
    const x = startX + ((endX - startX) * i) / steps;
    const y = startY + ((endY - startY) * i) / steps;
    await this.page.mouse.move(x, y);
    await this.page.waitForTimeout(50); //даёт браузеру время обработать события
  }
//ожидание
    await this.page.waitForTimeout(300);
// отпускаем мышь
    await this.page.mouse.up();
    
    }

}