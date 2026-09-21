export default class LabelsPage{

     constructor(page) {
    this.page = page

    this.menuLabels =  page.getByRole('menuitem', { name: 'Labels' })
    this.buttonCreate = page.getByRole('link', { name: 'Create' })
    this.inputName = page.getByRole('textbox', { name: 'Name' })
    this.buttonSave = page.getByRole('button', { name: 'Save' })

    this.alert = page.getByRole('alert');

    this.buttonDel = page.getByRole('button', { name: 'Delete' })
    this.buttonShow = page.getByRole('link', { name: 'Show' })
    this.buttonEdit = page.getByRole('link', { name: 'Edit' })

    this.tableLabels = page.getByRole('table')

    this.label ={
        name:'minor'
    }

}

async createLabel(name ){
    await this.inputName.fill(name)
  }

async completeСreationLabel(name){
    await this.menuLabels.click()
    await this.buttonCreate.click()
    await this.createLabel(name)
    await this.buttonSave.click()
}

async openRow(name){
  await this.menuLabels.click()
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