export default class StatusesPage{

     constructor(page) {
    this.page = page

    this.menuStatuses =  page.getByRole('menuitem', { name: 'Task statuses' })
    this.buttonCreate = page.getByRole('link', { name: 'Create' })
    this.inputName = page.getByRole('textbox', { name: 'Name' })
    this.inputSlug = page.getByRole('textbox', { name: 'Slug' })
    this.buttonSave = page.getByRole('button', { name: 'Save' })

    this.alert = page.getByRole('alert');

    this.buttonDel = page.getByRole('button', { name: 'Delete' })
    this.buttonShow = page.getByRole('link', { name: 'Show' })
    this.buttonEdit = page.getByRole('link', { name: 'Edit' })

    this.tableStatuses = page.getByRole('table')

    this.status ={
        name:'Cancelled',
        slug:'cancelled'
    }

  this.statusesArr = [
    {
        id:'1',
        name:'Draft',
        slug:'draft'
    },
    {
        id:'2',
        name:'To Review',
        slug:'to_review'
    },
    {
        id:'3',
        name:'To Be Fixed',
        slug:'to_be_fixed'
    },
    {
        id:'4',
        name:'To Publish',
        slug:'to_publish'
    },
     {
        id:'5',
        name:'Published',
        slug:'published'
    }
  ]


}

async createStatus(name , slug){
    await this.inputName.fill(name)
    await this.inputSlug.fill(slug)
  }

async completeСreationStatus(name , slug){
    await this.menuStatuses.click()
    await this.buttonCreate.click()
    await this.createStatus(name , slug)
    await this.buttonSave.click()
}

}