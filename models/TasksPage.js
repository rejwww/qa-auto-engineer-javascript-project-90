export default class LabelsPage{

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


    this.tasksArr = [
        {
        id: '11',
        assignee:'john@google.com',
        title:'Task 11',
        content:'Description of task 11',
        status:'Draft',
        label: [
            'bug',
            'feature',
            'enhancement'
            ]
        },
         {
        id: '5',
        assignee:'john@google.com',
        title:'Task 5',
        content:'Description of task 5',
        status:'Draft'
        },
        {
        id: '2',
        assignee:'john@google.com',
        title:'Task 2',
        content:'Description of task 2',
        status:'To Review',
        label: [
            'bug',
            'feature'
            ]
        },
        {
        id: '12',
        assignee:'jack@yahoo.com',
        title:'Task 12',
        content:'Description of task 12',
        status:'To Review',
        label: [
            'feature',
            'enhancement',
            'task'
            ]
        },
        {
        id: '1',
        assignee:'john@google.com',
        title:'Task 1',
        content:'Description of task 1',
        status:'To Be Fixed'
        },
        {
        id: '13',
        assignee:'jack@yahoo.com',
        title:'Task 13',
        content:'Description of task 13',
        status:'To Be Fixed',
        label: [
            'enhancement',
            'task',
            'critical'
            ]
        },
        {
        id: '3',
        assignee:'jack@yahoo.com',
        title:'Task 3',
        content:'Description of task 3',
        status:'To Publish',
        label: [
            'bug'
            ]
        },
         {
        id: '4',
        assignee:'jack@yahoo.com',
        title:'Task 4',
        content:'Description of task 4',
        status:'Published',
        label: [
            'feature'
            ]
        }
    ]

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

}