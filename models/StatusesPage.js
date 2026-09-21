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

async openRow(name){
  await this.menuStatuses.click()
    const tr = this.page.getByRole('row')
                 .filter({ hasText: name })
    await tr.click()

}

async selectRow(name){
  const checkboxUser = this.page.getByRole('row')
                 .filter({ hasText: name})
                 .getByRole('checkbox')
  await checkboxUser.click()
}

}